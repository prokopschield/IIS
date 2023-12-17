import { user } from "@prisma/client";
import assert from "assert";
import { hash } from "doge-passwd";
import { createTransport, SendMailOptions } from "nodemailer";
import { filterUsername, Lock, omit, pick } from "ps-std";
import { converter } from "./converter";

import { database } from "./database";
import { jwt2url, setupJwt } from "./jwt";

export type Mail = SendMailOptions & {
	to: string;
	subject: string;
} & ({ html: string } | { text: string });

export const mailer = createTransport({
	host: String(process.env.MAIL_HOST || "smtp.seznam.cz"),
	port: Number(process.env.MAIL_PORT || 465),
	secure: Boolean(process.env.MAIL_SECURE ?? true),
	auth: {
		user: String(process.env.MAIL_USER),
		pass: String(process.env.MAIL_PASS),
	},
});

export async function sendMail(mail: Mail) {
	return await mailer.sendMail({
		...mail,
		from: String(process.env.MAIL_USER),
	});
}

const LOCK = new Lock();

const EMAIL_IN_USE = Symbol("EMAIL_IN_USE");

async function confirmEmailChange(
	user_id: string,
	email: string,
	redirect: string
) {
	const lock = await LOCK.wait_and_lock();

	try {
		const existing = await database.user.findFirst({ where: { email } });

		if (existing) {
			throw EMAIL_IN_USE;
		}

		await database.user.update({
			where: { id: BigInt(user_id) },
			data: { email },
		});

		lock.release();

		return { redirect };
	} catch (error) {
		lock.release();

		throw error;
	}
}

export async function requestEmailChange(
	user_id: bigint,
	email: string,
	redirect: string
) {
	email = email.trim();

	assert(email.includes("@"));

	const user = await database.user.findFirstOrThrow({
		where: { id: user_id },
	});

	const jwt = await setupJwt(confirmEmailChange, [
		String(user.id),
		email,
		redirect,
	]);

	await sendMail({
		to: email,
		subject: "IS CAMP: Nastavení nové e-mailové adresy",
		html: converter.makeHtml(
			`
# IS CAMP

Pro potvrzení změny e-mailové adresy pro účet ${user.username} (${
				user.displayname
			}) prosím klikněte na tento odkaz: [odkaz](${jwt2url(jwt)})

S přáním pěkného dne, <br/> IS CAMP`
		),
	});
}

async function confirmRegistration(
	info: Omit<user, "id" | "username" | "timestamp"> & {
		password_hash: string;
		redirect: string;
	}
) {
	const username = filterUsername(info.displayname);
	const lock = await LOCK.wait_and_lock();

	try {
		const existing = await database.user.findFirst({
			where: { OR: [{ username }, { email: info.email }] },
		});

		assert(existing === null, "Name or email is already in use.");

		await database.user.create({
			data: {
				...omit(info, ["password_hash", "redirect"]),
				username,
				auth: {
					create: { method: "password", secret: info.password_hash },
				},
			},
		});

		lock.release();

		return pick(info, ["redirect"]);
	} catch (error) {
		lock.release();

		throw error;
	}
}

export async function requestRegistration(
	info: Omit<user, "id" | "username" | "timestamp">,
	password: string,
	redirect: string
) {
	info.email = info.email.trim();

	assert(info.email.includes("@"));

	const username = filterUsername(info.displayname);

	const same_username = await database.user.findFirst({
		where: { username },
	});

	if (same_username) {
		throw "USERNAME_TAKEN";
	}

	const same_email = await database.user.findFirst({
		where: { email: info.email },
	});

	if (same_email) {
		return requestPasswordReset(info.email, password, redirect);
	}

	const jwt = await setupJwt(confirmRegistration, [
		{ ...info, password_hash: hash(password), redirect },
	]);

	await sendMail({
		to: info.email,
		subject: "IS CAMP: Registrace",
		html: converter.makeHtml(
			`
# IS CAMP

Děkujeme za registraci v systému IS CAMP.
Pro její potvrzení prosím klikněte na tento odkaz: [odkaz](${jwt2url(jwt)})

S přáním pěkného dne, <br/> IS CAMP`
		),
	});
}

async function confirmPasswordReset({
	email,
	password_hash,
	redirect,
}: {
	email: string;
	password_hash: string;
	redirect: string;
}) {
	const lock = await LOCK.wait_and_lock();

	try {
		const user = await database.user.findFirstOrThrow({ where: { email } });

		await database.auth.deleteMany({
			where: {
				method: "password",
				user: { email },
			},
		});

		await database.auth.create({
			data: {
				user_id: user.id,
				method: "password",
				secret: password_hash,
			},
		});

		lock.release();

		return { redirect };
	} catch (error) {
		lock.release();

		throw error;
	}
}

export async function requestPasswordReset(
	email: string,
	password: string,
	redirect: string
) {
	email = email.trim();

	assert(email.includes("@"));

	const user = await database.user.findFirstOrThrow({ where: { email } });

	const jwt = await setupJwt(confirmPasswordReset, [
		{ email, password_hash: hash(password), redirect },
	]);

	await sendMail({
		to: email,
		subject: "IS CAMP: Nastavení nového hesla",
		html: converter.makeHtml(
			`
# IS CAMP

Přijali jsme žádost na změnu hesla uživatele ${user.username} (${
				user.legal_name
			}).
Pro její potvrzení prosím klikněte na tento odkaz: [odkaz](${jwt2url(jwt)})

S přáním pěkného dne, <br/> IS CAMP`
		),
	});
}

setupJwt(confirmEmailChange, []);
setupJwt(confirmRegistration, []);
setupJwt(confirmPasswordReset, []);

const fast_registration_lock = new Lock();

export async function get_unique_username(username: string) {
	const base = filterUsername(username);

	for (let number = 0; ; number++) {
		username = `${base}${number || ""}`;

		const existing = await database.user.findFirst({ where: { username } });

		if (!existing) {
			return username;
		}
	}
}

export async function fast_registration(
	email: string,
	legal_name: string,
	legal_guardian: string,
	legal_guardian_contact: string,
	redirect: string
) {
	const lock = await fast_registration_lock.wait_and_lock();

	try {
		const redirect_url = new URL(redirect, process.env.URL_BASE);
		const existing = await database.user.findFirst({ where: { email } });

		if (existing) {
			lock.release();

			await database.user.update({
				where: pick(existing, ["id"]),
				data: {
					legal_name: existing.legal_name || legal_name,
					legal_guardian: existing.legal_guardian || legal_guardian,
					legal_guardian_contact:
						existing.legal_guardian_contact ||
						legal_guardian_contact,
				},
			});

			return existing;
		}

		const auth_secret = hash(hash(email));
		const secret = hash(auth_secret);

		const displayname = legal_name;
		const username = await get_unique_username(displayname);

		redirect_url.searchParams.set("username", username);
		redirect_url.searchParams.set("emtoken", auth_secret);

		const created = await database.user.create({
			data: {
				username,
				displayname,
				email,
				legal_guardian,
				legal_guardian_contact,
				legal_name,
				auth: {
					create: {
						method: "emtoken",
						secret,
					},
				},
			},
		});

		lock.release();

		await sendMail({
			to: email,
			subject: "[IS CAMP] Registrace na kemp",
			html: converter.makeHtml(`# IS CAMP

Byl Vám vygenerován přístup do systému IS CAMP.
Vaše uživatelské jméno je ${username}.

Pro přihlášení do informačního systému IS CAMP použijte tento [odkaz](${redirect_url}).`),
		});

		return created;
	} catch (error) {
		lock.release();

		throw error;
	}
}

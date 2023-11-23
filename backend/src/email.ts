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

	const jwt = await setupJwt(confirmRegistration, [
		{ ...info, password_hash: hash(password), redirect },
	]);

	await sendMail({
		to: info.email,
		subject: "IS CAMP: Nastavení nové e-mailové adresy",
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
	info: Omit<user, "id" | "username" | "timestamp">,
	password: string,
	redirect: string
) {
	info.email = info.email.trim();

	assert(info.email.includes("@"));

	const jwt = await setupJwt(confirmPasswordReset, [
		{ ...info, password_hash: hash(password), redirect },
	]);

	await sendMail({
		to: info.email,
		subject: "IS CAMP: Nastavení nové e-mailové adresy",
		html: converter.makeHtml(
			`
# IS CAMP

Děkujeme za registraci v systému IS CAMP.
Pro její potvrzení prosím klikněte na tento odkaz: [odkaz](${jwt2url(jwt)})

S přáním pěkného dne, <br/> IS CAMP`
		),
	});
}

setupJwt(confirmEmailChange, []);
setupJwt(confirmRegistration, []);
setupJwt(confirmPasswordReset, []);

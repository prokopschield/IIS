import { Server } from "@prokopschield/simple-socket-server";
import assert from "assert";
import { hash, verify } from "doge-passwd";
import http from "http";
import { Source } from "nsblob-native-stream";
import { filterUsername } from "ps-std";

import { database } from "./database";
import { requestEmailChange, requestRegistration } from "./email";
import { success } from "./helpers";
import { executeJwt } from "./jwt";

Object.assign(BigInt.prototype, {
	toJSON() {
		return String(this);
	},
});

export async function main() {
	const server = new Server(
		{},
		{
			async login(_socket, state, username, secret) {
				assert(typeof username === "string");
				assert(typeof secret === "string");

				const auths = await database.auth.findMany({
					where: {
						user: {
							username,
						},
					},
				});

				for (const auth of auths) {
					if (secret === auth.secret || verify(secret, auth.secret)) {
						await database.auth.deleteMany({
							where: {
								method: "session",
								user_id: auth.user_id,
							},
						});

						const token = hash(auth.secret);

						const session = await database.auth.create({
							include: { user: true },
							data: {
								user_id: auth.user_id,
								method: "session",
								secret: hash(token),
							},
						});

						state.set("user_id", String(session.user_id));
						state.set("username", session.user.username);
						state.set("token", token);

						return success({ token, ...session.user });
					}
				}

				return { success: false };
			},

			async session(_socket, state, username, token) {
				assert(typeof username === "string");
				assert(typeof token === "string");

				for (const session of await database.auth.findMany({
					include: { user: true },
					where: {
						user: { username },
						method: "session",
					},
				})) {
					if (verify(token, session.secret)) {
						state.set("user_id", String(session.user_id));
						state.set("username", session.user.username);
						state.set("token", token);

						return success({ token, ...session.user });
					}
				}
			},

			async register(_socket, _state, info) {
				for (const key of [
					"legal_name",
					"legal_guardian",
					"legal_guardian_contact",
					"email",
				]) {
					if (
						typeof info[key] !== "undefined" &&
						!(
							typeof info[key] === "string" &&
							info[key].length <= 64
						)
					) {
						return { error: "INVALID_INFO" };
					}
				}

				let {
					displayname,
					legal_name,
					legal_guardian,
					legal_guardian_contact,
					email,
					password,
					redirect,
				} = info;

				if (typeof displayname !== "string" || displayname.length < 8) {
					return { error: "DISPLAYNAME_TOO_SHORT" };
				} else if (displayname.length > 64) {
					return { error: "DISPLAYNAME_TOO_LONG" };
				}

				password ||= filterUsername(hash(hash("")))

				await requestRegistration(
					{
						displayname,
						legal_name,
						legal_guardian,
						legal_guardian_contact,
						email,
					},
					password,
					redirect
				);

				return { password, status: "EMAIL_SENT" };
			},

			async change_my_info(_socket, state, info) {
				const user_id = BigInt(state.get("user_id") || NaN);

				const {
					displayname,
					legal_name,
					legal_guardian,
					legal_guardian_contact,
					email,
					redirect,
				} = info;

				if (email) {
					await requestEmailChange(
						user_id,
						String(email),
						String(redirect)
					);
				}

				return success(
					await database.user.update({
						data: {
							displayname,
							legal_name,
							legal_guardian,
							legal_guardian_contact,
						},
						where: { id: user_id },
					})
				);
			},

			async attendee_my_camps(_socket, state) {
				const user_id = BigInt(state.get("user_id") || NaN);

				return success({
					camps: await database.camp.findMany({
						include: {
							leader: {
								include: {
									user: {
										select: {
											legal_name: true,
										},
									},
								},
							},
						},
						where: {
							attendee: { some: { attendee_id: user_id } },
						},
					}),
				});
			},

			async attendee_my_activities(_socket, state) {
				const user_id = BigInt(state.get("user_id") || NaN);

				return success({
					activities: await database.activity.findMany({
						include: {
							attended: {
								include: {
									attendee: {
										include: {
											user: {
												select: {
													displayname: true,
													username: true,
												},
											},
										},
									},
								},
							},
						},
						where: {
							attended: {
								some: { attendee: { attendee_id: user_id } },
							},
						},
					}),
				});
			},
		}
	);

	const { app } = server;

	server.http.listen(Number(process.env.PORT || 4173));

	app.get("/jwt/:hash", async (request, response, next) => {
		try {
			const { redirect } = await executeJwt(request.params.hash);

			await Source.fromStream(request);

			return response.status(302).setHeader("Location", redirect).end();
		} catch {
			return next();
		}
	});

	app.use(async (request, response) => {
		const url = new URL(request.url, "http://frontend:4173");

		const prequest = http.request(
			url.href,
			{ headers: request.headers },
			(presponse) => {
				response.status(presponse.statusCode || 200);

				for (const [key, value] of Object.entries(presponse.headers)) {
					response.setHeader(key, String(value));
				}

				presponse.pipe(response);
			}
		);

		request.pipe(prequest);
	});
}

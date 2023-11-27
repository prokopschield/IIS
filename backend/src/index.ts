import { activity } from "@prisma/client";
import { Server } from "@prokopschield/simple-socket-server";
import assert from "assert";
import { hash, verify } from "doge-passwd";
import http from "http";
import { Source } from "nsblob-native-stream";
import path from "path";
import { filterUsername } from "ps-std";
import { listener, uploadStream } from "v3cdn.nodesite.eu";

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

				password ||= filterUsername(hash(hash("")));

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

				return success({ password, status: "EMAIL_SENT" });
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

			async load_roles(_socket, state) {
				const user_id = BigInt(state.get("user_id") || NaN);

				const data = await database.user.findFirst({
					where: { id: user_id },
					include: {
						attendee: true,
						camp: true,
						leader: true,
					},
				});

				return { success: true, data };
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

			async load_attendee(_socket, state) {
				const user_id = BigInt(state.get("user_id") || NaN);

				const attended_camps = await database.attendee.findMany({
					include: {
						camp: {
							include: {
								attendee: {
									include: {
										user: true,
									},
								},
								activity: {
									include: {
										attended: {
											where: {
												attendee: {
													attendee_id: user_id,
												},
											},
										},
									},
								},
							},
						},
						attended: {
							include: {
								activity: true,
							},
						},
					},
					where: { attendee_id: user_id },
				});

				const camps = attended_camps.map(({ attended, camp }) => {
					return {
						name_of_camp: camp.name,
						next_activities: camp.activity.filter(
							(activity) => !activity.attended.length
						),
						amount_of_points: attended
							.map(
								({ activity: { points }, score }) =>
									points * score
							)
							.reduce((next, previous) => next + previous),
						all_attendees: camp.attendee.map(
							(attendee) => attendee.user
						),
					};
				});

				return { camps, success: true };
			},

			async attendee_load_activities(_socket, state) {
				const user_id = BigInt(state.get("user_id") || NaN);

				const data = await database.user.findFirstOrThrow({
					include: {
						attendee: {
							include: {
								attended: true,
								camp: { include: { activity: true } },
							},
						},
					},
					where: { id: user_id },
				})!;

				const all_upcoming_activities = new Array<activity>();
				const all_evaluated_activities = new Array<activity>();

				data.attendee.forEach(({ attended, camp }) => {
					for (const activity of camp.activity) {
						if (
							attended.some(
								(attended) =>
									attended.activity_id === activity.id
							)
						) {
							all_evaluated_activities.push(activity);
						} else {
							all_upcoming_activities.push(activity);
						}
					}
				});

				return success({
					all_upcoming_activities,
					all_evaluated_activities,
				});
			},

			async attendee_camp_info(_socket, state, camp_id: unknown) {
				const user_id = BigInt(state.get("user_id") || NaN);

				assert(typeof camp_id === "number");

				const info = await database.attendee.findFirst({
					include: {
						attended: {
							include: { activity: true },
						},
						camp: {
							include: {
								user: true,
								leader: {
									include: {
										user: true,
									},
								},
							},
						},
					},
					where: { camp_id, attendee_id: user_id },
				});

				return { success: true, ...info };
			},

			async leader_my_camps(_socket, state) {
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
							leader: { some: { user_id } },
						},
					}),
				});
			},

			async leader_camp_info(_socket, state, camp_id: unknown) {
				const user_id = BigInt(state.get("user_id") || NaN);

				assert(typeof camp_id === "number");

				const info = await database.leader.findFirst({
					include: {
						camp: {
							include: {
								user: true,
								leader: {
									include: {
										user: true,
									},
								},
								attendee: {
									include: { user: true, attended: true },
								},
								activity: {
									include: {
										attended: {
											include: {
												attendee: {
													include: {
														user: true,
													},
												},
											},
										},
									},
								},
							},
						},
					},
					where: { camp_id, user_id },
				});

				return { success: true, ...info };
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

	app.get("/file/:id", async (request, response) => {
		const id = Number(request.params.id);
		const file = await database.file.findFirst({ where: { id } });

		if (file) {
			request.url = "/" + file.hash;

			return listener(request, response);
		} else {
			response.sendStatus(404);
		}
	});

	app.put("/file/new", async (request, response) => {
		const type = request.headers["content-type"] || "text/plain";

		const { pathname } = await uploadStream(
			request,
			path.basename(request.url),
			type
		);

		const hash = pathname.slice(1);

		const { id } = await database.file.create({
			data: { hash, type },
		});

		return id;
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

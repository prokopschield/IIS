import { activity, user } from "@prisma/client";
import { Server } from "@prokopschield/simple-socket-server";
import assert from "assert";
import { hash, verify } from "doge-passwd";
import http from "http";
import { Source } from "nsblob-native-stream";
import { deserialize, serialize } from "nscdn-objects";
import path from "path";
import { cacheFn, filterUsername } from "ps-std";
import { Socket } from "socket.io";
import { listener, uploadStream } from "v3cdn.nodesite.eu";

import { database } from "./database";
import {
	fast_registration,
	requestEmailChange,
	requestRegistration,
} from "./email";
import { get_activity_total_points, success } from "./helpers";
import { executeJwt } from "./jwt";
import { getUserById, user_map } from "./user_cache";

Object.assign(BigInt.prototype, {
	toJSON() {
		return String(this);
	},
});

export async function main() {
	const user_socket_map = new Map<bigint, Socket>();

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

			async session(socket, state, username, token) {
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

						user_socket_map.set(session.user_id, socket);

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
					} else if (!info[key]) {
						info[key] = "";
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
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

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

				const updated: user = await database.user.update({
					data: {
						displayname,
						legal_name,
						legal_guardian,
						legal_guardian_contact,
					},
					where: { id: user_id },
				});

				user_map.set(updated.id, updated);

				return success(updated);
			},

			async load_roles(_socket, state) {
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

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
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

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
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

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
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

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

				const total_cached = cacheFn(get_activity_total_points);

				const camps = await Promise.all(
					attended_camps.map(async ({ attended, camp }) => {
						const points = await Promise.all(
							attended.map(async ({ activity, score }) => {
								return (
									(activity.points * score) /
									(await total_cached(activity.id))
								);
							})
						);

						return {
							name_of_camp: camp.name,
							next_activities: camp.activity.filter(
								(activity) => !activity.attended.length
							),
							amount_of_points: points.reduce(
								(next, previous) => next + previous,
								0
							),
							all_attendees: camp.attendee.map(
								(attendee) => attendee.user
							),
						};
					})
				);

				return { camps, success: true };
			},

			async attendee_load_activities(_socket, state) {
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

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
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

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
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

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
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

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
										leader: {
											include: {
												user: true,
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

			async leader_create_activity(
				_socket,
				state,
				camp_id,
				name,
				description,
				points
			) {
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

				assert(typeof camp_id === "number");
				assert(typeof name === "string");
				assert(typeof description === "string");
				assert(typeof points === "number");

				const leader = await database.leader.findFirstOrThrow({
					where: {
						user_id,
						camp_id,
					},
				});

				const activity = await database.activity.create({
					data: {
						camp_id,
						leader_id: leader.id,
						name,
						description,
						points,
					},
				});

				return { success: true, activity };
			},

			async leader_get_activity(_socket, state, camp_id, activity_id) {
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

				assert(typeof camp_id === "number");
				assert(typeof activity_id === "number");

				const activity = await database.activity.findFirstOrThrow({
					where: {
						id: activity_id,
						camp_id,
						camp: { leader: { some: { user_id } } },
					},
					include: {
						attended: {
							include: {
								attendee: { include: { user: true } },
							},
						},
						camp: {
							include: { attendee: { include: { user: true } } },
						},
					},
				});

				return { success: true, activity };
			},

			async leader_set_score(
				_socket,
				state,
				activity_id,
				attendee_id,
				score
			) {
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

				assert(typeof activity_id === "number");
				assert(typeof attendee_id === "number");
				assert(typeof score === "number");

				const attendee = await database.attendee.findFirstOrThrow({
					where: { id: attendee_id },
				});

				const activity = await database.activity.findFirstOrThrow({
					where: {
						id: activity_id,
					},
					include: {
						leader: true,
					},
				});

				assert(activity.leader.user_id === user_id);
				assert(attendee.camp_id === activity.camp_id);

				const existing = await database.attended.findFirst({
					where: {
						activity_id,
						attendee_id,
					},
				});

				const attended = existing
					? await database.attended.update({
							where: { id: existing.id },
							data: { score, timestamp: new Date() },
					  })
					: await database.attended.create({
							data: {
								activity_id,
								attendee_id,
								score,
							},
					  });

				return { success: true, attended };
			},

			async organizer_my_camps(_socket, state) {
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

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
							organizer_id: user_id,
						},
					}),
				});
			},

			async organizer_camp_info(_socket, state, camp_id: unknown) {
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

				assert(typeof camp_id === "number");

				const camp = await database.camp.findFirstOrThrow({
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
								leader: {
									include: {
										user: true,
									},
								},
							},
						},
					},

					where: {
						id: camp_id,
					},
				});

				assert(camp.organizer_id === user_id);

				return { success: true, camp };
			},

			async organizer_new_camp(
				_socket,
				state,
				camp_data,
				redirect_leader,
				redirect_attendee
			) {
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

				assert(typeof redirect_leader === "string");
				assert(typeof redirect_attendee === "string");

				const camp = await database.camp.create({
					data: {
						name: camp_data.name,
						web: camp_data.web,
						organizer_id: user_id,
						leader: {
							createMany: {
								data: await Promise.all(
									camp_data.leaders.map(
										async (leader: any) => {
											const user =
												await fast_registration(
													leader.email,
													leader.legal_name,
													"",
													"",
													redirect_leader
												);

											return { user_id: user.id };
										}
									)
								),
							},
						},
						attendee: {
							createMany: {
								data: await Promise.all(
									camp_data.attendees.map(
										async (attendee: any) => {
											const user =
												await fast_registration(
													attendee.email,
													attendee.legal_name,
													attendee.legal_guardian,
													attendee.legal_guardian_contact,
													redirect_attendee
												);

											return { attendee_id: user.id };
										}
									)
								),
							},
						},
					},
				});

				return { success: true, camp };
			},

			async query_dms(
				_socket,
				state,
				interlocutor_query,
				take = 20,
				before = 0
			) {
				const user: user = await database.user.findFirstOrThrow({
					where: { id: BigInt(state.get("user_id") || "") },
				});

				const interlocutor = await database.user.findFirstOrThrow({
					where: Number(interlocutor_query)
						? { id: Number(interlocutor_query) }
						: {
								username: filterUsername(
									String(interlocutor_query)
								),
						  },
				});

				before ||= Number.MAX_SAFE_INTEGER;

				const messages = await database.dm.findMany({
					take,
					where: {
						id: { lt: before },
						OR: [
							{
								sender_id: user.id,
								recipient_id: interlocutor.id,
							},
							{
								recipient_id: user.id,
								sender_id: interlocutor.id,
							},
						],
					},
					orderBy: {
						id: "desc",
					},
				});

				for (const message of messages) {
					const data = await deserialize(message.hash);

					Object.assign(data, message);

					try {
						Object.assign(message, data);
					} catch (error) {
						Object.assign(message, { data, error });
					}
				}

				return success({ messages });
			},

			async get_dm_interlocutors(_socket, state) {
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

				const interlocutors = await database.$queryRaw`
					SELECT DISTINCT
						CASE
							WHEN d.sender_id = ${user_id} THEN d.recipient_id
							ELSE d.sender_id
						END AS interlocutor_id
					FROM dm d
					WHERE ${user_id} IN (d.sender_id, d.recipient_id)`;

				assert(Array.isArray(interlocutors));

				return success({
					interlocutors: interlocutors.map(({ interlocutor_id }) =>
						getUserById(interlocutor_id)
					),
				});
			},

			async send_dm(socket, state, interlocutor_query, message) {
				const user_id: bigint = BigInt(state.get("user_id") || NaN);

				const interlocutor = await database.user.findFirstOrThrow({
					where: Number(interlocutor_query)
						? { id: Number(interlocutor_query) }
						: {
								username: filterUsername(
									String(interlocutor_query)
								),
						  },
				});

				const message_object = await database.dm.create({
					data: {
						sender_id: user_id,
						recipient_id: interlocutor.id,
						hash: await serialize(message),
					},
				});

				Object.assign(message, message_object);

				const recipient_socket = user_socket_map.get(interlocutor.id);

				if (recipient_socket) {
					recipient_socket.emit("DM", user_id, message);
				}

				socket.emit("DM", interlocutor.id, message);

				return success({ message });
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
		} catch (error) {
			console.error("JWT error", request.params.hash, error);

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

	app.all("*", async (request, response) => {
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

import { Server } from "@prokopschield/simple-socket-server";
import assert from "assert";
import { hash, verify } from "doge-passwd";
import http from "http";
import { database } from "./database";
import { success } from "./helpers";

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
		}
	);

	const { app } = server;

	app.listen(Number(process.env.PORT || 4173));

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

import { createClient } from "@prokopschield/simple-socket-client";

export const [client, socket] = createClient("https://camp.fitvut.cz")

export const backend = new Proxy(client, {
	get(key) {
		const handler = client[String(key)];

		return async function backend_handler(...args: any[]) {
			const { error, success, ...rest } = await handler(...args);

			if (error) {
				throw error;
			} else if (!success) {
				throw "Failed to communicate with backend";
			} else {
				return rest
			}
		}
	}
})
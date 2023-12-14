import * as base64 from "@prokopschield/base64";

import { database } from "./database";

export function success<T extends Record<any, any>>(
	arg: T
): T & { success: true } {
	return { success: true, ...arg };
}

export function eh64(hex: string) {
	return base64.encode(Buffer.from(hex, "hex"));
}

export function e64h(base64str: string) {
	return Buffer.from(base64.decode(base64str)).toString("hex");
}

export async function get_activity_total_points(activity_id: bigint) {
	const promise = database.$queryRaw`
		SELECT SUM(score) AS total
		FROM attended
		WHERE activity_id = ${activity_id}` as Promise<{ total: number }>;

	const { total } = await promise;

	return Number(total);
}

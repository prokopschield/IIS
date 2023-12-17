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
		WHERE activity_id = ${activity_id}` as Promise<[{ total: number }]>;

	const [{ total }] = await promise;

	return Number(total);
}

/** Check if a user should have access to data about a camp */
export async function isCampMember(user_id: bigint, camp_id: bigint) {
	user_id = BigInt(user_id);
	camp_id = BigInt(camp_id);

	const attendee = await database.attendee.findFirst({
		where: { attendee_id: user_id, camp_id },
	});

	if (attendee) {
		return attendee;
	}

	const leader = await database.leader.findFirst({
		where: { user_id, camp_id },
	});

	if (leader) {
		return leader;
	}

	const camp = await database.camp.findFirst({
		where: { organizer_id: user_id, id: camp_id },
	});

	if (camp) {
		return camp;
	}

	return false;
}

export type sumable = bigint | number | string | sumable[];

export function sum(...numbers: sumable[]): number {
	let total = 0;

	for (const number of numbers) {
		if (Array.isArray(number)) {
			total += sum(...number);
		} else {
			total += Number(number) || 0;
		}
	}

	return total;
}

export function round(number: number, precision = 2) {
	const multiplier = 10 ** Math.round(precision);

	return Math.round(number * multiplier) / multiplier;
}

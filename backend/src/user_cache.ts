import { user } from "@prisma/client";
import { database } from "./database";

export const user_map = new Map<bigint, user>();

export async function getUserById(id: bigint) {
	const cached = user_map.get(id);

	if (cached) {
		return cached;
	}

	const fetched = await database.user.findFirstOrThrow({ where: { id } });

	user_map.set(id, fetched);

	return fetched;
}

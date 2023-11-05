import assert from "assert";
import { Token, usePrivateKeyFile } from "nscdn-jwt";
import { deserialize, serialize } from "nscdn-objects";
import { cacheFn } from "ps-std";

import { URL_BASE } from "./config";

const callback_map = new Map<string, Function>();

const privkey_promise = usePrivateKeyFile();
const pubkey_promise = privkey_promise.then((key) => key.toPublic());

export const callback2ref = cacheFn(async (callback: Function) => {
	const ref = await serialize(callback);

	callback_map.set(ref, callback);

	return ref;
});

export async function setupJwt<T>(
	callback: (...args: T[]) => any,
	args: T[]
): Promise<string> {
	const callback_ref = await callback2ref(callback);
	const args_ref = await serialize(args);
	const token = new Token<[string, string]>([callback_ref, args_ref]);
	const privkey = await privkey_promise;

	await token.sign(privkey);

	return await token.hash();
}

export async function executeJwt(hash: string) {
	const { data } = await Token.fromHash(hash, await pubkey_promise);

	assert(Array.isArray(data));

	const [callback_ref, args_ref] = data;

	assert(typeof callback_ref === "string");
	assert(typeof args_ref === "string");

	const callback = callback_map.get(callback_ref);
	const args = await deserialize(args_ref);

	return await callback?.(...args);
}

export function jwt2url(jwt: string) {
	return new URL(`/jwt/${jwt}`, URL_BASE);
}

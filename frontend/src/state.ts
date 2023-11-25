import { encode, decode } from "doge-don";
import { cacheFn, defineGlobal } from "ps-std";
import { writable } from "svelte/store";

export const state = cacheFn(<T>(key: string) => {
	let value: T | undefined = decode(localStorage.getItem(key) || "");

	const store = writable<T>(value);

	store.subscribe((newValue: T) => {
		value = newValue;
		localStorage.setItem(key, encode(value));
	});

	return {
		get value() {
			return value;
		},
		set value(newValue) {
			if (newValue !== undefined) {
				store.set(newValue);
			}
		},
		...store,
	};
});

defineGlobal("state", state);

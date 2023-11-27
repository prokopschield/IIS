import { encode, decode } from "doge-don";
import { cacheFn, defineGlobal } from "ps-std";
import { writable } from "svelte/store";
import { backend, socket } from "./backend";

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

export const page = state<string>("page");
export const authenticated = state<boolean>("authenticated");
export const loading = state<boolean>("loading");

export const user = state<{
	id: string;
	username: string;
	displayname: string;
	legal_name: string;
	legal_guardian: string;
	legal_guardian_contact: string;
	email: string;
	token: string;
}>("user");

loading.set(true);

page.set(location.pathname);

page.subscribe((new_page) => history.pushState(undefined, "", new_page));

async function page_load() {
	loading.set(true)
	
	for (const [key, value] of new URL(location.href).searchParams.entries()) {
		state(key).set(value);
	}

	if (user.value?.username && user.value?.token) {
		try {
			const userdata = await backend.session(
				user.value?.username,
				user.value?.token
			);

			user.set(userdata);
			authenticated.set(true);
			loading.set(false);
		} catch {
			authenticated.set(false);
			loading.set(false);
		}
	} else {
		loading.set(false);
	}
}

socket.on("connect", page_load)

page_load();

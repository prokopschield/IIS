import { createClient } from "@prokopschield/simple-socket-client";

export const [backend, socket] = createClient("https://camp.fitvut.cz");

export const login: (
	username: string,
	secret: string
) => Promise<
	| { error: string }
	| {
			success: true;
			token: string;
			id: string;
			username: string;
			displayname: string;
			legal_name: string;
			legal_guardian: string;
			legal_guardian_contact: string;
			email: string;
	  }
> = backend.login;

export const session: (
	username: string,
	token: string
) => Promise<
	| {
			error: string;
	  }
	| {
			success: true;
			token: string;
			id: string;
			username: string;
			displayname: string;
			legal_name: string;
			legal_guardian: string;
			legal_guardian_contact: string;
			email: string;
	  }
> = backend.session;

export const register: (info: {
	displayname: string;
	legal_name: string;
	legal_guardian: string;
	legal_guardian_contact: string;
	email: string;
	password?: string;
	redirect: string;
}) => Promise<{ error: string } | { password: string; status: "EMAIL_SEND" }> =
	backend.register;

export const change_my_info: (info: {
	displayname: string;
	legal_name: string;
	legal_guardian: string;
	legal_guardian_contact: string;
	email: string;
	redirect: string;
}) => Promise<
	| { error: string }
	| {
			success: true;
			id: string;
			username: string;
			displayname: string;
			legal_name: string;
			legal_guardian: string;
			legal_guardian_contact: string;
			email: string;
	  }
> = backend.change_my_info;

export const { attendee_my_camps, attendee_my_activities } = backend;

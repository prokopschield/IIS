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

/* Fixme, moc neviem typescript tak asi asi Prokope funkcie uprav nech
 *ti nerobim bordel v kode, takisto aj nazov
 */
////Funkcie pre castnika

/**Ucastnik prehlad:
 * 1. Po prihlseni
 * Nazov kempu
 * Prehlad dvpch buducich aktivit
 * Posledne bodovane aktivity, staci 2
 * Celkovy pocet bodov
 * Zoznam ucastnikov
*/

// Toto je vlastne autentifikacia ucastnika
export const authentificate_attendee: (attendee: {
	name: string;
	password: string;
}) => Promise<
	| { error: string }
	| {
	succes: boolean;
}
> = backend.authentificate_attendee;

// Nacitanie ucastnika
// Niesom si isty ako ho identifikovat ale asi hadam ze pomocou Session ID ?
export const load_attendee: (/*Nie som si isty co sem*/) => Promise<
	| { error: string }
	| {
	success: true;
	name_of_camp: string;
	next_activities: []; // Stacia nasledujuce dve
	amount_of_points: number; // vsetky body
	all_attendees: []; // Zoznam vsetkych ktory sa zucastnili aktivit
}
> = backend.load_attendee;


/**
 * 	2. Prehlad aktivit
 * 		(Stranka 3)
 * 		zoznam vsetkych buducich aktivit, : Nazov, aktivita, datum
 * 		zoznam vsetkych bodovanych aktivit : -||- plus body aktivity
 *
 */
export const attendee_load_activities: (/* Stale pre toho isteho ucastnnika*/) => Promise<
	| { error: string }
	| {
		all_upcoming_activities: [];
		all_evaluated_activities: []; // vsetky obodovane aktivity
	}
> = backend.attendee_load_activities;

/**
 * 	3. Zoznam vysledkov ucastnika(strana 4
 * 		Zoznam ucastnikov, ich mena a ich ich celkovych bodov
 */
export const attendee_load_results: (/*Stale ten isty ucastnik*/) => Promise<
	| { error: string }
	| {
		attendees_name: []; // Mena ucastnikov, ale hadam ze sa nic nestane ked to predas v jednom objekte
		points_of_attendee: number; // Vsetky body ktore ucastnik ziskal
	}
> = backend.attendee_load_results;

/**
 * 	4. DM TODO
 * 	Zatial nemame premyslene, dohodneme s Vitom ked bude implementovane ostatne
 */

//// Veduci tabora funkcie

/**
 * 	1. Po prilaseni
 * 		to iste ako ucastnik
 */
export const authentificate_supervisor: (attendee: {
	name: string;
	password: string;
}) => Promise<
	| { error: string }
	| {
	succes: boolean;
}
> = backend.authentificate_supervisor;

// Nacitanie ucastnika
// Niesom si isty ako ho identifikovat ale asi hadam ze pomocou Session ID ?
export const load_supervisor: (/*Nie som si isty co sem*/) => Promise<
	| { error: string }
	| {
	success: true;
	name_of_camp: string;
	next_activities: []; // Stacia nasledujuce dve
	amount_of_points: number; // vsetky body
	all_attendees: []; // Zoznam vsetkych ktory sa zucastnili aktivit
}
> = backend.load_supervisor;

/**
 * 	2. Pridanie aktivity
 * 		Nazov aktivity, datum, cas a popis
 *
 */

export const supervisor_add_activity: (activty:
										   {
											   name_of_activity: string;
											   date_of_activity: string;

										   }) => Promise<
	| { error: string }
	| {

}
> = backend.supervisor_add_activity;

/**
 * 	3. Bodovanie aktivity
 * 		Nazov aktivity, datum, mena zucastnenych
 *
 * 	3. Odoslanie bodovania
 * 		kazdemu ucastnikovi priradime body
 *
 * Organizator tabora:
 * 	1. Po prihlaseni
 * 		To iste ako ucastnik
 *
 * 	2. Vsetky aktivity ako veduci tabora
 *
 * 	3. Editacia tabora
 * 		Pridanie veducich/ucastnikov, zmenit nazov tabora
 */


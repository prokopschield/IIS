<script>
	import { backend } from "../../lib/backend";
	import { state } from "../../lib/state";

	const blank_attendee = {
		legal_name: "",
		email: "",
		legal_guardian: "",
		legal_guardian_contact: "",
	};

	const blank_leader = { legal_name: "", email: "" };

	let camp = {
		name: "",
		web: "",
		leaders: [{ ...blank_leader }],
		attendees: [
			{
				...blank_attendee,
			},
		],
	};

	function addLeaderRow() {
		camp.leaders = [...camp.leaders, { ...blank_leader }];
	}

	function addAttendeeRow() {
		camp.attendees = [
			...camp.attendees,
			{
				...blank_attendee,
			},
		];
	}

	async function handleSubmit() {
		try {
			const {
				camp: { id },
			} = await backend.organizer_new_camp(
				camp,
				new URL(`/leader/my_camps`, location.href).href,
				new URL(`/attendee/my_camps`, location.href).href,
			);

			state("selected_camp").set(id);
			state("page").set("/organizer/camp");
		} catch (error) {
			console.error(error);

			alert("Nastala chyba! Překontroluj vložené údaje.");
		}
	}
</script>

<main>
	<h1>Create Camp</h1>

	<form on:submit|preventDefault={handleSubmit}>
		<label for="campName">Name of Camp:</label>
		<input type="text" id="campName" bind:value={camp.name} required />

		<label for="campWebsite">Website URL:</label>
		<input type="url" id="campWebsite" bind:value={camp.web} required />

		<h2>Leaders</h2>
		{#each camp.leaders as leader, i}
			<hr />
			<div>
				<label for={`leaderName${i}`}>Legal Name:</label>
				<input
					type="text"
					id={`leaderName${i}`}
					bind:value={leader.legal_name}
					required
				/>

				<label for={`leaderEmail${i}`}>Email:</label>
				<input
					type="email"
					id={`leaderEmail${i}`}
					bind:value={leader.email}
					required
				/>
			</div>
			<hr />
		{/each}
		<button type="button" on:click={addLeaderRow}>Add Leader</button>

		<h2>Attendees</h2>
		{#each camp.attendees as attendee, i}
			<hr />
			<div>
				<label for={`attendeeName${i}`}>Legal Name:</label>
				<input
					type="text"
					id={`attendeeName${i}`}
					bind:value={attendee.legal_name}
					required
				/>

				<label for={`attendeeEmail${i}`}>Email:</label>
				<input
					type="email"
					id={`attendeeEmail${i}`}
					bind:value={attendee.email}
					required
				/>

				<label for={`guardianName${i}`}>Legal Guardian:</label>
				<input
					type="text"
					id={`guardianName${i}`}
					bind:value={attendee.legal_guardian}
					required
				/>

				<label for={`guardianContact${i}`}>Guardian Contact:</label>
				<input
					type="text"
					id={`guardianContact${i}`}
					bind:value={attendee.legal_guardian_contact}
					required
				/>
			</div>
			<hr />
		{/each}
		<button type="button" on:click={addAttendeeRow}>Add Attendee</button>

		<br />
		<!-- I am a master of HTML! now give me body++, thank you -->
		<br />

		<button type="submit">Create Camp</button>
	</form>
</main>

<style>
	/* You can add your own styles here */
	label {
		display: block;
		margin-bottom: 8px;
	}

	input {
		width: 100%;
		margin-bottom: 16px;
		padding: 8px;
		box-sizing: border-box;
	}

	button {
		margin-top: 16px;
		padding: 10px;
		background-color: #4caf50;
		color: white;
		border: none;
		cursor: pointer;
	}

	button:hover {
		background-color: #45a049;
	}
</style>

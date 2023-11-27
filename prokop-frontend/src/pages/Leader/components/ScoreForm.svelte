<script lang="ts">
	import { onMount } from "svelte";

	interface User {
		id: string;
		username: string;
		displayname: string;
		legal_name: string;
		legal_guardian: string;
		legal_guardian_contact: string;
		email: string;
		timestamp: string;
	}

	interface Attendee {
		id: number;
		attendee_id: string;
		camp_id: string;
		timestamp: string;
		user: User;
		score?: number;
	}

	interface Camp {
		id: string;
		organizer_id: string;
		name: string;
		web: string;
		timestamp: string;
		attendee: Attendee[];
	}

	interface Data {
		id: string;
		name: string;
		camp_id: string;
		leader_id: string;
		description: string;
		points: number;
		timestamp: string;
		attended: any[];
		camp: Camp;
	}

	export let data: Data;
	let attendees: Attendee[];

	// Extract attendees from the data
	$: attendees = data?.camp?.attendee || [];

	function getScore(attendee_id: number) {
		const attended = data.attended.find(arg => arg.attendee_id === attendee_id)

		if (attended) {
			return attended.score
		}

		return 0
	}

	// Function to update the score for a specific attendee
	export let updateScore: (_attendeeId: number, _newScore: number) => void;
</script>

<main>
	<h1>{data.name}</h1>
	<p>{data.description}</p>

	<table>
		<thead>
			<tr>
				<th>Attendee</th>
				<th>Score</th>
			</tr>
		</thead>
		<tbody>
			{#each attendees as { id, user, score = getScore(id) }}
				<tr>
					<td>{user.displayname}</td>
					<td>
						<input
							type="number"
							bind:value={score}
							on:input={() => updateScore(id, score)}
						/>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
		font-family: "Arial", sans-serif;
		color: #333;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 20px;
	}

	th,
	td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: left;
	}

	th {
		background-color: #f2f2f2;
	}

	input {
		width: 50px;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}


	@media (prefers-color-scheme: dark) {
		main {
			background-color: #1e1e1e;
			color: #fff;
		}

		th,
		td {
			border-color: #333;
		}
	}
</style>

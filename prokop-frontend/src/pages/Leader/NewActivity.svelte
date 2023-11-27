<script lang="ts">
	import { backend } from "../../lib/backend";
	import { state } from "../../lib/state";

	let name = "";
	let description = "";
	let points = 1;

	async function createActivity() {
		try {
			const {
				activity: { id },
			} = await backend.leader_create_activity(
				Number(state("selected_camp").value),
				String(name),
				String(description),
				Number(points),
			);

			state("activity").set(id);
			state("page").set("/leader/activity");
		} catch (error) {
			console.error(error);

			alert("Nastala chyba. :(");
		}
	}
</script>

<main>
	<h1>Create Activity</h1>

	<form on:submit|preventDefault={createActivity}>
		<label for="activityName">Activity Name:</label>
		<input type="text" id="activityName" bind:value={name} required />

		<label for="activityDescription">Activity Description:</label>
		<textarea id="activityDescription" bind:value={description} required
		></textarea>

		<label for="activityPoints">Activity Point Multiplier:</label>
		<input type="number" id="activityPoints" bind:value={points} required />

		<button type="submit">Create Activity</button>
	</form>
</main>

<style>
	/* You can add your own styles here */
	label {
		display: block;
		margin-bottom: 8px;
	}

	input,
	textarea {
		width: 100%;
		margin-bottom: 16px;
		padding: 8px;
		box-sizing: border-box;
	}

	button {
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

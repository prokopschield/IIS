<script lang="ts">
	import { onMount } from "svelte";
	import { backend } from "../../lib/backend";
	import { state } from "../../lib/state";
	import ScoreForm from "./components/ScoreForm.svelte";

	let activity: any = undefined;

	onMount(async () => {
		try {
			const response = await backend.leader_get_activity(
				Number(state("selected_camp").value),
				Number(state("activity").value),
			);

			activity = response.activity;

			console.log(JSON.stringify(activity));
		} catch {
			alert("nastala chyba =(");
			state("page").set("/leader/camp");
		}
	});
</script>

{#if activity}
	<ScoreForm
		data={activity}
		updateScore={async (attendee_id, score) => {
			await backend.leader_set_score(
				Number(state("activity").value),
				attendee_id,
				score,
			);
		}}
	/>
{:else}
	Moment, prosím, načítám data...
{/if}

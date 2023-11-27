<script lang="ts">
	import { onMount } from "svelte";

	import { backend } from "../../lib/backend";
	import { page, state } from "../../lib/state";

	let camps = new Array<any>();

	onMount(async () => {
		const result = await backend.attendee_my_camps();

		camps = result.camps;
	});

	function openCamp(camp_id: number) {
		state("selected_camp").set(camp_id);
		state("page").set("/attendee/camp");
	}
</script>

<div>
	{#each camps as camp}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="campinfo" on:click={() => openCamp(camp.id)}>
			<h2>{camp.name}</h2>
			Vedoucí:
			{#each camp.leader as leader}
				<span>{leader.user.legal_name}</span>
			{/each}
		</div>
	{/each}
</div>

<style>
	div.campinfo {
		border: 1px solid black;
		padding: 3em;
		cursor: pointer;
	}
</style>

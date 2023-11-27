<script lang="ts">
	import { onMount } from "svelte";
	import { backend } from "../../lib/backend";
	import { page, state } from "../../lib/state";

	let info: any = undefined;

	onMount(async () => {
		try {
			info = await backend.attendee_camp_info(
				state("selected_camp").value,
			);
		} catch (error) {
			console.error(error);
			alert("Nastala chyba. =(");
			page.set("/");
		}
	});
</script>

<div>
	{#if info}
		<h1>{info.camp.name}</h1>
		Organizátor: {info.camp.user.legal_name}

		<h2>Aktivity:</h2>
		{#each info.attended as attended}
			<p>
				{attended.activity.name}: {Math.round(
					attended.activity.points * attended.score,
				)} b.
			</p>
		{/each}
	{:else}
		Načítám data...
	{/if}
</div>

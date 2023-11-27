<script lang="ts">
	import { onMount } from "svelte";
	import { backend } from "../../lib/backend";
	import { page, state } from "../../lib/state";

	let info: any = undefined;

	onMount(async () => {
		try {
			info = await backend.leader_camp_info(
				Number(state("selected_camp").value),
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
		{#each info.camp.activity as activity}
			<p>
				<a href={`activity?activity=${activity.id}`}>
					{activity.name}: vedoucí {activity.leader.user.legal_name}
				</a>
			</p>
		{/each}
		<button on:click={() => page.set("/leader/nova_aktivita")}>
			Vytvořit aktivitu
		</button>
	{:else}
		Načítám data...
	{/if}
</div>

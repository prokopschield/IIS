<script lang="ts">
	import { onMount } from "svelte";
	import { backend } from "../../lib/backend";
	import { page, state } from "../../lib/state";
	import UcastniciTable from "../../components/UcastniciTable.svelte";

	let info: any = undefined;

	onMount(async () => {
		try {
			info = await backend.organizer_camp_info(
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

		<UcastniciTable {info} />
	{:else}
		Načítám data...
	{/if}
</div>

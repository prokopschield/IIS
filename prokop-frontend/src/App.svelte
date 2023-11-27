<script lang="ts">
	import { loading } from "./lib/state";
</script>

<main>
	{#if $loading}
		Moment, prosím, načítám data...
	{:else}
		Načteno
	{/if}
</main>

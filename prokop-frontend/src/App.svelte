<script lang="ts">
	import { loading, page } from "./lib/state";
	import Login from "./pages/Login.svelte";
</script>

<main>
	{#if $loading}
		Moment, prosím, načítám data...
	{:else if $page === "/login"}
		<Login />
	{/if}
</main>

<script lang="ts">
	import { loading, page } from "./lib/state";
	import Login from "./pages/Login.svelte";
	import Register from "./pages/Register.svelte";
</script>

<main>
	{#if $loading}
		Moment, prosím, načítám data...
	{:else if $page === "/login"}
		<Login />
	{:else if $page === "/register"}
		<Register />
	{/if}
</main>

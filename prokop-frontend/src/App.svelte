<script lang="ts">
	import { authenticated, loading, page } from "./lib/state";
	import Camp from "./pages/Attendee/Camp.svelte";
	import MyCamps from "./pages/Attendee/MyCamps.svelte";
	import ForgotPassword from "./pages/Auth/ForgotPassword.svelte";
	import Login from "./pages/Auth/Login.svelte";
	import Register from "./pages/Auth/Register.svelte";
</script>

<div class="navbar">
	<button on:click={() => page.set("/")}>Na hlavní stránku</button>
</div>

<main>
	{#if $loading}
		Moment, prosím, načítám data...
	{:else if $page === "/login"}
		<Login />
	{:else if $page === "/register"}
		<Register />
	{:else if $page === "/recover"}
		<ForgotPassword />
	{:else if !$authenticated}
		<Login />
	{:else if $page === "/attendee/camp"}
		<Camp />
	{:else if $page === "/attendee/my_camps"}
		<MyCamps />
	{:else}
		{(page.set("/"), "Stránka nenalezena.")}
	{/if}
</main>

<style>
	.navbar {
		color: white;
		position: fixed;
		top: 0;
	}
</style>

<script lang="ts">
	import { authenticated, loading, page, state } from "./lib/state";
	import AttendeeCamp from "./pages/Attendee/Camp.svelte";
	import AttendeeMyCamps from "./pages/Attendee/MyCamps.svelte";
	import LeaderActivity from "./pages/Leader/Activity.svelte";
	import LeaderCamp from "./pages/Leader/Camp.svelte";
	import LeaderMyCamps from "./pages/Leader/MyCamps.svelte";
	import LeaderNewActivity from "./pages/Leader/NewActivity.svelte";
	import AuthForgotPassword from "./pages/Auth/ForgotPassword.svelte";
	import AuthLogin from "./pages/Auth/Login.svelte";
	import AuthRegister from "./pages/Auth/Register.svelte";
	import Home from "./pages/Home.svelte";

	function logout() {
		state("user").set({});
		state("authenticated").set(false);
	}
</script>

<div class="navbar">
	<button on:click={() => page.set("/")}>Na hlavní stránku</button>
	<button on:click={logout}>Odhlásit se</button>
</div>

<main>
	{#if $loading}
		Moment, prosím, načítám data...
	{:else if $page === "/login"}
		<AuthLogin />
	{:else if $page === "/register"}
		<AuthRegister />
	{:else if $page === "/recover"}
		<AuthForgotPassword />
	{:else if !$authenticated}
		<AuthLogin />
	{:else if $page === "/"}
		<Home />
	{:else if $page === "/attendee/camp"}
		<AttendeeCamp />
	{:else if $page === "/attendee/my_camps"}
		<AttendeeMyCamps />
	{:else if $page === "/leader/activity"}
		<LeaderActivity />
	{:else if $page === "/leader/camp"}
		<LeaderCamp />
	{:else if $page === "/leader/my_camps"}
		<LeaderMyCamps />
	{:else if $page === "/leader/new_activity"}
		<LeaderNewActivity />
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

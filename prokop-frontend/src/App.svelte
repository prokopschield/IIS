<script lang="ts">
	import { authenticated, loading, page } from "./lib/state";
	import MyCamps from "./pages/Attendee/MyCamps.svelte";
	import ForgotPassword from "./pages/Auth/ForgotPassword.svelte";
	import Login from "./pages/Auth/Login.svelte";
	import Register from "./pages/Auth/Register.svelte";
</script>

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
	{:else if $page === "/attendee/my_camps"}
		<MyCamps />
	{/if}
</main>

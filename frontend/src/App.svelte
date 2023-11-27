<script lang="ts">
	import CampRegister from "./routes/CampRegister.svelte";
	import Organizer from "./routes/Organizer.svelte";
	import Supervisor from "./routes/Supervisor.svelte";
	import Attendee from "./routes/Attendee.svelte";
	import NotFound from "./routes/NotFound.svelte";
	import Home from "./routes/Home.svelte";

	import { page } from "./state.js";

	page.set(location.pathname);

	page.subscribe((new_value) => history.pushState(undefined, "", new_value));
</script>

<main>
	{#if $page === "/"}
		<Home />
	{:else if $page === "/register"}
		<CampRegister />
	{:else if $page === "/organizer"}
		<Organizer />
	{:else if $page === "/supervisor"}
		<Supervisor />
	{:else if $page === "/attendee"}
		<Attendee />
	{:else}
		<NotFound />
	{/if}
</main>

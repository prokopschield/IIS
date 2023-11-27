<script lang="ts">
	import { onMount } from "svelte";

	import { backend } from "../lib/backend";
	import { page } from "../lib/state";

	let attendee = false;
	let leader = false;
	let organizer = false;

	onMount(async () => {
		const { data } = await backend.load_roles();

		if (data.attendee.length) {
			attendee = true;
		}

		if (data.leader.length) {
			leader = true;
		}

		if (data.camp.length) {
			organizer = true;
		}

		if (!attendee && !organizer && !leader) {
			organizer = true;
		}
	});
</script>

{#if attendee}
	<button on:click={() => page.set("/attendee/my_camps")}>
		Moje tábory
	</button>
{/if}

{#if leader}
	<button on:click={() => page.set("/leader/my_camps")}>
		Moje tábory (vedoucí)
	</button>
{/if}

{#if organizer}
	<button on:click={() => page.set("/organizer/my_camps")}>
		Moje tábory (organizátor)
	</button>
{/if}

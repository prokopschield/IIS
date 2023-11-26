<script>
	import Button from "../components/Button.svelte";
	import Navbar from "../components/Navbar.svelte";
</script>

<Navbar>
	<div slot="homePageContainer" class="flex-1">
		<Button buttonClass="btn btn-ghost text-xl" on:click={homePageRedirect}>Domovská stránka</Button>
	</div>
	<div slot="centerContainer" class="flex-none">
		
	</div>
</Navbar>

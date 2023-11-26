<script>
	import Navbar from "../components/Navbar.svelte";
	import Carrousel from "../components/Carrousel.svelte";
	import Hero from "../components/Hero.svelte";
	import Button from "../components/Button.svelte";
	import Card from "../components/Card.svelte";

	function homePageRedirect() {
		location.href = "#/";
	}
</script>


<Navbar>
	<div slot="homePageContainer" class="flex-1">
		<Button buttonClass="btn btn-ghost text-xl" on:click={homePageRedirect}>Domovská stránka</Button>
	</div>
	<div slot="centerContainer" class="flex-none">
	</div>
</Navbar>

<Hero>

	<!-- Carrousel for upcoming activities-->
	<Carrousel>
		<Card></Card>
	</Carrousel>

	<!-- -->
	<!-- Last added activities -->

	<!-- Ammount of all points -->

	<!-- Add sidebar menu-->
</Hero>


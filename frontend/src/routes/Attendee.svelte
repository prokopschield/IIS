<script>
	import Navbar from "../components/shared/Navbar.svelte";
	import Carrousel from "../components/shared/Carrousel.svelte";
	import Hero from "../components/shared/Hero.svelte";
	import Button from "../components/shared/Button.svelte";
	import CarrouselCard from "../components/CarrouselCard.svelte";

	let upcomingActivities = ["",""]; // Here will be array of upcoming activities
	let scoredActivities = ["",""];	// Here will be array of all scored activities
	let amountOfPoints = 10; // Calculate all points earned from activities

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
		{#each upcomingActivities as dummyItem}
			<CarrouselCard>

			</CarrouselCard>
		{/each}
	</Carrousel>

	<!-- -->
	<!-- Last added activities -->
	<Carrousel>
		{#each scoredActivities as dummyItem}
			<CarrouselCard>

			</CarrouselCard>
		{/each}
	</Carrousel>

	<!-- Ammount of all points -->
	<h2>Amount of all earned points</h2>
	<p>{amountOfPoints}</p>

	<!-- add button to view sidebar menu-->
	<Button></Button>
</Hero>


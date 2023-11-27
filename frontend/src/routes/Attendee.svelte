<script>
	import Navbar from "../components/shared/Navbar.svelte";
	import Carrousel from "../components/shared/Carrousel.svelte";
	import PersonHero from "../components/shared/PersonHero.svelte";
	import Button from "../components/shared/Button.svelte";
	import CarrouselCard from "../components/CarrouselCard.svelte";
	import Menu from "../components/shared/Menu.svelte";

	let people = Array("Mirek", "MArek", "Peter", "Damo");
	let showUndo = false;
	let newActivity = {
		name: "Snorchling",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et odio pellentesque diam volutpat commodo sed. Et netus et malesuada fames ac turpis. Ut ornare lectus sit amet",
		date: "12.2.2021",
		time: "23:00",
	};

	let upcomingActivities = new Array(newActivity);
	newActivity = {
		name: "Kickboxing",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et odio pellentesque diam volutpat commodo sed. Et netus et malesuada fames ac turpis. Ut ornare lectus sit amet",
		date: "13.5.2022",
		time: "11:00",
	};
	upcomingActivities.push(newActivity);

	let scoredActivity = {
		name: "Cycling",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et odio pellentesque diam volutpat commodo sed. Et netus et malesuada fames ac turpis. Ut ornare lectus sit amet",
		date: "22.1.2022",
		time: "21:00",
		earnedPoints: 10,
	};
	let scoredActivities = new Array(scoredActivity);

	scoredActivity = {
		name: "Running",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et odio pellentesque diam volutpat commodo sed. Et netus et malesuada fames ac turpis. Ut ornare lectus sit amet",
		date: "22.9.2019",
		time: "8:00",
		earnedPoints: 20,
	};
	upcomingActivities.push(scoredActivity);

	let earnedPoints = 0;
	$: for (let i = 0; i < scoredActivities.length; i++) {
		earnedPoints += scoredActivities[i].earnedPoints;
	}

	function homePageRedirect() {
		state("page").set("$1");
	}
</script>

<Navbar>
	<div slot="homePageContainer" class="flex-1">
		<Button buttonClass="btn btn-ghost text-xl" on:click={homePageRedirect}
			>Domovská stránka</Button
		>
	</div>
	<div slot="centerContainer" class="flex-none"></div>
</Navbar>

<PersonHero>
	<div class="flex flex-col h-screen justify-between">
		<!-- Menu -->

		<!-- Menu content goes here -->

		<!-- Carrousel -->
	</div>

	<!-- Carrousel for upcoming activities-->
	<div class="flex-none p-4">
		<Menu>
			{#if showUndo}
				<li><a>Back to plan of activities </a></li>
			{/if}
			<li>
				<details open>
					<summary>Direct messages</summary>
					<ul>
						{#each people as person}
							<!-- TODO Direct messaging-->
							<li><a>{person}</a></li>
						{/each}
					</ul>
				</details>
			</li>
		</Menu>
	</div>

	<!-- Upcoming activities -->
	<div class="flex-auto p-4">
		<Carrousel>
			{#each upcomingActivities as upcomingActivity, index}
				{#if index === 0}
					<CarrouselCard
						activityTitle={upcomingActivity.name}
						cardId={index}
						previousCardId={upcomingActivities.length - 1}
						nextCardId={index + 1}
					>
						<p class="mb-2">{upcomingActivity.description}</p>
						<p class="mb-2">{upcomingActivity.date}</p>
						<p class="mb-2">{upcomingActivity.time}</p>
					</CarrouselCard>
				{:else if index === upcomingActivities.length - 1}
					<CarrouselCard
						cardId={index}
						previousCardId={index - 1}
						nextCardId={0}
					>
						<p class="mb-2">{upcomingActivity.description}</p>
						<p class="mb-2">{upcomingActivity.date}</p>
						<p class="mb-2">{upcomingActivity.time}</p>
					</CarrouselCard>
				{:else}
					<CarrouselCard
						cardId={index}
						previousCardId={index - 1}
						nextCardId={index + 1}
					>
						<p class="mb-2">{upcomingActivity.description}</p>
						<p class="mb-2">{upcomingActivity.date}</p>
						<p class="mb-2">{upcomingActivity.time}</p>
					</CarrouselCard>
				{/if}
			{/each}
		</Carrousel>
	</div>

	<!-- Last added activities -->
	<div class="flex-auto p-4">
		<Carrousel>
			{#each scoredActivities as scoredActivity, index}
				{#if index === 0}
					<CarrouselCard
						cardId={index}
						previousCardId={upcomingActivities.length - 1}
						nextCardId={index + 1}
					>
						{scoredActivity.description}
					</CarrouselCard>
				{:else if index === upcomingActivities.length - 1}
					<CarrouselCard
						cardId={index}
						previousCardId={index - 1}
						nextCardId={0}
					></CarrouselCard>
				{:else}
					<CarrouselCard
						cardId={index}
						previousCardId={index - 1}
						nextCardId={index + 1}
					>
						{scoredActivity.description}
					</CarrouselCard>
				{/if}
			{/each}
		</Carrousel>
	</div>

	<div class="col-span-1">
		<!-- Ammount of all points -->
		<h2>Amount of all earned points</h2>
		<p>{earnedPoints}</p>
	</div>
</PersonHero>

<script>
	import Card from "./shared/Card.svelte";


	export let cardWidth = 1 / 2; // Default value
	export let cardId = 1; // Default value
	export let previousItem = "";
	export let nextItem = "";
</script>

<div id="slide_{String(cardId)}" class="carousel-item relative w-{String(cardWidth)}">

	<Card tittle="activityTitle" width="{String(cardWidth/2)}">

		<!-- Description will go in here-->
		<p slot="content">
			<slot>ActivityText</slot>
		</p>


	</Card>

	<div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
		<a href={previousItem} class="btn btn-circle">❮</a>
		<a href={nextItem} class="btn btn-circle">❯</a>
	</div>
</div>
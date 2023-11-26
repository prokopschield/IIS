<script>
	import Card from "./shared/Card.svelte";


	export let cardWidth = 1 / 2; // Default value
	export let cardId = 1; // Default value
	export let activityTitle = "";
	export let previousCardId = 1;
	export let nextCardId = 1;
</script>

<div id="slide_{String(cardId)}" class="carousel-item relative w-{String(cardWidth)}">

	<Card tittle={activityTitle} width="{String(cardWidth/2)}">

		<!-- Description will go in here-->
		<div slot="content">
			<slot>

			</slot>
		</div>


	</Card>

	<div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
		<a href="#slide_{String(previousCardId)}" class="btn btn-circle">❮</a>
		<a href="#slide_{String(nextCardId)}" class="btn btn-circle">❯</a>
	</div>
</div>
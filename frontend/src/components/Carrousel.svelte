<script>
	let viewCards = 3;
	import Card from "./Card.svelte";

	export let amountOfCards = 0; // Defalut value
</script>

<div class="carousel w-full">
	{#each Array(amountOfCards) as _, i}
		<div id="slide_{String(i)}" class="carousel-item relative w-{String(1 / viewCards)}">
			<!-- Cards will go in here-->
			<!-- TODO Needs to be set dynamically, how to ?-->

			<!-- Buttons for swiping -->
			<div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
				<a href={`#slide${i === 0 ? amountOfCards - 1 : i - 1}`} class="btn btn-circle">❮</a>
				<a href={`#slide${i === amountOfCards - 1 ? 0 : i + 1}`} class="btn btn-circle">❯</a>
			</div>
		</div>
	{/each}
</div>
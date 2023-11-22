<script>
	import Button from "./Button.svelte";

	export let width = "full";
	export let tittle = "";
</script>

<div class="card w-{{width}} bg-base-100 shadow-xl">
	<slot name="undoButton"></slot>
	<div class="card-body">
		<h2 class="card-title">{tittle}</h2>

		<!-- Content of card will go in here-->
		<slot name="content"></slot>
		<div class="card-actions justify-end">
			<Button buttonClass="btn btn-primary">Register</Button>
		</div>
	</div>
</div>
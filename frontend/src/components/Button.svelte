<script>
	import {createEventDispatcher} from "svelte";

	export let buttonClass = "";

	const dispatch = createEventDispatcher();

	function handleClick(){
		dispatch('click');
	}
</script>


<button class={buttonClass} on:click={handleClick}>
	<slot></slot>
</button>
<script>
	export let buttonClass = "";
	export let backgroundImage = "";
</script>


<!-- button style wont be used for css, but sometimes we want to include image-->
<button class={buttonClass} style={`background-image: url('${backgroundImage}')`} on:click>
	<slot></slot>
</button>
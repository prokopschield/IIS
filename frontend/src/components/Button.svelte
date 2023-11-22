<script>
	export let buttonClass = "";
	export let buttonStyle="";
</script>


<!-- button style wont be used for css, but sometimes we want to include image-->
<button class={buttonClass} style={buttonStyle} on:click>
	<slot></slot>
</button>
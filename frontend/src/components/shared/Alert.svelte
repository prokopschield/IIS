<script>
	let alertClass = "alert";

	export let alertStyle = "info"; // Default value of alert will be info


	// Seems like javascript has problem with mapping on string so this is
	// basically mapping with const
	const distinguishAttributeInfo = "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
	const distinguishAttributeSuccess = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
	const distinguishAttributeWarning = "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
	const distinguishAttributeError = "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";
	let currentStyle = "";

	// And this is complicating assignment of value since mapping with string does not work
	$: {
		if (alertStyle === "info") {
			currentStyle = distinguishAttributeInfo;
		} else if (alertStyle === "success") {
			currentStyle = distinguishAttributeSuccess;
		} else if (alertStyle === "warning") {
			currentStyle = distinguishAttributeWarning;
		} else if (alertStyle === "error") {
			currentStyle = distinguishAttributeError;
		} else {
			alert("Error");
		}
	}


</script>

<div role="alert" class={alertClass+" "+alertStyle}>
	<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 w-6 h-6" fill="none" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
			  d={currentStyle}></path>

	</svg>
	<span>
		<!-- Text of alert goes here-->
		<slot>

		</slot>
	</span>
</div>


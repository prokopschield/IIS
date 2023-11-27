<script>
	import Modal from "./shared/Modal.svelte";
	import Button from "./shared/Button.svelte";
	import Alert from "./shared/Alert.svelte";
	import { createEventDispatcher } from "svelte";

	export let modalId = "login_modal"; // Default value
	export let modal_alert = {
		style: "info",
		visible: false,
		text: ""
	}
	const dispatch = createEventDispatcher();

	function handleSubmit() {
		let loginName = document.getElementsByName("login_name")[0].value;
		let loginPassword = document.getElementsByName("login_password")[0].value;

		if (loginName === ""){
			alert("Empty login name");
			return;
		}
		if (loginName.split(" ").length != 2){
			alert("Login name must consist of name and surname");
			return;
		}
		if (loginPassword === ""){
			alert("No password entered")
			return;
		}


		// Send data to above in event variable, e
		const loginData = {
				name: loginName,
				password: loginPassword,
			}

		// console.log("Log from LoginModal")
		// console.log(loginData);

		dispatch('login', loginData);
	}


</script>


<Modal modalId={modalId}>
	<p slot="title">Log in</p>

	{#if modal_alert.visible}
		<Alert slot="feedback" alertStyle={modal_alert.style}>{modal_alert.text}</Alert>
	{/if}

	<form slot="content" id="loginForm" class="space-y-3" on:submit|preventDefault={handleSubmit}>
		<label for="name">Log in name</label><br>
		<input class="border-2 rounded-full" type="text" id="name" name="login_name"><br>
		<label for="password">Password</label><br>
		<input class="border-2 rounded-full" type="password" id="password" name="login_password">
	</form>

	<div slot="action_buttons">
		<input class="btn btn-ghost" type="submit" form="loginForm" value="Log in">
	</div>
</Modal>
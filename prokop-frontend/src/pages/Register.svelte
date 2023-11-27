<!-- LoginPage.svelte -->

<script>
	import { backend } from "../lib/backend";

	let legal_name = "";
	let displayname = "";
	let email = "";
	let password = "";

	async function handleLogin() {
		try {
			const { status } = await backend.register({
				legal_name,
				displayname,
				email,
				password,
				redirect: new URL("/", location.href).href,
			});

			if (status === "EMAIL_SENT") {
				alert("Please check your inbox!");
			}
		} catch (error) {
			console.error(error);

			if (error === "DISPLAYNAME_TOO_SHORT") {
				return alert(
					"Please select a nickname that is >= 8 letters long.",
				);
			}

			if (error === "DISPLAYNAME_TOO_LONG") {
				return alert("Please select a shorter nickname.");
			}

			alert("Please check the information you filled in.");
		}
	}
</script>

<main>
	<form on:submit|preventDefault={handleLogin}>
		<h1>Register</h1>

		<label for="legal_name">Legal name:</label>
		<input id="legal_name" bind:value={legal_name} required />

		<label for="displayname">Nickname:</label>
		<input id="displayname" bind:value={displayname} required />

		<label for="email">Email:</label>
		<input type="email" id="email" bind:value={email} required />

		<label for="password">Password:</label>
		<input type="password" id="password" bind:value={password} required />

		<button type="submit">Sign Up</button>
		<hr />
		<a href="/login">Log In</a>
	</form>
</main>

<style>
	main {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	form {
		max-width: 400px;
		width: 100%;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	h1 {
		text-align: center;
		margin-bottom: 20px;
		color: #333;
	}

	label {
		display: block;
		margin-bottom: 8px;
		color: #555;
	}

	input {
		width: 100%;
		padding: 8px;
		margin-bottom: 16px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button {
		background-color: #4caf50;
		color: white;
		padding: 10px 15px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
		width: 100%;
	}

	button:hover {
		background-color: #45a049;
	}
</style>

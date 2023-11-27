<!-- LoginPage.svelte -->

<script>
	import { backend } from "../../lib/backend";
	import { authenticated, page, user } from "../../lib/state";

	let email = "";
	let password = "";

	async function handleLogin() {
		try {
			const user_data = await backend.login(email, password);

			user.set(user_data);
			authenticated.set(true);
			page.set("/");
		} catch {
			alert("Login failed.");
		}
	}

	// TODO
</script>

<div>
	<form on:submit|preventDefault={handleLogin}>
		<h1>Login</h1>

		<label for="email">Email:</label>
		<input type="email" id="email" bind:value={email} required />

		<label for="password">Password:</label>
		<input type="password" id="password" bind:value={password} required />

		<button type="submit">Login</button>
		<hr />
		<a href="/register">Sign Up</a>
		<a href="/recovery">Forgot Password</a>
	</form>
</div>

<style>
	div {
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

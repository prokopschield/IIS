<script>
	import Navbar from "../components/shared/Navbar.svelte";
	import Button from "../components/shared/Button.svelte";
	import Hero from "../components/shared/Hero.svelte";
	import LoginModal from "../components/LoginModal.svelte";

	let modalName = "login_modal";
	let whoClicked = "";


	function redirectCampRegister() {
		location.href = "#/register";
	}

	function handleClick(whoUsed) {
		// Ignore errors with passing type since we pass to us known types
		whoClicked = whoUsed;
		document.getElementById(modalName).show();
	}

	const loginHandler = (e) => {
		console.log(e.details);
	};

	// TODO Vlado
	// Tu bude potrebne implementovat funkciu na obsluhu prihlasenia sa
</script>


<Navbar>
	<div slot="homePageContainer" class="flex-1">
	</div>
	<div slot="centerContainer" class="flex-none">
		<ul class="menu menu-horizontal px-1">
			<li><a href="#/register">Registrace tábora</a></li>
			<li>
				<details>
					<summary>
						Přihlasit se jako
					</summary>
					<ul class="p-2 bg-base-100">
						<li>
							<Button buttonClass="btn btn-ghost" on:click={() => handleClick("organizer")}>
								Organizátor tábora
							</Button>
						</li>
						<li>
							<Button buttonClass="btn btn-ghost" on:click={() => handleClick("supervisor")}>
								Vedoucí
							</Button>
						</li>
						<li>
							<Button buttonClass="btn btn-ghost" on:click={() => handleClick("attendee")}>
								Účastník
							</Button>
						</li>
					</ul>
				</details>
			</li>
		</ul>
	</div>
</Navbar>

<Hero>
	<LoginModal modalId={modalName} on:login={loginHandler} />
	<div class="max-w-md">
		<h1 class="text-5xl font-bold">Vítejte!</h1>
		<p class="py-6">Pro lepší zážitek nechte zmodernizovat tábor naším informačním systémem bodovaných táborových
			aktivit.</p>
		<Button buttonClass="btn btn-primary" on:click={redirectCampRegister}>Začíname</Button>
	</div>
</Hero>

<script>
	import Navbar from "../components/Navbar.svelte";
	import Button from "../components/Button.svelte";
	import Hero from "../components/Hero.svelte";

	function redirectCampRegister(){
		location.href="#/register";
	}

	// TODO Vlado
	// Tu bude potrebne implementovat funkciu na obsluhu prihlasenia sa
</script>


<Navbar>
		<div slot="homePageContainer" class="flex-1">
<!--			<Button buttonClass="btn btn-ghost text-xl" >Domovská stránka</Button>-->
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
							<!-- TODO Implement Vlado-->
							<!-- Tuna treba Osetrtit Vito ze pred presmerovanim
							sa musia autentifikovat, teda musia sa prihlasit. A
							prihlasia sa v modalnom okne -->
							<li><a href="#/organizer">Organizátor tábora</a></li>
							<li><a href="#/supervisor">Vedoucí</a></li>
							<li><a href="#/attendee">Účastník</a></li>
						</ul>
					</details>
				</li>
			</ul>
		</div>
</Navbar>

<Hero>
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Vítejte!</h1>
			<p class="py-6">Pro lepší zážitek nechte zmodernizovat tábor naším informačním systémem bodovaných táborových aktivit.</p>
			<Button buttonClass="btn btn-primary" on:click={redirectCampRegister}>Začíname</Button> <!-- Na kliknutie Vito treba presmerovat na Camp Register nech si prihlasia camp-->
		</div>
</Hero>

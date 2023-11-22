<script>
	import Navbar from "../components/Navbar.svelte";
	import Button from "../components/Button.svelte";
	import Hero from "../components/Hero.svelte";

	// Tu bude potrebne implementovat funkciu na obsluhu prihlasenia sa
</script>


<Navbar>
		<div slot="homePageContainer" class="flex-1">
			<Button buttonClass="btn btn-ghost text-xl" >Domovská stránka</Button>
		</div>
		<div slot="centerContainer" class="flex-none">
			<ul class="menu menu-horizontal px-1">
				<li><a href="CampRegister.svelte">Registrace tábora</a></li>
				<li>
					<details>
						<summary>
							Přihlasit se jako
						</summary>
						<ul class="p-2 bg-base-100">
							<!-- Tuna treba Osetrtit Vito ze pred presmerovanim
							sa musia autentifikovat, teda musia sa prihlasit. A
							prihlasia sa v modalnom okne -->
							<li><a href="Organizer.svelte">Organizátor tábora</a></li>
							<li><a href="Supervisor.svelte">Vedoucí</a></li>
							<li><a href="Attendee.svelte">Účastník</a></li>
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
			<button class="btn btn-primary" >Začíname</button> <!-- Na kliknutie Vito treba presmerovat na Camp Register nech si prihlasia camp-->
		</div>
</Hero>

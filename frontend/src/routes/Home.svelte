<script>
	import Navbar from "../components/Navbar.svelte";
	import Button from "../components/Button.svelte";
	import Hero from "../components/Hero.svelte";

</script>


<Navbar>
		<div slot="homePageContainer" class="flex-1">
			<Button buttonClass="btn btn-ghost text-xl" >Homepage</Button>
		</div>
		<div slot="centerContainer" class="flex-none">
			<ul class="menu menu-horizontal px-1">
				<li><a href="CampRegister.svelte">Register Camp</a></li>
				<li>
					<details>
						<summary>
							Log in as
						</summary>
						<ul class="p-2 bg-base-100">
							<li><a href="Organizer.svelte">Organizer</a></li>
							<li><a href="Supervisor.svelte">Supervisor</a></li>
							<li><a href="Attendee.svelte">Attendee</a></li>
						</ul>
					</details>
				</li>
			</ul>
		</div>
</Navbar>

<Hero>
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Hello there</h1>
			<p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
			<button class="btn btn-primary">Get Started</button>
		</div>
</Hero>
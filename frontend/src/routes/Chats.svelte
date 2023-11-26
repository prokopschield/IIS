<script>
	import Button from "../components/shared/Button.svelte";
	import Navbar from "../components/shared/Navbar.svelte";
	import HeroTwo from "../components/shared/HeroTwo.svelte";
	
	// Camp info
	let campName = "Současný název tábora";
	let ModalMessage = "Neúspěch."

	// let zprávy = [{"Dan J.", "Já ti řákal, že to tak není."}, {"Honza P.", "Neříkal, ty si říkal, že to tak není"}, {"Dan J.", "To už je jedno. Musíme vyřešit, jak se k nám Klára do týmu vrátí."}, {"Honza P.", "Nepřesvědčíme radši třeba Evu?"},];

	function homePageRedirect() {
		location.href = "#/"; 
	}

	function addChat() {
	}

</script>

<Navbar>
	<div slot="homePageContainer" class="flex-1">
		<Button buttonClass="btn btn-ghost text-xl" on:click={homePageRedirect}>Domovská stránka</Button>
	</div>
	<div slot="centerContainer" class="flex-none">
		<ul class="menu menu-horizontal px-1">
			<li><a href="#/">Odhlásit se</a></li>
		</ul>
	</div>
</Navbar>

<HeroTwo>
	<div><h1 class="text-5xl font-bold">Soukromé zprávy s účastníkem</h1><br></div>
	<div><h1 class="text-3xl">Dan Janský</h1><br></div>
	<div>
		<form id="changeCampName" class="space-y-3" on:submit|preventDefault={addChat}>
			<label for="camp_name">Napsat: </label>
			<input class="border-2 rounded-full" type="text" id="camp_name" name="camp_name" 
				   required><br>
		</form><input class="btn btn-primary" type="submit" form="changeCampName" value="Přidat novou zprávu">
	</div>
	<br><br><br>

	<div>
			{#each Array(+ 1) as _,i} <!-- For cycle for lines-->
            <div class="chat chat-start">
                <div class="chat-header">
                  Obi-Wan Kenobi
                </div>
                <div class="chat-bubble">You were the Chosen One!</div>
                <div class="chat-footer opacity-50">
                  Seen
                </div>
            </div>
			{/each}
		<br>
	</div>
	
</HeroTwo>



<script>
	import Button from "../components/shared/Button.svelte";
	import Navbar from "../components/shared/Navbar.svelte";
	import HeroTwo from "../components/shared/HeroTwo.svelte";

	// Camp info
	let campName = "Současný název tábora";
	let chosedChatter = "Dan Janský";

	let chatMessages = [
		[
			"Dan Janský",
			"Já ti říkal, že to tak není. Už od začátku jsme měli dát na mě.",
		],
		[
			"Honza Peterka",
			"Ne, neříkal. Ale o tom, jak máme postavit tu trojproudovku si básnil půlhodiny.",
		],
		[
			"Dan Janský",
			"To už je jedno. Musíme vyřešit, jak se k nám Klára do týmu vrátí.",
		],
		["Honza Peterka", "Nepřesvědčíme radši třeba Evu?"],
		["Dan Janský", "Eva je super nápad. Hned jí zkusím napsat."],
		["Honza Peterka", "Já ji radši taky napíšu."],
	];

	function homePageRedirect() {
		state("page").set("$1");
	}

	function addChat() {
		alert(
			"Zpráva by byla úspěšně odeslána, kdyby jsme to napojili na backend...",
		);
	}
</script>

<Navbar>
	<div slot="homePageContainer" class="flex-1">
		<Button buttonClass="btn btn-ghost text-xl" on:click={homePageRedirect}
			>Domovská stránka</Button
		>
	</div>
	<div slot="centerContainer" class="flex-none">
		<ul class="menu menu-horizontal px-1">
			<li><a href="#/">Odhlásit se</a></li>
		</ul>
	</div>
</Navbar>

<HeroTwo>
	<div>
		<h1 class="text-5xl font-bold">Soukromé zprávy s účastníkem</h1>
		<br />
	</div>
	<div>
		<h1 class="text-3xl">{chosedChatter}</h1>
		<br />
	</div>
	<div>
		<form
			id="newMessage"
			class="space-y-3"
			on:submit|preventDefault={addChat}
		>
			<label for="camp_name">Napsat: </label>
			<input
				class="border-2 rounded-full"
				style="width: 500px"
				type="text"
				id="camp_name"
				name="camp_name"
				required
			/>
		</form>
		<input
			class="btn btn-primary"
			type="submit"
			form="newMessage"
			value="Přidat novou zprávu"
		/>
	</div>
	<br /><br /><br />

	<div>
		{#each chatMessages as item}
			<!-- For cycle for lines-->
			{#if item[0] === chosedChatter}
				<div class="chat chat-end" style="padding: 20px">
					<div class="chat-header">
						{item[0]}
					</div>
					<div class="chat-bubble">{item[1]}</div>
				</div>
			{:else}
				<div class="chat chat-start" style="padding: 20px">
					<!-- Message on left -->
					<div class="chat-header">
						Já, {item[0]}
					</div>
					<div class="chat-bubble chat-bubble-info">{item[1]}</div>
				</div>
			{/if}
		{/each}
		<br />
	</div>
</HeroTwo>

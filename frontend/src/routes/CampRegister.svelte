<script>
	import Modal from "../components/Modal.svelte";
	import Card from "../components/Card.svelte";
	import Hero from "../components/Hero.svelte";
	import Button from "../components/Button.svelte";

	const addInputLine = () =>
	{

	}
</script>

<Hero>
	<Card width="120" tittle="Register Camp">

		<!-- Tu bude potrebne zobrazit Vito modalne okno ze sa chces prihlasit
		do uctu, pokial viem bude potreba event dispatching -->
		<Button slot="undoButton" buttonClass="btn link flex justify w-1/2 m-2">Log in as organizer</Button>

		<div slot="content">
			<form>
				<input class="border-2 text-black-600/50" type="text" id="campName" value="Name of camp"required><br>
				<input class="border-2 text-opacity-25" type="text" id="campSite" value="Camps website"><br><br><br>

				<label for="campAttendees">Camp attendees (name of attendee)</label><br><br>
				<input class="border-2 text-opacity-25" type="text" id="campAttendees"><br><br>
				<Button buttonClass="btn btn-accent bg-fixed" buttonStyle="background-image: url(assets/addButton-elipse.svg)"></Button>
			</form>
		</div>

	</Card>
</Hero>



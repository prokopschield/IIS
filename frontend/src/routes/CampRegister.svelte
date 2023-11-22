<script>
	import Modal from "../components/Modal.svelte";
	import Card from "../components/Card.svelte";
	import Hero from "../components/Hero.svelte";
	import Button from "../components/Button.svelte";

	// Camp info
	let campName = "";
	let campSite = "";

	let attendeesCount = 0;

	function addAttendee() {
		attendeesCount = attendeesCount + 1;
	}

	function submitForm() {

		// Get all attendees
		let attendees = [];
		let auxAttendeesArray = document.getElementsByName("camp_attendee");
		for (let index = 0; index < auxAttendeesArray.length; index++) {
			console.log();
			if (auxAttendeesArray[index].value !== "") {
				if (auxAttendeesArray[index].value.split(" ").length != 2) {
					alert("Name must consist of firstname and surname");
				}

				// Add new attendee
				let firstName = auxAttendeesArray[index].value.split(" ")[0];
				let lastName = auxAttendeesArray[index].value.split(" ")[1];
				const attendee = {
					firstName: firstName,
					lastName: lastName
				};
				attendees.push(attendee);
			} else {
				alert("Attendee list is empty");
			}
		}

		let newCamp = {campName: campName, campSite: campSite, campAttendees: attendees};



		// Send data to back end
		// TODO Vlado

		// Show modal that operation was successful
		// TODO Vito
	}
</script>

<Hero>
	<Card width="120" tittle="Register Camp">

		<!-- TODO Vito-->
		<!-- Tu bude potrebne zobrazit Vito modalne okno ze sa chces prihlasit
		do uctu, pokial viem bude potreba event dispatching -->
		<Button slot="undoButton" buttonClass="btn link flex justify w-1/2 m-2">Log in as organizer</Button>

		<div slot="content">
			<form id="registerForm" class="space-y-3" on:submit|preventDefault={submitForm}>
				<label for="camp_name">Camp name</label><br>
				<input class="border-2 rounded-full" type="text" id="camp_name" name="camp_name" bind:value="{campName}"
					   required><br>
				<label for="camp_site">Camps website</label><br>
				<input class="border-2 rounded-full" type="text" id="camp_site" name="camp_site"
					   bind:value="{campSite}"><br><br>

				<label for="camp_attendees">Camp attendees (name of attendee)</label><br><br>
				{#each Array(attendeesCount + 1) as _,i} <!-- For cycle for lines-->
					<input class="border-2 rounded-full" type="text" name="camp_attendee"><br><br>
				{/each}
			</form>
			<div class="w-full mb-5">
				<Button buttonClass="btn btn-accent w-20" on:click={addAttendee}>Add attendee</Button>
			</div>
			<input class="btn btn-primary" type="submit" form="registerForm" value="Register">
		</div>

	</Card>
</Hero>



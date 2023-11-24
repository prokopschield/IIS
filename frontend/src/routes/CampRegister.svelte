<script>
	import Modal from "../components/Modal.svelte";
	import Card from "../components/Card.svelte";
	import Hero from "../components/Hero.svelte";
	import Button from "../components/Button.svelte";
	import Navbar from "../components/Navbar.svelte";

	// Camp info
	let campName = "";
	let campSite = "";

	let attendeesCount = 0;
	let supervisorsCount = 0;

	function addAttendee() {
		attendeesCount = attendeesCount + 1;
	}

	function addSupervisor() {
		supervisorsCount = supervisorsCount + 1;
	}

	function submitForm() {

		// Get all attendees
		let attendees = [];
		let auxAttendeesArray = document.getElementsByName("camp_attendee");
		let emptyAttendeeList = true;

		// Get all supervisors
		let supervisors = [];
		let auxSupervisorsArray = document.getElementsByName("camp_supervisor");
		let emptySupervisorsList = true;

		// Iterate through attendees
		for (let index = 0; index < auxAttendeesArray.length; index++) {
			if (auxAttendeesArray[index].value !== "") {
				if (auxAttendeesArray[index].value.split(" ").length != 2) {
					alert("Names of attendees must consist of firstname and surname");
					return;
				}

				// Add new attendee
				emptyAttendeeList = false;
				let firstName = auxAttendeesArray[index].value.split(" ")[0];
				let lastName = auxAttendeesArray[index].value.split(" ")[1];
				const attendee = {
					firstName: firstName,
					lastName: lastName
				};
				attendees.push(attendee);
			}
		}

		// Iterate through attendees
		for (let index = 0; index < auxSupervisorsArray.length; index++) {
			if (auxSupervisorsArray[index].value !== "") {
				if (auxSupervisorsArray[index].value.split(" ").length != 2) {
					alert("Names of supervisor must consist of firstname and surname");
					return;
				}

				// Add new attendee
				emptyAttendeeList = false;
				let firstName = auxSupervisorsArray[index].value.split(" ")[0];
				let lastName = auxSupervisorsArray[index].value.split(" ")[1];
				const supervisor = {
					firstName: firstName,
					lastName: lastName
				};
				supervisors.push(supervisor);
			}
		}


		// Check if user passed us list with attendees
		if (emptySupervisorsList) {
			alert("Supervisor list is empty");
		}

		let newCamp = {
			campName: campName,
			campSite: campSite,
			campAttendees: attendees,
			campSupervisors: supervisors
		};
		console.log(newCamp);

		// Send data to back end
		// TODO Vlado

		// Show modal that operation was successful
		// TODO Vito
	}

	function homePageRedirect(){
		location.href = "#/";
	}
</script>

<Navbar>
	<div slot="homePageContainer" class="flex-1">
		<Button buttonClass="btn btn-ghost text-xl" on:click={homePageRedirect}>Domovská stránka</Button>
	</div>
	<div slot="centerContainer" class="flex-none">

	</div>
</Navbar>

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

				<label for="camp_attendee">Camp attendees (name of attendee)</label><br><br>
				{#each Array(attendeesCount + 1) as _,i} <!-- For cycle for lines-->
					<input class="border-2 rounded-full" type="text" name="camp_attendee"><br><br>
				{/each}

				<br>
				<label for="camp_supervisor">Camp supervisors (name of supervisor)</label><br><br>
				{#each Array(supervisorsCount + 1) as _,i} <!-- For cycle for lines-->
					<input class="border-2 rounded-full" type="text" name="camp_supervisor"><br><br>
				{/each}
			</form>
			<div class="w-full mb-5">
				<Button buttonClass="btn btn-accent w-20" on:click={addAttendee}>Add attendee</Button>
			</div>
			<div class="w-full mb-5">
				<Button buttonClass="btn btn-accent w-20" on:click={addSupervisor}>Add supervisor</Button>
			</div>
			<input class="btn btn-primary" type="submit" form="registerForm" value="Register">
		</div>

	</Card>
</Hero>



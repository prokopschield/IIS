<script>
	import Modal from "../components/Modal.svelte";
	import Card from "../components/Card.svelte";
	import Hero from "../components/Hero.svelte";
	import Button from "../components/Button.svelte";
	import Navbar from "../components/Navbar.svelte";

	// Camp info
	let campName = "";
	let campSite = "";
	let modalVersion = "login"; // or "registration"

	let attendeesCount = 0;
	let supervisorsCount = 0;
	let organizerCount = 0;

	let ModalMessage = "Zatím jste nebyl zaregistrován.";
	let RegistrationSuccess = false;

	function modalShowLogin() {
		modalVersion = "login";
		my_modal_1.showModal();
	}

	function modalShowRegistration() {
		modalVersion = "registration";
		my_modal_1.showModal();
	}

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

		// Get organizer
		let organizers = [];
		let auxOrganizerArray = document.getElementsByName("camp_organizer");
		let emptyOrganizerList = true;


		// Iterate through attendees
		for (let index = 0; index < auxAttendeesArray.length; index++) {
			if (auxAttendeesArray[index].value !== "") {
				if (auxAttendeesArray[index].value.split(" ").length != 2) {
					alert("Jméno účastníka musí obsahovat křestní jméno i příjmení.");
					RegistrationSuccess = false;
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
					alert("Jméno vedoucího musí obsahovat křestní jméno i příjmení.");
					RegistrationSuccess = false;
					return;
				}

				// Add new attendee
				emptySupervisorsList = false;
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
			alert("Seznam vedoucích je prázdný.");
			RegistrationSuccess = false;
		}

		// Iterate through attendees
		for (let index = 0; index < auxOrganizerArray.length; index++) {
			if (auxOrganizerArray[index].value !== "") {
				if (auxOrganizerArray[index].value.split(" ").length != 2) {
					alert("Jméno organizátora musí obsahovat křestní jméno i příjmení.");
					RegistrationSuccess = false;
					return;
				}

				// Add new attendee
				emptyOrganizerList = false;
				let firstName = auxOrganizerArray[index].value.split(" ")[0];
				let lastName = auxOrganizerArray[index].value.split(" ")[1];
				const organizer = {
					firstName: firstName,
					lastName: lastName
				};
				organizers.push(organizer);
			}
		}

		// Check if user passed us list with attendees
		if (emptyOrganizerList) {
			alert("Položka pro jméno organizátora je prázdná.");
			RegistrationSuccess = false;
		}

		let newCamp = {
			campName: campName,
			campSite: campSite,
			campAttendees: attendees,
			campSupervisors: supervisors,
			campOrganizers: organizers
		};
		console.log(newCamp);

		// Send data to back end
		RegistrationSuccess = false;
		// TODO Vlado

		RegistrationSuccess = true;
		if(RegistrationSuccess){
			ModalMessage = "Byl jste úspěšně zaregistrován.";
			modalShowRegistration();
			console.log('149 Inside RegistrationSuccess');
		}else{ // Otherwise will show unsuccess
			ModalMessage = "Zatím jste nebyl zaregistrován.";
			modalShowRegistration();
		}
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
	<Card width="120" tittle="Registrace tábora">

		<!-- TODO Vito-->
		<!-- Tu bude potrebne zobrazit Vito modalne okno ze sa chces prihlasit
		do uctu, pokial viem bude potreba event dispatching -->
		<Button slot="undoButton" buttonClass="btn link flex justify w-1/2 m-2" on:click={modalShowLogin}>Příhlásit se jako organizátor</Button>

		<div slot="content">
			<form id="registerForm" class="space-y-3" on:submit|preventDefault={submitForm}>
				<label for="camp_name">Název tábora</label><br>
				<input class="border-2 rounded-full" type="text" id="camp_name" name="camp_name" bind:value="{campName}"
					   required><br><br>
				<label for="camp_site">Webová stránka tábora</label><br>
				<input class="border-2 rounded-full" type="text" id="camp_site" name="camp_site"
					   bind:value="{campSite}"><br><br>

				<label for="camp_attendee">Účastníci táboru (Jména účastníků)</label><br>
				{#each Array(attendeesCount + 1) as _,i} <!-- For cycle for lines-->
					<input class="border-2 rounded-full" type="text" name="camp_attendee"><br>
				{/each}

				<br>
				<label for="camp_supervisor">Vedoucí tábora (Jména vedoucích)</label><br>
				{#each Array(supervisorsCount + 1) as _,i} <!-- For cycle for lines-->
					<input class="border-2 rounded-full" type="text" name="camp_supervisor"><br>
				{/each}
				

				<br>
				<label for="camp_organizer">Organizátor tábora (Jméno hlavního vedoucího)</label><br>
				{#each Array(organizerCount + 1) as _,i} <!-- For cycle for lines-->
					<input class="border-2 rounded-full" type="text" name="camp_organizer"><br><br>
				{/each}
			</form>
			
			<div class="w-full mb-5">
				<Button buttonClass="btn btn-accent w-20 h-20" on:click={addAttendee}>Přidat pole pro dalšího účastníka</Button>
			</div>

			<div class="w-full mb-5">
				<Button buttonClass="btn btn-accent w-20 h-20" on:click={addSupervisor}>Přidat pole pro dalšího vedoucího</Button>
			</div>

			<input class="btn btn-primary" type="submit" form="registerForm" value="Registrovat se">
		</div>

	</Card>
</Hero>
 
<dialog id="my_modal_1" class="modal" style="text-align: center;">
  <div class="modal-box" >
	{#if modalVersion === "login"}
    <h1 class="font-bold text-center text-lg"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free Icon-->
		<path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg> 
		Příhlášení:</h1><br>
		<form action="action_page.php" method="post">
			<div  style="border-radius: 25px; padding: 20px; background-color: #e2e2e2;" >
			<label for="uname"><b>Přihlašovací jméno: </b></label>
			<input class="border-2 rounded-full w-60" type="text" placeholder="Vložte Přihlašovací jméno" name="uname" required><br><br>
	
			<label for="psw"><b>Heslo: </b></label>
			<input class="border-2 rounded-full w-80" type="password" placeholder="Vložte Heslo" name="psw" required><br>
		
			</div><br>

			<label>
			  <input type="checkbox" checked="checked" name="remember"> Trvalé přihlášení
			</label><br><br>
			
			<button class="btn btn-info sm:btn-sm md:btn-md lg:btn-lg center" type="submit">Přihlásit se</button><br><br>

			<div class="container">
				<span class="psw text-center"><a href="#">Zapoměli jste heslo?</a></span>
			</div>
		</form>

    		<div class="modal-action">
      			<form method="dialog">
        		<!-- if there is a button in form, it will close the modal -->
        		<button class="btn">Zavřít</button>
      		</form>
    </div>
	{:else if modalVersion === "registration"}
	<h1 class="font-bold text-center text-lg" style="color: black">
		<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>
		{ModalMessage}
	</h1>

	<div class="modal-action">
		<form method="dialog">
	  <!-- if there is a button in form, it will close the modal -->
	  <button class="btn">Zavřít</button>
	</div>
	{/if}
  </div>
</dialog>

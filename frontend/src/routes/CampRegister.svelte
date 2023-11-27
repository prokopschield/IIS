<script lang="ts">
    import Card from "../components/shared/Card.svelte";
    import Hero from "../components/shared/CenterHero.svelte";
    import Button from "../components/shared/Button.svelte";
    import Navbar from "../components/shared/Navbar.svelte";
    import Alert from "../components/shared/Alert.svelte";
    import {register_organizer, authenticate} from "../backend.js";

    // ALert
    let login_alert = {
        style: "error",
        text: "Incorrect login credentials",
        visible: true
    }

    // This function is here only so we will wait before closing the alert
    function doNothing() {

    }

    $: if (login_alert.visible) {
        setTimeout(doNothing, 3000);
        login_alert.visible = false;
    }

    // Camp info
    let campName = "";
    let campSite = "";
    let modalVersion = "login"; // or "registration"

    let attendeesCount = 0;
    let supervisorsCount = 0;

    let ModalMessage = "Zatím jste nebyl zaregistrován.";

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


    async function submitForm() {

        // Get all attendees
        let attendees = new Array<string>();
        let auxAttendeesArray = document.getElementsByName("camp_attendee");
        let emptyAttendeesList = true;

        // Get all supervisors
        let supervisors = new Array<string>();
        let auxSupervisorsArray = document.getElementsByName("camp_supervisor");
        let emptySupervisorsList = true;

        // Iterate through attendees
        for (let index = 0; index < auxAttendeesArray.length; index++) {
            if (auxAttendeesArray[index].value !== "") {
                if (auxAttendeesArray[index].value.split(" ").length != 2) {
                    alert("Jméno účastníka musí obsahovat křestní jméno i příjmení.");
                    return;
                }

                // Add new attendee
                emptyAttendeesList = false;
                let firstName = auxAttendeesArray[index].value.split(" ")[0];
                let lastName = auxAttendeesArray[index].value.split(" ")[1];
                const attendee = firstName + " " + lastName;
                attendees.push(attendee);
            }
        }

        if (emptyAttendeesList) {
            alert("Seznam účastníků je prázdný");
            return;
        }

        // Iterate through supervisors
        for (let index = 0; index < auxSupervisorsArray.length; index++) {
            if (auxSupervisorsArray[index].value !== "") {
                if (auxSupervisorsArray[index].value.split(" ").length != 2) {
                    alert("Jméno vedoucího musí obsahovat křestní jméno i příjmení.");
                    return;
                }

                // Add new supervisor
                emptySupervisorsList = false;
                let firstName = auxSupervisorsArray[index].value.split(" ")[0];
                let lastName = auxSupervisorsArray[index].value.split(" ")[1];
                const supervisor = firstName + " " + lastName;

                supervisors.push(supervisor);
            }
        }

        // Check if user passed us list with supervisors
        if (emptySupervisorsList) {
            alert("Seznam vedoucích je prázdný.");
            return;
        }

        let organizer = <string>document.getElementsByName("camp_organizer")[0].value;
        if (organizer === "") {
            alert("Nebyl zadán orgnizátor");
            return;
        }
        if (organizer.split(" ").length != 2) {
            alert("Jméno organizátora musí obsahovat křestní jméno i příjmení.");
            return;
        }
        const newCamp = {
            campName: campName,
            campSite: campSite,
            campAttendees: attendees,
            campSupervisors: supervisors,
            campOrganizer: organizer
        };


        // TODO Vito implement
        let result = await register_organizer(newCamp);

        // We ask if operation was succesfull
        if ('success' in result && result.success) {
            ModalMessage = "Byl jste úspěšně zaregistrován.";
            modalShowRegistration();
            console.log("149 Inside RegistrationSuccess");
            state("page").set("$1");
        } else if ('error' in result) {
            ModalMessage = result.error;
            modalShowRegistration();
            console.log("Registration unsuccesfull");
        } else {
            console.log("Error");
            alert("Internal error");
        }
    }

    async function loginHandler() {
        let userName = document.getElementsByName("uname")[0].value;
        let userPassword = document.getElementsByName("psw")[0].value;



        console.log("Trying to log in");

        let result;
        try {
            result = await authenticate(userName, userPassword);
        } catch (err) {
            login_alert.text = String(err);
            login_alert.visible = true;
        }


    }

    function forgotPasswordHandler() {

    }

    function homePageRedirect() {
        state("page").set("$1");
    }
</script>

<Navbar>
    <div slot="homePageContainer" class="flex-1">
        <Button buttonClass="btn btn-ghost text-xl" on:click={homePageRedirect}>Domovská stránka</Button>
    </div>
    <div slot="centerContainer" class="flex-none">
        {#if login_alert.visible}
            <Alert alertStyle={login_alert.style}>{login_alert.text}</Alert>
        {/if}
    </div>
</Navbar>

<Hero>


    <Card width="120" tittle="Registrace tábora">


        <Button slot="undoButton" buttonClass="btn link flex justify w-1/2 m-2" on:click={modalShowLogin}>Příhlásit se
            jako organizátor
        </Button>

		<div slot="content">
			<form
				id="registerForm"
				class="space-y-3"
				on:submit|preventDefault={submitForm}
			>
				<label for="camp_name">Název tábora</label><br />
				<input
					class="border-2 rounded-full"
					type="text"
					id="camp_name"
					name="camp_name"
					bind:value={campName}
					required
				/><br /><br />
				<label for="camp_site">Webová stránka tábora</label><br />
				<input
					class="border-2 rounded-full"
					type="text"
					id="camp_site"
					name="camp_site"
					bind:value={campSite}
				/><br /><br />

				<label for="camp_attendee"
					>Účastníci táboru (Jména účastníků)</label
				><br />
				{#each Array(attendeesCount + 1) as _, i}
					<!-- For cycle for lines-->
					<input
						class="border-2 rounded-full"
						type="text"
						name="camp_attendee"
					/><br />
				{/each}

				<br />
				<label for="camp_supervisor"
					>Vedoucí tábora (Jména vedoucích)</label
				><br />
				{#each Array(supervisorsCount + 1) as _, i}
					<!-- For cycle for lines-->
					<input
						class="border-2 rounded-full"
						type="text"
						name="camp_supervisor"
					/><br />
				{/each}

				<br />
				<label for="camp_organizer"
					>Organizátor tábora (Jméno hlavního vedoucího)</label
				><br />
				<input
					class="border-2 rounded-full"
					type="text"
					name="camp_organizer"
				/><br /><br />
			</form>

			<div class="w-full mb-5">
				<Button
					buttonClass="btn btn-accent w-20 h-20"
					on:click={addAttendee}
					>Přidat pole pro dalšího účastníka
				</Button>
			</div>

			<div class="w-full mb-5">
				<Button
					buttonClass="btn btn-accent w-20 h-20"
					on:click={addSupervisor}
					>Přidat pole pro dalšího vedoucího
				</Button>
			</div>

			<input
				class="btn btn-primary"
				type="submit"
				form="registerForm"
				value="Registrovat se"
			/>
		</div>
	</Card>
</Hero>

<dialog id="my_modal_1" class="modal" style="text-align: center;">
	<div class="modal-box">
		{#if modalVersion === "login"}
			<h1 class="font-bold text-center text-lg">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="1em"
					viewBox="0 0 448 512"
				>
					<!--! Font Awesome Free Icon-->
					<path
						d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
					/>
				</svg>
				Příhlášení:
			</h1>
			<br />
			<form on:submit|preventDefault={loginHandler}>
				<div
					style="border-radius: 25px; padding: 20px; background-color: #e2e2e2;"
				>
					<label for="uname"><b>Přihlašovací jméno: </b></label>
					<input
						class="border-2 rounded-full w-60"
						type="text"
						placeholder="Vložte Přihlašovací jméno"
						name="uname"
						required
					/><br /><br />

					<label for="psw"><b>Heslo: </b></label>
					<input
						class="border-2 rounded-full w-80"
						type="password"
						placeholder="Vložte Heslo"
						name="psw"
						required
					/><br />
				</div>
				<br />

				<button
					class="btn btn-info sm:btn-sm md:btn-md lg:btn-lg center"
					type="submit">Přihlásit se</button
				>
				<br /><br />

				<div class="container">
					<span class="psw text-center"
						><a on:click={forgotPasswordHandler}
							>Zapoměli jste heslo?</a
						></span
					>
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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="1em"
					viewBox="0 0 512 512"
				>
					<!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
					<path
						d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
					/>
				</svg>
				{ModalMessage}
			</h1>

			<div class="modal-action">
				<form method="dialog">
					<!-- if there is a button in form, it will close the modal -->
					<button class="btn">Zavřít</button>
				</form>
				q
			</div>
		{/if}
	</div>
	>>>>>>> f6afc180ce633cc25e83c78b7f797c043758f1a8
</dialog>

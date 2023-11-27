<script>
	import Button from "../components/shared/Button.svelte";
	import Navbar from "../components/shared/Navbar.svelte";
	import HeroTwo from "../components/shared/HeroTwo.svelte";

	// Camp info
	let campName = "Současný název tábora";
	let ModalMessage = "Neúspěch.";

	let attendeesOfArray = [
		"Jan Novák",
		"Klára Nováková",
		"David Kernel",
		"Jan Roztočil",
		"Emily Nerudová",
		"Radek Spálený",
	];

	function homePageRedirect() {
		state("page").set("$1");
	}

	function changeName() {
		ModalMessage = "Přídán nový název tábora!";
		my_modal_1.showModal();
	}

	let attendeesCount = 0;
	let supervisorsCount = 0;

	function addAttendee() {
		attendeesCount = attendeesCount + 1;
	}

	function addSupervisior() {
		supervisorsCount = supervisorsCount + 1 + 0;
	}

	function modalShowResult() {
		my_modal_1.showModal();
	}

	function submitAttendee() {
		// Get all attendees
		let attendees = [];
		let auxAttendeesArray = document.getElementsByName("camp_attendee");
		let emptyAttendeesList = true;

		ModalMessage = "Byl/y úspěšně přidáni učastník/ci.";

		// Iterate through attendees
		for (let index = 0; index < auxAttendeesArray.length; index++) {
			if (auxAttendeesArray[index].value !== "") {
				if (auxAttendeesArray[index].value.split(" ").length != 2) {
					alert(
						"Jméno účastníka musí obsahovat křestní jméno i příjmení.",
					);
					ModalMessage = "Účastník/ci nebyl/y úspěšně přidáni.";
					return;
				}

				// Add new attendee
				emptyAttendeesList = false;
				let firstName = auxAttendeesArray[index].value.split(" ")[0];
				let lastName = auxAttendeesArray[index].value.split(" ")[1];
				const attendee = {
					firstName: firstName,
					lastName: lastName,
				};
				attendees.push(attendee);
			}
		}

		if (emptyAttendeesList) {
			alert("Seznam účastníků je prázdný");
			ModalMessage = "Účastník/ci nebyl/y úspěšně přidáni.";
			return;
		}

		const newCamp = {
			campAttendees: attendees,
		};

		console.log(newCamp);

		modalShowResult();
	}

	function submitSupervisors() {
		let supervisors = [];
		let auxSupervisorsArray = document.getElementsByName("camp_supervisor");
		let emptySupervisorsList = true;

		ModalMessage = "Byl/y úspěšně přidáni vedoucí.";

		// Iterate through attendees
		for (let index = 0; index < auxSupervisorsArray.length; index++) {
			if (auxSupervisorsArray[index].value !== "") {
				if (auxSupervisorsArray[index].value.split(" ").length != 2) {
					alert(
						"Jméno vedoucího musí obsahovat křestní jméno i příjmení.",
					);
					ModalMessage = "Vedoucí nebyl/y úspěšně přidáni.";
					return;
				}

				// Add new attendee
				emptySupervisorsList = false;
				let firstName = auxSupervisorsArray[index].value.split(" ")[0];
				let lastName = auxSupervisorsArray[index].value.split(" ")[1];
				const attendee = {
					firstName: firstName,
					lastName: lastName,
				};
				supervisors.push(attendee);
			}
		}

		if (emptySupervisorsList) {
			alert("Seznam účastníků je prázdný");
			ModalMessage = "Vedoucí nebyl/y úspěšně přidáni.";
			return;
		}

		const newCamp = {
			campAttendees: supervisors,
		};

		console.log(newCamp);

		modalShowResult();
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
		<h1 class="text-5xl font-bold">Pokročilé nastavení organizátora</h1>
		<br />
	</div>
	<div>
		<h1 class="text-3xl">Změna názvu tábora</h1>
		<br />
	</div>
	<div>
		<form
			id="changeCampName"
			class="space-y-3"
			on:submit|preventDefault={changeName}
		>
			<label for="camp_name">Název tábora</label>
			<input
				class="border-2 rounded-full"
				type="text"
				id="camp_name"
				name="camp_name"
				bind:value={campName}
				required
			/><br /><br />
		</form>
		<input
			class="btn btn-primary"
			type="submit"
			form="changeCampName"
			value="Uložit nový název"
		/>
	</div>
	<br /><br /><br />

	<div>
		<h1 class="text-3xl">Přidat další účastníky tábora</h1>
		<br />
	</div>
	<div>
		<form
			id="addAttendee"
			class="space-y-3"
			on:submit|preventDefault={submitAttendee}
		>
			<label for="camp_attendee">Jméno účastníka/ků</label><br />
			{#each Array(attendeesCount + 1) as _, i}
				<!-- For cycle for lines-->
				<input
					class="border-2 rounded-full"
					type="text"
					name="camp_attendee"
				/><br />
			{/each}
		</form>
		<br />
		<div class="w-full mb-5">
			<Button
				buttonClass="btn btn-accent w-20 h-20"
				on:click={addAttendee}
				>Další položku pro dalšího účastníka
			</Button>
		</div>
		<input
			class="btn btn-primary"
			type="submit"
			form="addAttendee"
			value="Přidat účastníky"
		/>
	</div>
	<br /><br /><br />

	<div>
		<h1 class="text-3xl">Přidat další vedoucí tábora</h1>
		<br />
	</div>
	<div>
		<br />
		<form
			id="addSupervisior"
			class="space-y-3"
			on:submit|preventDefault={submitSupervisors}
		>
			<label for="camp_attendee">Jméno vedoucího/cích</label><br />
			{#each Array(supervisorsCount + 1) as _, i}
				<!-- For cycle for lines-->
				<input
					class="border-2 rounded-full"
					type="text"
					name="camp_supervisor"
				/><br />
			{/each}
		</form>
		<br />
		<div class="w-full mb-5">
			<Button
				buttonClass="btn btn-accent w-20 h-20"
				on:click={addSupervisior}
				>Další položku pro dalšího vedoucího
			</Button>
		</div>
		<input
			class="btn btn-primary"
			type="submit"
			form="addSupervisior"
			value="Přidat vedoucí/ho"
		/>
	</div>
	<br />

	<div>
		<h1 class="text-3xl">Seznam účastníků tábora</h1>
		<br />
	</div>

	<div class="relative overflow-x-auto" style="padding: 30px">
		<table
			class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
		>
			<thead
				class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
			>
				<tr>
					<th scope="col" class="px-6 py-3">
						Jména a příjmení účastníků tábora
					</th>
				</tr>
			</thead>
			<tbody>
				{#each attendeesOfArray as nameAttendee}
					<!-- For cycle for lines-->
					<tr
						class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
					>
						<th
							scope="row"
							class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
						>
							{nameAttendee}
						</th>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</HeroTwo>

<dialog id="my_modal_1" class="modal" style="text-align: center;">
	<div class="modal-box">
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
		</div>
	</div>
</dialog>

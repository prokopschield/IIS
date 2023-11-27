<script lang="ts">
    import Card from "../components/shared/Card.svelte";
    import Hero from "../components/shared/CenterHero.svelte";
    import Button from "../components/shared/Button.svelte";
    import Navbar from "../components/shared/Navbar.svelte";
    import Alert from "../components/shared/Alert.svelte";
    import LoginModal from "../components/LoginModal.svelte";
    import {register_organizer, authenticate} from "../backend.js";
    import {state} from "../state.js";

    // ALert
    let page_alert = {
        style: "info",
        text: "",
        visible: true
    }

    // This function is here only so we will wait before closing the alert
    function doNothing() {

    }

    $: if (page_alert.visible) {
        setTimeout(doNothing, 3000);
        page_alert.visible = false;
    }

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
            console.log("149 Inside RegistrationSuccess");
            state("page").set("$1");
        } else if ('error' in result) {
            page_alert.text = result.error;
            page_alert.visible = true;
            console.log("Registration unsuccesfull");
        } else {
            console.log("Error");
            alert("Internal error");
        }
    }


    function modalShowLogin() {
        organizer_login_modal.show();
    }

    const organizerLoginHandler = async (e) => {

        let loginInfo = e.detail;
        let result;

        try {
            result = await authenticate(loginInfo.name, loginInfo.password);
        } catch (error) {
            page_alert.style="error";
            page_alert.text = String(error);
            page_alert.visible = true;
        }
    }

    function forgotPasswordHandler() {

    }

    function homePageRedirect() {
        state("page").set("/");
    }
</script>

<Navbar>
    <div slot="homePageContainer" class="flex-1">
        <Button buttonClass="btn btn-ghost text-xl" on:click={homePageRedirect}>Domovská stránka</Button>
    </div>
    <div slot="centerContainer" class="flex-none">
        {#if page_alert.visible}
            <Alert alertStyle={page_alert.style}>{page_alert.text}</Alert>
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
                <label for="camp_name">Název tábora</label><br/>
                <input
                        class="border-2 rounded-full"
                        type="text"
                        id="camp_name"
                        name="camp_name"
                        bind:value={campName}
                        required
                /><br/><br/>
                <label for="camp_site">Webová stránka tábora</label><br/>
                <input
                        class="border-2 rounded-full"
                        type="text"
                        id="camp_site"
                        name="camp_site"
                        bind:value={campSite}
                /><br/><br/>

                <label for="camp_attendee"
                >Účastníci táboru (Jména účastníků)</label
                ><br/>
                {#each Array(attendeesCount + 1) as _, i}
                    <!-- For cycle for lines-->
                    <input
                            class="border-2 rounded-full"
                            type="text"
                            name="camp_attendee"
                    /><br/>
                {/each}

                <br/>
                <label for="camp_supervisor"
                >Vedoucí tábora (Jména vedoucích)</label
                ><br/>
                {#each Array(supervisorsCount + 1) as _, i}
                    <!-- For cycle for lines-->
                    <input
                            class="border-2 rounded-full"
                            type="text"
                            name="camp_supervisor"
                    /><br/>
                {/each}

                <br/>
                <label for="camp_organizer"
                >Organizátor tábora (Jméno hlavního vedoucího)</label
                ><br/>
                <input
                        class="border-2 rounded-full"
                        type="text"
                        name="camp_organizer"
                /><br/><br/>
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

<LoginModal modalId="organizer_login_modal" on:login={organizerLoginHandler}></LoginModal>
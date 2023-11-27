<script lang="ts">
    import Navbar from "../components/shared/Navbar.svelte";
    import Carrousel from "../components/shared/Carrousel.svelte";
    import PersonHero from "../components/shared/PersonHero.svelte";
    import Button from "../components/shared/Button.svelte";
    import CarrouselCard from "../components/CarrouselCard.svelte";
    import Menu from "../components/shared/Menu.svelte";
    import Card from "../components/shared/Card.svelte";
    import Modal from "../components/shared/Modal.svelte";
    import Alert from "../components/shared/Alert.svelte";
    import {state} from "../state";
    import {attendee_load_activities} from "../backend";

    let page_alert = {
        text: "",
        visible: false,
        style: "",
    }
    let modalName="card_modal";
    let modalContent = {
        title: "",
        date: "",
        time: "",
        description: "",
        points: 0,
    }
    let upcomingActivities = [];
    let scoredActivities = []
    async function load_attendee() {
        let result = await attendee_load_activities();

        if ('all_upcoming_activities' in result)
        {
            upcomingActivities = result.all_upcoming_activities;
        }
        if ('all_scored_activities' in result){
            scoredActivities = result.all_evaluated_activities;
        }
        if ('error' in result){
            page_alert = {
                text: result.error,
                visible: true,
                style: "error",
            }
        }
    }

    load_attendee();

    function homePageRedirect() {
        state("page").set("/");
    }


    function detailsHandlerUpcomings(index){
        let clickedActivity=upcomingActivities[index];
        modalContent.time = clickedActivity.name;
        modalContent.date = clickedActivity.date;
        modalContent.description = clickedActivity.description;
        modalContent.title = clickedActivity.title;
        modalName.show();
    }

    function detailsHandlerScored(index){
        let clickedActivity=upcomingActivities[index];
        modalContent.time = clickedActivity.name;
        modalContent.date = clickedActivity.date;
        modalContent.description = clickedActivity.description;
        modalContent.title = clickedActivity.title;
        modalName.show();
    }
</script>

<Navbar>
    <div slot="homePageContainer" class="flex-1">
        <Button buttonClass="btn btn-ghost text-xl" on:click={homePageRedirect}
        >Domovská stránka
        </Button
        >
    </div>
    <div slot="centerContainer" class="flex-none"></div>
</Navbar>

{#if page_alert.visible}
    <Alert alertStyle={page_alert.style}>{page_alert.text}</Alert>
{/if}

<Modal modalId={modalName} title={modalContent.title}>
    <div slot="content">
        <p>{modalContent.date}</p>
        <p>{modalContent.time}</p>
        <p>{modalContent.description}</p>
    </div>

</Modal>
<PersonHero>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

        <!-- Side menu-->
        <div class="col-span-3 md:col-span-3">
            <Menu>

            </Menu>
        </div>

        <!-- upcoming activities -->
        <div class="col-span-1 md:col-span-1 flex ">
            <p>Upcoming activities</p>
            <span>
                {#each upcomingActivities as upcomingActivity, index}
                    <Card tittle={upcomingActivity.name} >
                        <Button slot="undoButton" buttonClass="btn" on:click={() => detailsHandlerUpcomings(index)}>Details</Button>
                        <div slot="content">
                            <p>{upcomingActivity.date}</p>
                            <p>{upcomingActivity.time}</p>
                        </div>
                    </Card>
                {/each}
            </span>
        </div>

        <!-- Direct messaging menu -->
        <div class="col-span-3 md:col-span-3">
            <Menu>

            </Menu>
        </div>

        <!-- Scored activities -->
        <div class="col-span-1 md:col-span-1">
            <p>Scored activities</p>
            <span>
                {#each scoredActivities as scoredActivity, index}
                    <Card tittle={scoredActivity.name} >
                        <Button slot="undoButton" buttonClass="btn" on:click={() => detailsHandlerScored(index)}>Details</Button>
                        <div slot="content">
                            <p>{scoredActivity.date}</p>
                            <p>{scoredActivity.time}</p>
                        </div>
                    </Card>
                {/each}
            </span>
        </div>
    </div>


</PersonHero>

<!--<div class="columns-2xs">-->
<!--	<div class="w-full">-->
<!--		<Menu></Menu>-->
<!--	</div>-->

<!--	<div class="grid-rows-2">-->
<!--		&lt;!&ndash; Cards with upcoming activities&ndash;&gt;-->
<!--		<div>-->
<!--			{#each upcomingActivities as upcomingActivity, index}-->
<!--				<Card tittle={upcomingActivity.name} id="upcoming_activity_card_{String(index)}">-->
<!--					<Button slot="undoButton" buttonClass="btn" on:click={detailsHandler}>Details</Button>-->
<!--					<div slot="content">-->
<!--						<p>{upcomingActivity.date}</p>-->
<!--						<p>{upcomingActivity.time}</p>-->
<!--					</div>-->
<!--				</Card>-->
<!--			{/each}-->
<!--		</div>-->

<!--		&lt;!&ndash; Cards with scored activities&ndash;&gt;-->
<!--		<div>-->
<!--			{#each scoredActivities as scoredActivity}-->
<!--				<Card tittle={scoredActivity.name}>{scoredActivity.description}</Card>-->
<!--			{/each}-->
<!--		</div>-->
<!--	</div>-->
<!--</div>-->
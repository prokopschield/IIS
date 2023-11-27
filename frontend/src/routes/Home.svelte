<script>
    import Navbar from "../components/shared/Navbar.svelte";
    import Button from "../components/shared/Button.svelte";
    import Hero from "../components/shared/CenterHero.svelte";
    import LoginModal from "../components/LoginModal.svelte";
    import Alert from "../components/shared/Alert.svelte";
    import {state} from "../state";
    import {authenticate} from "../backend";

    let modalName = "login_modal";
    let whoClicked = "";


    let page_alert = {
        style: "info",
        visible: true,
        text: "",
    }

    function redirectCampRegister() {
        state("page").set("/register");
    }

    function handleClick(whoUsed) {
        // Ignore errors with passing type since we pass to us known types
        whoClicked = whoUsed;
        document.getElementById(modalName).show();
    }

    const loginHandler = async (e) => {
        console.log("Log from Home");
        console.log(e.detail);

        let name = e.detail.name;
        let password = e.detail.password;
        let result;

        // try {
        //     result = await authenticate(name, password);
        // } catch (error) {
        //     page_alert.style = "error";
        //     page_alert.text = String(error);
        //     page_alert.visible = true;
        // }

        page_alert.style = "error";
        page_alert.text = String("You mama fat");
        page_alert.visible = true;


    };



</script>

<Navbar>
    <div slot="homePageContainer" class="flex-1"></div>
    <div slot="centerContainer" class="flex-none">
        <ul class="menu menu-horizontal px-1">
            <li><a href="/register">Registrace tábora</a></li>
            <li>
                <details>
                    <summary> Přihlasit se jako</summary>
                    <ul class="p-2 bg-base-100">
                        <li>
                            <Button
                                    buttonClass="btn btn-ghost"
                                    on:click={() => handleClick("organizer")}
                            >
                                Organizátor tábora
                            </Button>
                        </li>
                        <li>
                            <Button
                                    buttonClass="btn btn-ghost"
                                    on:click={() => handleClick("supervisor")}
                            >
                                Vedoucí
                            </Button>
                        </li>
                        <li>
                            <Button
                                    buttonClass="btn btn-ghost"
                                    on:click={() => handleClick("attendee")}
                            >
                                Účastník
                            </Button>
                        </li>
                    </ul>
                </details>
            </li>
        </ul>
    </div>
</Navbar>

<Hero>
    <LoginModal modal_alert={page_alert} modalId={modalName} on:login={loginHandler}/>
    <div class="max-w-md">
        <h1 class="text-5xl font-bold">Vítejte!</h1>
        <p class="py-6">
            Pro lepší zážitek nechte zmodernizovat tábor naším informačním
            systémem bodovaných táborových aktivit.
        </p>
        <Button buttonClass="btn btn-primary" on:click={redirectCampRegister}
        >Začíname
        </Button
        >
    </div>
</Hero>

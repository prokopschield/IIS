<script>
    import Navbar from "../components/shared/Navbar.svelte";
    import Button from "../components/shared/Button.svelte";
    import Hero from "../components/shared/Hero.svelte";
    import LoginModal from "../components/LoginModal.svelte";
    import Alert from "../components/shared/Alert.svelte";
    import {state} from "../state";
    import {authenticate} from "../backend";

    let modalName = "login_modal";


    let page_alert = {
        style: "info",
        visible: false,
        text: "",
    }

    function redirectCampRegister() {
        state("page").set("/register");
    }

    function handleClick(whoUsed) {
        page_alert.visible = false;
        // Ignore errors with passing type since we pass to us known types
        document.getElementById(modalName).show();
    }

    const loginHandler = async (e) => {
        console.log("Log from Home");
        console.log(e.detail);

        let name = e.detail.name;
        let password = e.detail.password;
        let result;

        try {
            result = await authenticate(name, password);
        } catch (error) {
            document.getElementById(modalName).close();
            page_alert.style = "error";
            page_alert.text = String(error);
            page_alert.visible = true;
            console.log("Unsuccesfull ");
            return;
        }

        document.getElementById(modalName).close();
        state("page").set("/attendee");
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
    {#if page_alert.visible}
        <div class="absolute top-40 left-1/2 transform -translate-x-1/2">
            <Alert alertStyle={page_alert.style}>{page_alert.text}</Alert>
        </div>
    {/if}
    <LoginModal modalId={modalName} on:login={loginHandler}/>
    <div class="max-w-md">
        <h1 class="text-5xl font-bold">Vítejte!</h1>
        <p class="py-6">
            Pro lepší zážitek nechte zmodernizovat tábor naším informačním
            systémem bodovaných táborových aktivit.
        </p>
        <Button buttonClass="btn btn-primary" on:click={redirectCampRegister}>
            Začíname
        </Button>
    </div>
</Hero>

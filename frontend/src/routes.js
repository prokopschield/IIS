import CampRegister from "./routes/CampRegister.svelte";
import Home from "./routes/Home.svelte";
import NotFound from "./routes/NotFound.svelte";
import Attende from "./routes/Attendee.svelte";
import Supervisor from "./routes/Supervisor.svelte";
import Organizer from "./routes/Organizer.svelte";


export const routes = {
	"/": Home,
	"/register" : CampRegister,
	"/organizer" : Organizer,
	"/supervisor": Supervisor,
	"/attendee" : Attende,

	"*": NotFound
};
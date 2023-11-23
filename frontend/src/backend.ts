import { createClient } from "@prokopschield/simple-socket-client";

export const [backend, socket] = createClient("https://camp.fitvut.cz");

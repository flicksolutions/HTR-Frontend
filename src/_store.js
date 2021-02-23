import { writable } from 'svelte/store';

export let token = writable(null);
export let authenticated = writable(false);
export const URL = "https://transkribus.eu/TrpServer";
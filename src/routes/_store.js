import { writable } from 'svelte/store';

export let token = writable(null);
export let authenticated = writable(false);
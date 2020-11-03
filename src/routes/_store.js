import { writable } from 'svelte-persistent-store/dist/session';

export const token = writable('sessionId', null);
export const authenticated = writable('sessionId', false);
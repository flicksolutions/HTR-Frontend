import { readable } from 'svelte-persistent-store/dist/session';
//const fetch = require('node-fetch');

const createSessionId = (set) => {
    fetch(`auth.json`).then(res => res.json()).then(json => set(json.sessionId));
    return () => {console.log("stop")}
};

export const sessionId = readable('sessionId', '', createSessionId);
import { writable, readable, derived } from 'svelte-persistent-store/dist/session';




const createSessionId = async (set) => {
    const fetch = require('node-fetch');

    const response = await fetch('https://transkribus.eu/TrpServer/rest/auth/login', {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: 'user=transkribus@flicks.jetzt&pw=t{f/I<;!B4{nwBeWfbg2Iw'
        });
    const data = await response.text();
    const sessionId = data.substring(data.indexOf('<sessionId>')+11,data.indexOf('</sessionId>'));
    set(sessionId);
    return function stop() {
        //clear the session
    };
};

const loggedIn = async () => {
    const response = await fetch('https://dog.ceo/api/breeds/list/all', {
        method: 'GET'
    });
    const data = await response.json();
    return data;
}
const getSession = readable('sessionId', '', createSessionId);
export const sessionId = getSession;
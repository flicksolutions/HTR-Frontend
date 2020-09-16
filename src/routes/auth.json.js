const fetch = require('node-fetch');

const loggedIn = async () => {
    const response = await fetch('https://transkribus.eu/TrpServer/rest/auth/login', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*'

        },
        body: 'user=transkribus@flicks.jetzt&pw=t{f/I<;!B4{nwBeWfbg2Iw'
    });
    const data = await response.text();
    const sessionId = data.substring(data.indexOf('<sessionId>')+11,data.indexOf('</sessionId>'));
    return sessionId;
};

export async function get(req, res) {
    const data = await loggedIn();

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });

    res.end(JSON.stringify({
        sessionId: data,
    }));
}
import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import session from 'express-session';
import Keycloak from "keycloak-connect";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const config = JSON.parse('{"realm": "readcoop", "auth-server-url": "https://account.readcoop.eu/auth", "ssl-required": "external", "resource": "unibe_transkribus_test", "public-client": true, "confidential-port": 0}');

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({store: memoryStore}, config);

/*how do i access keycloak in the app??*/

polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware(),
		keycloak.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});

<script>
	import { onMount } from 'svelte';
	import { token, authenticated } from './_store';
	import Collections from '../components/Collections.svelte';
	import Upload from '../components/Upload.svelte';


	let action;
	let Keycloak;
	let keycloak = {};

	onMount(async () => {
		console.log("calling onmount")
		const module = await import ('../keycloak');
		Keycloak = module.default;
		keycloak = new Keycloak({
			realm: "readcoop",
			url: "https://account.readcoop.eu/auth",
			clientId: "unibe_transkribus_test",
		});
		keycloak.init()
	});

	const auth = () => {
		if (keycloak.authenticated) {
			$authenticated = true;
			$token = keycloak.token;
		} else {
			keycloak.login({loginHint: "transkribus@flicks.jetzt"})
		}
		console.log(keycloak)
	}

	//$: if (keycloak && keycloak.token) {sessionId.set(keycloak.token)}
	$: console.log("value of authenticated changed!" + keycloak.authenticated)
	$: {
		if (keycloak) {
			setTimeout(() => { //we need to wait for the script to do it's job... This is not a clean way to do things.
				authenticated.set(keycloak.authenticated);
				token.set(keycloak.token);
			},800);
		}
	}
	const testfetch = async () => {
		console.log("running testfetch")
		console.log("token: " + keycloak.token)
		let response = await fetch('https://transkribus.eu/TrpServer/rest/collections/list', {
			method: 'GET',
			//mode: 'no-cors',
			withCredentials: true,
			credentials: 'include',
			headers: {
				'Authorization': 'Bearer ' + keycloak.token
			}
		})
		let collections = await response.json();
		console.log(collections)
	}

	const testrequest = async () => {
		console.log("running testrequest")
		console.log("token: " + keycloak.token)
		const req = new XMLHttpRequest();
		req.open('GET', 'https://transkribus.eu/TrpServer/rest/collections/list', true);
		req.setRequestHeader('Accept', 'application/json');
		req.setRequestHeader('Authorization', 'Bearer ' + keycloak.token);
		req.send();
	}

</script>

<svelte:head>
	<title>HTR Frontend</title>
</svelte:head>
<h1>HTR-Frontend</h1>
<button on:click={testfetch}>testfetch</button>
<button on:click={testrequest}>testrequest</button>
{#if !$authenticated}
	<p>Bitte loggen Sie sich ein: </p>
	<button on:click={auth}>Bei Transkribus einloggen</button>
{:else}
	{#if !action}
		<p>Would you like to upload files or process files already on the server?</p>
		<button on:click={() => {action = Upload}}>upload!</button> <button on:click={() => {action = Collections}}>process!</button>
	{:else}
		<svelte:component this={action} { keycloak } />
	{/if}
{/if}

<style>

</style>
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
		let response = await fetch('https://transkribus.eu/TrpServer/rest/collections/list?JSESSIONID='+keycloak.sessionId, {
			method: 'GET',
			mode: 'no-cors',
		})
		let collections = await response.json();
		console.log(collections)
	}

</script>

<svelte:head>
	<title>HTR Frontend</title>
</svelte:head>
<h1>HTR-Frontend</h1>
<button on:click={testfetch}>testfetch</button>
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
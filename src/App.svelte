<script>
	import "smelte/src/tailwind.css" ;
	import Button from "smelte/src/components/Button";
	import { onMount } from 'svelte';
	import { token, authenticated } from './_store';
	import Collections from './Collections.svelte';
	import Upload from './Upload.svelte';


	let action;
	let Keycloak;
	let keycloak = {};
	let customUrl = 'https://transkribus.eu/TrpServerTesting/rest/collections/list';
	onMount(async () => {
		const module = await import ('./keycloak');
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
		//console.log(keycloak)
	}
	$: console.log("value of authenticated changed!" + keycloak.authenticated)
	$: {
		if (keycloak) {
			setTimeout(() => { //we need to wait for the script to do it's job... This is not a clean way to do things.
				authenticated.set(keycloak.authenticated);
				token.set(keycloak.token);
			},800);
		}
	}
	const testfetch = async (url) => {
		console.log("running testfetch")
		let response = await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + keycloak.token
			}
		})
		let collections = await response.json();
		console.log("this is the response")
		console.log(response)
		console.log("json() consumed:")
		console.log(collections)
	}


</script>
<svelte:head>
	<title>HTR Frontend</title>
	<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons&display=swap"
		  rel="stylesheet" />
</svelte:head>

<main>
	<h1>HTR-Frontend</h1>
	<!-- <button on:click={testrequest}>testrequest</button>-->
	{#if !$authenticated}
		<p>Bitte loggen Sie sich ein: </p>
		<button on:click={auth}>Bei Transkribus einloggen</button>
	{:else}
		<button on:click={() => testfetch('https://transkribus.eu/TrpServerTesting/rest/collections/list')}>testfetch collections/list</button>
		<button on:click={() => testfetch('https://transkribus.eu/TrpServerTesting/rest/collections/76206/list')}>testfetch collections/76206/list</button>
		<input bind:value={customUrl} size="100">
		<button on:click={() => testfetch(customUrl)}>testfetch {customUrl}</button>

		{#if !action}
			<p>Would you like to upload files or process files already on the server?</p>
			<button on:click={() => {action = Upload}}>upload!</button> <button on:click={() => {action = Collections}}>process!</button>
		{:else}
			<svelte:component this={action} { keycloak } />
		{/if}
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}


	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
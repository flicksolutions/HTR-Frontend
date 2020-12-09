<script>
	import "smelte/src/tailwind.css" ;
	import Button from "smelte/src/components/Button";
	import TextField from "smelte/src/components/TextField";
	import Switch from "smelte/src/components/Switch";
	import Tabs from "smelte/src/components/Tabs";
	import { Tab } from "smelte";
	import { onMount } from 'svelte';
	import { token, authenticated } from './_store';
	import Collections from './Collections.svelte';
	import Upload from './Upload.svelte';
	import { fly } from 'svelte/transition';


	let action;
	let Keycloak;
	let keycloak = {};
	let customUrl = 'https://transkribus.eu/TrpServerTesting/rest/collections/list';
	let devMode = false;

	const initKeycloak = () => {
		console.log("init keycloak")
		keycloak = new window.Keycloak({
			realm: "readcoop",
			url: "https://account.readcoop.eu/auth",
			clientId: "unibe_transkribus_test",
		});
		keycloak.init()
	}

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
let loading = false;

</script>
<svelte:head>
	<title>HTR Frontend</title>
	<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons&display=swap"
		  rel="stylesheet" />
	<script src="https://account.readcoop.eu/auth/js/keycloak.js" on:load={initKeycloak}></script>
</svelte:head>

<main class="text-center p-4 container mx-auto">
	<h1>HTR-Frontend</h1>
	<!-- <button on:click={testrequest}>testrequest</button>-->
	{#if !$authenticated}
		<p>Please log in at Transkribus </p>
		<Button on:click={auth}>Log In</Button>
	{:else}
		<Tabs
				class="bg-primary-700 elevation-10 mt-6 text-white rounded-t-lg"
				let:selected={selected}
				{loading}
				items={[
      { id: "1", text: 'upload'},
      { id: "2", text: 'process'},
    ]}>
			<div
					slot="content"
					class="flex items-center content-center w-full h-full"
			>
				<Tab id="1" {selected}>
					<Upload { keycloak } />
				</Tab>
				<Tab id="2" {selected}>
					<Collections { keycloak } />
				</Tab>
			</div>
		</Tabs>

		<p class="mt-5"><Switch bind:value={devMode}/> dev Mode</p>
		{#if devMode}
			<div transition:fly={{y:200, duration:1000}}>
				<Button on:click={() => testfetch('https://transkribus.eu/TrpServerTesting/rest/collections/list')}>testfetch collections/list</Button>
				<Button on:click={() => testfetch('https://transkribus.eu/TrpServerTesting/rest/collections/76206/list')}>testfetch collections/76206/list</Button>
				<TextField label="custom URL" bind:value={customUrl} />
				<Button on:click={() => testfetch(customUrl)}>fetch custom URL</Button>
			</div>
		{/if}
	{/if}
</main>
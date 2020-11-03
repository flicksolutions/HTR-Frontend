<script>
	import { onMount } from 'svelte';
	import { sessionId } from './_store';
	import Login from '../components/Login.svelte';
	import Collections from '../components/Collections.svelte';
	import Upload from '../components/Upload.svelte';


	let action;
	let authenticated = false;
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
			authenticated = true;
		} else {
			keycloak.login({loginHint: "transkribus@flicks.jetzt"})
		}
		console.log(keycloak)
		console.log(keycloak.token)
	}

	//$: if (keycloak && keycloak.token) {sessionId.set(keycloak.token)}
	$: console.log("value of authenticated changed!" + keycloak.authenticated)
	$: {
		console.log("running big batch!")
		if (keycloak) {
			console.log(keycloak)
			console.log(keycloak["authenticated"])
			console.log("keycloak:")
			setTimeout(() => {
				console.log(JSON.stringify(keycloak.authenticated))
				authenticated = keycloak.authenticated;
			},800);
		}
	}

</script>

<svelte:head>
	<title>HTR Frontend</title>
</svelte:head>
<h1>HTR-Frontend</h1>
<p>Token: {keycloak.token}</p>
<p>auth: {authenticated}</p>
<button on:click={console.log(keycloak.authenticated)}>auth</button>
{#if !authenticated}
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
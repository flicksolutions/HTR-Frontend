<script>
	import { onMount } from 'svelte';
	import { sessionId } from './_store';
	import Login from '../components/Login.svelte';
	import Collections from '../components/Collections.svelte';
	import Upload from '../components/Upload.svelte';

	let action;
	const auth = () => {
		var keycloak = new Keycloak(JSON.parse('{"realm": "readcoop", "auth-server-url": "https://account.readcoop.eu/auth", "ssl-required": "external", "resource": "unibe_transkribus_test", "public-client": true, "confidential-port": 0}'));
		keycloak.init().then(function (authenticated) {
			alert(authenticated ? 'authenticated' : 'not authenticated');
		}).catch(function () {
			alert('failed to initialize');
		});
		console.log("auth");
	}

	onMount(() => {

	});
</script>

<svelte:head>
	<script src="https://account.readcoop.eu/auth/js/keycloak.js"></script>
	<title>HTR Frontend</title>
</svelte:head>
<button on:click={auth}>Use this button to initialise Keycloak!</button>
<h1>HTR-Frontend</h1>
{#if !$sessionId}
	<Login />
{:else}
	{#if !action}
		<p>Would you like to upload files or process files already on the server?</p>
		<button on:click={() => {action = Upload}}>upload!</button> <button on:click={() => {action = Collections}}>process!</button>
	{:else}
		<svelte:component this={action} />
	{/if}
{/if}

<style>

</style>
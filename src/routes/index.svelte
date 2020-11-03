<script>
	import { onMount } from 'svelte';
	import { sessionId } from './_store';
	import Login from '../components/Login.svelte';
	import Collections from '../components/Collections.svelte';
	import Upload from '../components/Upload.svelte';


	let action;

	let Keycloak;
	let keycloak;

	onMount(async () => {
		const module = await import ('../keycloak');
		Keycloak = module.default;
		keycloak = new Keycloak({realm: "readcoop", url: "https://account.readcoop.eu/auth", clientId: "unibe_transkribus_test", username: "transkribus@flicks.jetzt", password: "dummy"});
		keycloak.init()
	});

	const auth = () => {
		//let login = keycloak.login({url:"https://account.readcoop.eu/auth",email: "transkribus@flicks.jetzt", password: "dummy"})
		keycloak.login()
		console.log(keycloak)
	}


</script>

<svelte:head>
	<title>HTR Frontend</title>
</svelte:head>
<button on:click={auth}>Use this button to initialise Keycloak!</button>
<button on:click={() => {console.log(keycloak.token)}}>Token</button>
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
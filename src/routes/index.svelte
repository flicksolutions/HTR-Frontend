
<script>
	import { onMount } from 'svelte';
	import { sessionId } from './_store';
	import Login from '../components/Login.svelte';
	import Collections from '../components/Collections.svelte';
	import Upload from '../components/Upload.svelte';

	let action;

</script>

<svelte:head>
	<title>HTR Frontend</title>
</svelte:head>

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
<script>
	import { onMount } from 'svelte';
	import { sessionId } from './_store';
	import Login from '../components/Login.svelte';
	import Collections from '../components/Collections.svelte';

	onMount(() => {
		if (!$sessionId) {
			console.log('sessionID is not truthy!')
			fetch(`auth.json`).then(res => res.json()).then(json => sessionId.set(json.sessionId));
		}
	});
</script>

<svelte:head>
	<title>HTR Frontend</title>
</svelte:head>

<h1>HTR-Frontend</h1>
{#if !$sessionId}
	<Login />
{:else}
	<Collections />
{/if}

<style>

</style>
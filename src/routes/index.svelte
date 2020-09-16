<script context="module">
	/*export async function preload() {
		const res = await this.fetch(`auth.json`);
		const loggedIn = await res.json();

		return { loggedIn };
	}*/
</script>

<script>
	import { onMount } from 'svelte';
	import { sessionId } from './_store';
	import Login from '../components/Login.svelte';
	import Collections from '../components/Collections.svelte';
	import HTR from '../components/HTR.svelte';

	onMount(() => {
		console.log('running onmount')
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
	<HTR />
{/if}

{$sessionId}

<style>

</style>
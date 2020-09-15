<script context="module">
	export async function preload() {
		const res = await this.fetch(`auth.json`);
		const loggedIn = await res.json();

		return { loggedIn };
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { writable, readable, derived } from 'svelte-persistent-store/dist/session';

	onMount(() => {
		console.log('the component has mounted');
	});
</script>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<h1>Great success!</h1>

<figure>
	<img alt='Success Kid' src='successkid.jpg'>
	<figcaption>Have fun with Sapper!</figcaption>
</figure>

<p>Logged in?</p>
{#await loggedIn then value}
	{value.sessionId}
{/await}

<style>
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>
<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let promise: Promise<any> = getTree();

	async function getTree() {
		const res = await fetch(`/api/elements/${data.element.name}/recipe`);
		const body = await res.json();

		if (res.ok) {
			return body;
		} else {
			throw new Error(body);
		}
	}

	onMount(() => {
		promise = getTree();
	});
</script>

<div class="flex flex-row justify-between space-x-2 font-medium md:mt-10">
	<button class="px-2 py-1 border rounded-md shadow-sm shrink-0" on:click={() => goto('/')}>
		⬅️ Search
	</button>
	<button
		class="px-2 py-1 border rounded-md shadow-sm shrink-0"
		on:click={() => goto('/')}
		disabled
	>
		Random ➡️
	</button>
</div>

<div class="flex flex-col items-center mt-5 space-y-3">
	<h1 class="text-4xl font-semibold">How to craft</h1>

	<button
		class="px-2 py-1 border rounded-md shadow-sm shrink-0"
		on:click={() => goto('/')}
		disabled
	>
		{data.element.emoji}
		{data.element.name}
	</button>
</div>

{#await promise}
	<p>...waiting</p>
{:then data}
	<p class="whitespace-pre-wrap">
		{JSON.stringify(data, null, 8)}
	</p>
{:catch error}
	<p style="color: red">{JSON.stringify(error.message, null, 4)}</p>
{/await}

<!-- <Graph></Graph> -->

<script lang="ts">
	import { afterNavigate, beforeNavigate, goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Input from '$lib/components/ui/input/input.svelte';
	import { fade, scale } from 'svelte/transition';

	import _ from 'lodash';
	import Button from '$lib/components/mine/button.svelte';

	const debounce = (mainFunction: any, delay: number | undefined) => {
		// Declare a variable called 'timer' to store the timer ID
		let timer: number | undefined;

		// Return an anonymous function that takes in any number of arguments
		return function (...args: any) {
			// Clear the previous timer to prevent the execution of 'mainFunction'
			clearTimeout(timer);

			// Set a new timer that will execute 'mainFunction' after the specified delay
			timer = setTimeout(() => {
				mainFunction(...args);
			}, delay);
		};
	};

	let search: string;
	$: search = '';
	let random_element: string | null = null;
	let query: string | null = null;
	let elements: { name: string; emoji: string }[] = [];
	let noResults: boolean = false;

	async function get_elements() {
		console.log('getting');
		if (search == '') {
			elements = [];
			search = '';
			noResults = false;
			return;
		}

		const res = await fetch('/api/elements?q=' + search);
		elements = await res.json();
		if (elements.length == 0) {
			noResults = true;
		}
	}

	async function getRandomElement() {
		const res = await fetch('/api/elements/random');
		random_element = (await res.json()).name;
	}

	function getRandomSearchQuery(): string {
		const q = (random_element ?? '').split(' ')[0];
		return q.substring(0, Math.floor(q.length / 2));
	}

	beforeNavigate(() => {
		random_element = null;
	});

	afterNavigate(() => {
		query = $page.url.searchParams.get('q');
		search = query ?? '';

		get_elements();
		getRandomElement();
	});
</script>

<div class="flex flex-row space-x-2">
	<Input
		placeholder="Search..."
		bind:value={search}
		on:input={debounce(get_elements, 200)}
		class="h-[34px] text-base bg-white"
		autocomplete="false"
	></Input>
	{#if search != ''}
		<Button on:click={() => goto('/')}>❌</Button>
	{/if}

	<Button on:click={() => goto('/info')}>❓</Button>
	<Button on:click={() => goto(`/${random_element}`)}>🔀</Button>
</div>

{#if elements.length == 0}
	<div class="flex flex-wrap gap-2 my-2 font-medium">
		{#if noResults}
			<Button on:click={() => goto('/info')}>😭 No Results</Button>
		{/if}
		{#if random_element}
			<Button on:click={() => goto(`?q=${getRandomSearchQuery()}`)} fadeIn={true}
				>✨ Random Search</Button
			>
		{/if}
	</div>
{/if}

<div class="flex flex-wrap gap-2 my-2">
	{#each elements as element}
		<Button on:click={() => goto(`?q=${search}`).then(() => goto(`/${element.name}`))}
			>{element.emoji} {element.name}</Button
		>
	{/each}

	{#if elements.length == 100}
		<Button on:click={() => goto('/info')}>➕ Many more...</Button>
	{/if}
</div>

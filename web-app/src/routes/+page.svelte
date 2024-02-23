<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Popover from '$lib/components/ui/popover';

	import _ from 'lodash';

	const debounce = (mainFunction: any, delay: number | undefined) => {
		// Declare a variable called 'timer' to store the timer ID
		let timer: number | undefined;

		// Return an anonymous function that takes in any number of arguments
		return function (...args: any) {
			// Clear the previous timer to prevent the execution of 'mainFunction'
			clearTimeout(timer);

			searching = true;

			// Set a new timer that will execute 'mainFunction' after the specified delay
			timer = setTimeout(() => {
				mainFunction(...args);
			}, delay);
		};
	};

	$: search = '';
	$: query = $page.url.searchParams.get('q') || '';
	let elements: { name: string; emoji: string }[] = [];
	let searching = false;

	function handle_search() {
		goto(`?q=${search}`, { replaceState: true });
	}

	async function get_products() {
		searching = true;
		if (!search) {
			reset();
			return;
		}

		const data = await fetch('/api/elements?q=' + search).then((res) => {
			return res.json();
		});
		elements = data ?? [];
		searching = false;
	}

	function reset() {
		searching = false;
		elements = [];
		search = '';
	}

	afterNavigate(() => {
		search = query;
		get_products();
	});
</script>

<div class="flex flex-row space-x-2">
	<Input
		placeholder="Search..."
		bind:value={search}
		on:input={debounce(handle_search, 1000)}
		class="h-[34px] text-base"
		autocomplete="false"
	></Input>
	{#if search != ''}
		<button class="px-2 py-1 border rounded-md shadow-sm shrink-0" on:click={() => goto('/')}>
			<p class={searching ? 'animate-spin' : ''}>❌</p>
		</button>
	{/if}
	<button
		class="px-2 py-1 border rounded-md shadow-sm shrink-0 font-medium"
		on:click={() => alert('Coming soon!')}
	>
		🔀
	</button>
</div>

{#if elements.length == 0 && !searching}
	<div class="flex flex-wrap gap-2 my-2 font-medium">
		{#if query != ''}
			<button class="px-2 py-1 border rounded-md shadow-sm" on:click={() => goto('/about')}
				>😭 No Results</button
			>
		{:else}
			<button class="px-2 py-1 border rounded-md shadow-sm" on:click={() => goto('/about')}
				>❓ Get more info</button
			>
		{/if}

		<button
			class="px-2 py-1 border rounded-md shadow-sm"
			on:click={() => {
				goto('?q=' + _.sample(['Dog', 'Cat', 'Sun', 'Cactus', 'Fire', 'Car']), {
					replaceState: true
				});
			}}>✨ Random Search</button
		>
	</div>
{/if}

<div class="flex flex-wrap gap-2 my-2">
	{#each elements as element}
		<a class="px-2 py-1 font-medium border rounded-md shadow-sm" href={'/recipe/' + element.name}>
			{element.emoji}
			{element.name}
		</a>
	{/each}

	{#if elements.length == 100}
		<button
			class="px-2 py-1 border rounded-md shadow-sm font-medium"
			on:click={() => goto('/about')}>➕ Many more...</button
		>
	{/if}
</div>

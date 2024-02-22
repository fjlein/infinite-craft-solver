<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Input from '$lib/components/ui/input/input.svelte';
	import StatusBar from './status-bar.svelte';

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

	let search = $page.url.searchParams.get('q') || '';
	let elements: { name: string; emoji: string }[] = [];
	let searching = false;

	function handle_search() {
		// if (timeout) clearTimeout(timeout);
		// timeout = setTimeout(get_products, 100);
		searching = true;
		goto(`?q=${search}`);
	}

	async function get_products() {
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
		elements = [];
		search = '';
		searching = false;
	}

	afterNavigate(() => {
		search = $page.url.searchParams.get('q') || '';
		get_products();
	});
</script>

<div>
	<div class="mb-1">
		<a class="text-4xl font-semibold" href="/"> <h1>Infinite Craft Solver</h1></a>
	</div>

	<p class="mb-5 text-muted-foreground">
		Find the shortest crafting path in
		<a class="text-blue-600 hover:underline" href="https://neal.fun/infinite-craft"
			>Infinite Craft</a
		>.
	</p>

	<div class="flex flex-row space-x-2">
		<Input
			placeholder="Dog, Firetruck, ..."
			bind:value={search}
			on:input={debounce(handle_search, 1000)}
			class="h-[34px]"
			autocomplete="false"
		></Input>
		{#if search != ''}
			<button class="px-2 py-1 border rounded-md shadow-sm shrink-0" on:click={() => goto('/')}>
				<p class={searching ? 'animate-spin' : ''}>❌</p>
			</button>
		{/if}
	</div>

	{#if elements.length == 0}
		<div class="flex flex-wrap gap-2 my-2 font-medium">
			<button
				class="px-2 py-1 border rounded-md shadow-sm"
				on:click={() => {
					search = 'Dog';
					handle_search();
				}}>Search 🐶</button
			>
			<button
				class="px-2 py-1 border rounded-md shadow-sm"
				on:click={() => {
					search = 'Cat';
					handle_search();
				}}>Search 🐈</button
			>
			<button
				class="px-2 py-1 border rounded-md shadow-sm"
				on:click={() => {
					search = 'Sunbathing';
					handle_search();
				}}>Search ☀️</button
			>
		</div>
	{/if}

	<div class="flex flex-wrap gap-2 my-2">
		{#each elements as element}
			<a class="px-2 py-1 font-medium border rounded-md shadow-sm" href={'/path/' + element.name}>
				{element.emoji}
				{element.name}
			</a>
		{/each}
	</div>
</div>

<div class="mt-10 justify-self-end">
	<StatusBar></StatusBar>
</div>

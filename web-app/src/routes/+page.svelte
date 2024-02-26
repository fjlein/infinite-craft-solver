<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Input from '$lib/components/ui/input/input.svelte';
	import _ from 'lodash';
	import Button from '$lib/components/mine/button.svelte';

	let search: string = '';
	let random_element: string | null = null;
	let query: string | null = null;
	let elements: { name: string; emoji: string }[] = [];
	let noResults: boolean = false;

	const debounce = (mainFunction: any, delay: number | undefined) => {
		let timer: number | undefined;

		return function (...args: any) {
			clearTimeout(timer);

			timer = setTimeout(() => {
				mainFunction(...args);
			}, delay);
		};
	};

	async function get_elements(): Promise<void> {
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

	async function getRandomElement(): Promise<void> {
		const res = await fetch('/api/elements/random');
		random_element = (await res.json()).name;
	}

	function getRandomSearchQuery(): string {
		const q = random_element!.split(' ')[0];
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
			<Button on:click={() => goto(`?q=${getRandomSearchQuery()}`)} fadeIn={true}>
				✨ Random Search
			</Button>
		{/if}
	</div>
{/if}

<div class="flex flex-wrap gap-2 my-2" data-sveltekit-preload-code="viewport">
	{#each elements as element}
		<!-- <Button on:click={() => goto(`?q=${search}`).then(() => goto(`/${element.name}`))}>
			{element.emoji}
			{element.name}
		</Button> -->
		<a
			href={`/${element.name}`}
			class="px-2 py-1 border rounded-md shadow-sm shrink-0 bg-white hover:bg-slate-50 active:shadow-none"
			>{element.emoji}
			{element.name}</a
		>
	{/each}

	{#if elements.length == 100}
		<Button on:click={() => goto('/info')}>➕ Many more...</Button>
	{/if}
</div>

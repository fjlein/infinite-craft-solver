<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import Input from '$lib/components/ui/input/input.svelte';
	import _ from 'lodash';
	import { Loader2, X } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import CustomLink from '$lib/components/mine/link.svelte';

	let search: string = '';
	let random_element: string | null = null;
	let query: string | null = null;
	let elements: { name: string; emoji: string }[] = [];
	let noResults: boolean = false;
	let searching: boolean = false;

	const debounce = (mainFunction: any, delay: number | undefined) => {
		let timer: number | undefined;

		return function (...args: any) {
			clearTimeout(timer);

			timer = setTimeout(() => {
				mainFunction(...args);
			}, delay);
		};
	};

	function reset() {
		elements = [];
		search = '';
		noResults = false;
		searching = false;
	}

	async function get_elements(): Promise<void> {
		if (search == '') {
			reset();
			return;
		}
		searching = true;
		const res = await fetch('/api/elements?q=' + search);
		elements = await res.json();

		if (elements.length == 0) {
			noResults = true;
		}
		searching = false;
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

<p class="mb-5 text-muted-foreground">
	Find the shortest recipe in <a
		href="https://neal.fun/infinite-craft"
		class="underline underline-offset-4">Infinite Craft</a
	>.
</p>

<div class="flex flex-row space-x-2">
	<div class="w-full relative">
		<Input
			placeholder="Search..."
			bind:value={search}
			on:input={debounce(get_elements, 200)}
			class="h-[34px] text-base bg-white"
			autocomplete="false"
		></Input>
		{#if searching || $navigating}
			<div
				class="absolute right-2 -translate-y-[26px]"
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 200 }}
			>
				<Loader2 class="animate-spin text-muted-foreground" size="16"></Loader2>
			</div>
		{/if}
		<!-- {#if !searching && (noResults || elements.length > 0)}
			<button
				class="absolute right-2 -translate-y-[26px]"
				in:fade={{ duration: 50 }}
				out:fade={{ duration: 50 }}
				on:click={() => goto('/')}
			>
				<X class="text-muted-foreground" size="18"></X>
			</button>
		{/if} -->
	</div>

	<CustomLink href="/info">❓</CustomLink>
	<CustomLink href="/random">🔀</CustomLink>
</div>

{#if elements.length == 0}
	<div class="flex flex-wrap gap-2 my-2 font-medium">
		{#if noResults}
			<CustomLink href="/info">😭 No Results</CustomLink>
			<CustomLink href="/">❌ Clear</CustomLink>
		{/if}
		{#if random_element}
			<CustomLink href={`?q=${getRandomSearchQuery()}`} fadeIn>✨ Random Search</CustomLink>
		{/if}
	</div>
{/if}

<div class="flex flex-wrap gap-2 my-2" data-sveltekit-preload-code="viewport">
	{#each elements as element}
		<CustomLink href={`/${element.name}`} on:click={() => goto(`?q=${search}`)}>
			{element.emoji}
			{element.name}
		</CustomLink>
	{/each}

	{#if elements.length == 100}
		<CustomLink href="/info">➕ Many more...</CustomLink>
	{/if}
</div>

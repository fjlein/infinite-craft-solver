<script lang="ts">
	import { afterNavigate, goto, invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import _ from 'lodash';
	import { page } from '$app/stores';
	import Graph from '$lib/components/mine/graph.svelte';

	export let data: PageData;

	interface Recipe {
		first: {
			name: string;
			emoji: string;
		};
		second: {
			name: string;
			emoji: string;
		};
		result: {
			name: string;
			emoji: string;
		};
	}

	async function getRecipe(name: string) {
		const res = await fetch(`/api/elements/${name}/recipe`);
		const body = await res.json();

		if (res.ok) {
			return body;
		} else {
			throw new Error(body);
		}
	}

	async function resolveRecipes() {
		while (toResolve.length != 0) {
			const element: string = toResolve.shift()!;
			if (['Fire', 'Water', 'Earth', 'Wind', ..._.map(recipes, 'result.name')].includes(element)) {
				continue;
			}

			const recipe: Recipe = await getRecipe(element);
			recipes = [...recipes, recipe];

			if (!nodes.includes(recipe.first.name)) {
				nodes.push(recipe.first.name);
				child.addNode(recipe.first.name);
			}

			if (!nodes.includes(recipe.second.name)) {
				nodes.push(recipe.second.name);
				child.addNode(recipe.second.name);
			}

			if (!nodes.includes(recipe.result.name)) {
				nodes.push(recipe.result.name);
				child.addNode(recipe.result.name);
			}

			child.addLink(recipe.first.name, recipe.result.name);
			child.addLink(recipe.second.name, recipe.result.name);

			toResolve.push(recipe.first.name, recipe.second.name);
			await new Promise((r) => setTimeout(r, 500));
		}
	}

	let nodes: string[] = [];

	let recipes: Recipe[];
	$: recipes = [];

	let toResolve: string[];

	afterNavigate(() => {
		recipes = [];
		toResolve = [data.element.name];
		resolveRecipes();
	});

	let child: Graph;
</script>

<div class="flex flex-row justify-between space-x-2 font-medium">
	<button
		class="px-2 py-1 border rounded-md shadow-sm shrink-0 bg-white hover:bg-slate-50 active:shadow-none"
		on:click={() => goto('/')}
	>
		⬅️ Search
	</button>
	<button
		class="px-2 py-1 border rounded-md shadow-sm shrink-0 bg-white hover:bg-slate-50 active:shadow-none"
		on:click={() => goto('/random')}
	>
		🔀
	</button>
</div>

<Graph bind:this={child}></Graph>

<pre>

	{JSON.stringify(recipes, null, 4)}
</pre>

<!-- <Graph></Graph> -->

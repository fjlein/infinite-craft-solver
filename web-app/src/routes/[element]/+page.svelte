<script lang="ts">
	import { afterNavigate, goto, invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import Graph from '$lib/components/mine/graph.svelte';
	import _ from 'lodash';
	import Link from '$lib/components/mine/link.svelte';

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
		while (!toResolve.every((e) => e === null)) {
			console.log(tree);
			console.log(toResolve);
			const l = tree.length;

			const element: string | null = toResolve.shift()!;

			console.log('Resolving:', element);

			if (['Fire', 'Water', 'Earth', 'Wind', null].includes(element)) {
				tree.push(null, null);
				toResolve.push(null, null);
				// await new Promise((r) => setTimeout(r, 2000));
				continue;
			}

			let recipe: Recipe | undefined = _.find(recipes, (n) => n.result.name == element);

			if (!recipe) {
				recipe = (await getRecipe(element)) as Recipe;
			}

			recipes = [...recipes, recipe];

			if (tree.length == 1) {
				child.addNode(recipe.result.name + 0, 0, `${recipe.result.emoji} ${recipe.result.name}`);
			}

			const level = Math.floor(Math.log2(l + 2));

			console.log(recipe.first.name + l, level);
			console.log(recipe.second.name + (l + 1), level);

			child.addNode(recipe.first.name + l, level, `${recipe.first.emoji} ${recipe.first.name}`);
			child.addNode(
				recipe.second.name + (l + 1),
				level,
				`${recipe.second.emoji} ${recipe.second.name}`
			);

			tree.push(recipe.first.name + l);
			child.addLink(recipe.first.name + l, tree[Math.floor(l / 2)]);

			tree.push(recipe.second.name + (l + 1));
			child.addLink(recipe.second.name + (l + 1), tree[Math.floor(l / 2)]);

			toResolve.push(recipe.first.name, recipe.second.name);
			await new Promise((r) => setTimeout(r, 500));
		}
	}

	let tree: (string | null)[] = [];

	let recipes: Recipe[];
	$: recipes = [];

	let toResolve: (string | null)[];

	afterNavigate(() => {
		recipes = [];
		toResolve = [data.element.name];
		tree = [data.element.name + 0];
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
	<Link href="/random">🔀</Link>
</div>

<Graph bind:this={child}></Graph>

<!-- <pre>

	{JSON.stringify(recipes, null, 4)}
</pre> -->

<!-- <Graph></Graph> -->

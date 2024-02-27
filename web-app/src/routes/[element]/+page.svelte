<script lang="ts">
	import { afterNavigate, goto, invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import CustomLink from '$lib/components/mine/link.svelte';
	import Graph from '$lib/components/mine/graph.svelte';
	import _ from 'lodash';

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
		let recipe: Recipe | undefined = _.find(recipes, (n) => n.result.name == name);

		if (recipe) {
			return recipe;
		}
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
			const element: string = toResolve.shift() as string;

			if (['Fire', 'Water', 'Earth', 'Wind', null].includes(element)) {
				tree.push(null, null);
				toResolve.push(null, null);
				continue;
			}

			const l = tree.length;

			const recipe = await getRecipe(element);

			recipes = [...recipes, recipe];

			if (l == 1) {
				graph.addNode(recipe.result.name + 0, 0, `${recipe.result.emoji} ${recipe.result.name}`);
			}

			const level = Math.floor(Math.log2(l + 2));

			graph.addNode(
				recipe.first.name + l,
				level,
				`${recipe.first.emoji} ${recipe.first.name}`,
				tree[Math.floor(l / 2)]
			);
			graph.addNode(
				recipe.second.name + (l + 1),
				level,
				`${recipe.second.emoji} ${recipe.second.name}`,
				tree[Math.floor(l / 2)]
			);

			tree.push(recipe.first.name + l);
			graph.addLink(tree[Math.floor(l / 2)], recipe.first.name + l);

			tree.push(recipe.second.name + (l + 1));
			graph.addLink(tree[Math.floor(l / 2)], recipe.second.name + (l + 1));

			toResolve.push(recipe.first.name, recipe.second.name);
			await new Promise((r) => setTimeout(r, 200));
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

	let graph: Graph;
</script>

<p class="mb-5 text-muted-foreground">
	{data.element.emoji}
	{data.element.name}
</p>

<div class="flex flex-row justify-between space-x-2 font-medium">
	<CustomLink href="/">⬅️ Search</CustomLink>
	<div class="flex space-x-2">
		<CustomLink href="/info">❓</CustomLink>
		<CustomLink href="/random">🔀</CustomLink>
	</div>
</div>

<Graph bind:this={graph}></Graph>

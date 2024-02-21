<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { tweened } from 'svelte/motion';
	import { derived } from 'svelte/store';
	import { cubicOut } from 'svelte/easing';
	import { Loader2 } from 'lucide-svelte';

	export let data: PageData;

	export const name = writable<string>(data.status.name);

	let resolved = tweened(0, { duration: 5000, easing: cubicOut });
	let resolved_formatted = derived(resolved, ($myNumber) => $myNumber.toFixed());

	let queued = tweened(0, { duration: 5000, easing: cubicOut });
	let queued_formatted = derived(queued, ($myNumber) => $myNumber.toFixed());

	let elements = tweened(0, { duration: 5000, easing: cubicOut });
	let elements_formatted = derived(elements, ($myNumber) => $myNumber.toFixed());

	onMount(() => {
		resolved.set(data.status.resolved);
		queued.set(data.status.queued);
		elements.set(data.status.elements);

		async function fetchStatus() {
			const s = await fetch('/api/status').then((x) => x.json());
			resolved.set(s.resolved);
			queued.set(s.queued);
			elements.set(s.elements);
			name.set(s.name);
			setTimeout(fetchStatus, 5000);
		}

		fetchStatus();
	});
</script>

<div class="grid min-h-screen place-items-center">
	<div
		class="grid p-4 border rounded-md grid-cols-2 md:grid-cols-4 gap-5 md:gap-x-10 justify-start md:place-items-center {$name ==
		'Running'
			? 'border-green-500 bg-green-50'
			: 'border-red-500 bg-red-50'}"
	>
		<div class="flex flex-col">
			<p class="mb-1 text-xs font-medium text-gray-600 uppercase">Current status</p>
			<div class="flex items-center space-x-2">
				<div
					class="w-2 h-2 rounded-full {$name == 'Running'
						? 'animate-pulse bg-green-500'
						: 'bg-red-500'}"
				></div>
				<p>{$name}</p>
			</div>
		</div>
		<div class="flex flex-col">
			<p class="mb-1 text-xs font-medium text-gray-600 uppercase">Elements discovered</p>
			<div class="flex items-center space-x-2">
				<div
					class="w-2 h-2 rounded-full {$name == 'Running'
						? 'animate-pulse bg-green-500'
						: 'bg-red-500'}"
				></div>
				<p>{$elements_formatted}</p>
			</div>
		</div>
		<div class="flex flex-col">
			<p class="mb-1 text-xs font-medium text-gray-600 uppercase">Resolved Recipes</p>
			<div class="flex items-center space-x-2">
				<div
					class="w-2 h-2 rounded-full {$name == 'Running'
						? 'animate-pulse bg-green-500'
						: 'bg-red-500'}"
				></div>
				<p>{$resolved_formatted}</p>
			</div>
		</div>
		<div class="flex flex-col">
			<p class="mb-1 text-xs font-medium text-gray-600 uppercase">Queued Recipes</p>
			<div class="flex items-center space-x-2">
				<div
					class="w-2 h-2 rounded-full {$name == 'Running'
						? 'animate-pulse bg-green-500'
						: 'bg-red-500'}"
				></div>
				<p>{$queued_formatted}</p>
			</div>
		</div>
	</div>
</div>

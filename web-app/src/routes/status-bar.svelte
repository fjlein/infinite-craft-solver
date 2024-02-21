<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { tweened } from 'svelte/motion';
	import { derived } from 'svelte/store';
	import { cubicOut } from 'svelte/easing';

	export const name = writable<string>('Loading');

	let resolved = tweened(0, { duration: 5000, easing: cubicOut });
	let resolved_formatted = derived(resolved, ($myNumber) => $myNumber.toFixed());

	let queued = tweened(0, { duration: 5000, easing: cubicOut });
	let queued_formatted = derived(queued, ($myNumber) => $myNumber.toFixed());

	let elements = tweened(0, { duration: 5000, easing: cubicOut });
	let elements_formatted = derived(elements, ($myNumber) => $myNumber.toFixed());

	onMount(() => {
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

<div
	class="grid p-4 border rounded-md grid-cols-2 md:grid-cols-4 gap-5 md:gap-x-10 justify-start md:place-items-center w-full shadow-sm {$name ==
	'Loading'
		? 'bg-gray-50'
		: $name == 'Running'
			? ' bg-green-50'
			: ' bg-red-50'}"
>
	<div class="flex flex-col">
		<p class="mb-1 text-xs uppercase text-muted-foreground">Current status</p>
		<div class="flex items-center space-x-2">
			<div
				class="w-2 h-2 rounded-full {$name == 'Loading'
					? 'bg-gray-500'
					: $name == 'Running'
						? 'animate-pulse bg-green-500'
						: ' bg-red-500'}"
			></div>
			<p class="font-medium">{$name}</p>
		</div>
	</div>
	<div class="flex flex-col">
		<p class="mb-1 text-xs uppercase text-muted-foreground">Elements found</p>
		<div class="flex items-center space-x-2">
			<div
				class="w-2 h-2 rounded-full {$name == 'Loading'
					? 'bg-gray-500'
					: $name == 'Running'
						? 'animate-pulse bg-green-500'
						: ' bg-red-500'}"
			></div>
			<p class="font-medium">{$elements_formatted}</p>
		</div>
	</div>
	<div class="flex flex-col">
		<p class="mb-1 text-xs uppercase text-muted-foreground">Resolved Recipes</p>
		<div class="flex items-center space-x-2">
			<div
				class="w-2 h-2 rounded-full {$name == 'Loading'
					? 'bg-gray-500'
					: $name == 'Running'
						? 'animate-pulse bg-green-500'
						: ' bg-red-500'}"
			></div>
			<p class="font-medium">{$resolved_formatted}</p>
		</div>
	</div>
	<div class="flex flex-col">
		<p class="mb-1 text-xs uppercase text-muted-foreground">Queued Recipes</p>
		<div class="flex items-center space-x-2">
			<div
				class="w-2 h-2 rounded-full {$name == 'Loading'
					? 'bg-gray-500'
					: $name == 'Running'
						? 'animate-pulse bg-green-500'
						: ' bg-red-500'}"
			></div>
			<p class="font-medium">{$queued_formatted}</p>
		</div>
	</div>
</div>

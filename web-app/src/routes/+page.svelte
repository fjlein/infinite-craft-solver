<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let data: PageData;

	export const status = writable<{
		resolved: number;
		queued: number;
		elements: number;
		name: string;
	}>({
		resolved: data.status.resolved,
		queued: data.status.queued,
		elements: data.status.elements,
		name: data.status.name
	});

	export function fetchStatus() {
		return new Promise(async (res) => {
			const s = await fetch('/api/status').then((x) => x.json());
			res(status.set(s));
		});
	}

	onMount(() => {
		const interval = setInterval(fetchStatus, 1);
	});
</script>

<div class="grid h-64 place-items-center">
	<div
		class="flex p-4 space-x-10 border rounded-md {$status.name == 'Running'
			? 'border-green-500 bg-green-50'
			: 'border-red-500 bg-red-50'}"
	>
		<div class="flex flex-col">
			<p class="mb-1 text-xs font-medium text-gray-400 uppercase">Current status</p>
			<div class="flex items-center space-x-2">
				<div
					class="w-2 h-2 rounded-full {$status.name == 'Running'
						? 'animate-pulse bg-green-500'
						: 'bg-red-500'}"
				></div>
				<p>{$status.name}</p>
			</div>
		</div>
		<div class="flex flex-col">
			<p class="mb-1 text-xs font-medium text-gray-400 uppercase">Resolved Recipes</p>
			<p>{$status.resolved}</p>
		</div>
		<div class="flex flex-col">
			<p class="mb-1 text-xs font-medium text-gray-400 uppercase">Queued Recipes</p>
			<p>{$status.queued}</p>
		</div>
		<div class="flex flex-col">
			<p class="mb-1 text-xs font-medium text-gray-400 uppercase">Elements found</p>
			<p>{$status.elements}</p>
		</div>
	</div>
</div>

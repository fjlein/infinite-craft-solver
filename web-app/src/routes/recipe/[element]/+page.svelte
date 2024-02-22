<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-row justify-between space-x-2 font-medium md:mt-10">
	<button class="px-2 py-1 border rounded-md shadow-sm shrink-0" on:click={() => goto('/')}>
		⬅️ Go Back
	</button>
	<button
		class="px-2 py-1 border rounded-md shadow-sm shrink-0"
		on:click={() => goto('/')}
		disabled
	>
		Random ➡️
	</button>
</div>

<div class="flex flex-col items-center mt-5 space-y-3">
	<h1 class="text-4xl font-semibold">How to craft</h1>

	<button
		class="px-2 py-1 border rounded-md shadow-sm shrink-0"
		on:click={() => goto('/')}
		disabled
	>
		{data.element.emoji}
		{data.element.name}
	</button>
</div>

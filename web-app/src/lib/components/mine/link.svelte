<script lang="ts">
	import { goto } from '$app/navigation';
	import { scale } from 'svelte/transition';

	export let fadeIn: boolean = false;
	export let href: string;
	export let reload: boolean = false;
	export let firstNavigateTo: string | null = null;
</script>

<a
	{href}
	data-sveltekit-reload={reload}
	in:scale={{ delay: 0, duration: fadeIn ? 300 : 0 }}
	on:click={() => {
		if (firstNavigateTo) {
			goto(`?q=${firstNavigateTo}`);
		}
	}}
	class="px-2 py-1 border rounded-md shadow-sm shrink-0 bg-white hover:bg-slate-50 active:shadow-none"
>
	<slot />
</a>

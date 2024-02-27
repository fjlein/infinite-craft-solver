<script lang="ts">
	import { scale } from 'svelte/transition';

	export let fadeIn: boolean = false;
	export let href: string;
</script>

<a
	{href}
	data-sveltekit-reload
	in:scale={{ delay: 0, duration: fadeIn ? 300 : 0 }}
	class="px-2 py-1 border rounded-md shadow-sm shrink-0 bg-white hover:bg-slate-50 active:shadow-none"
>
	<slot />
</a>

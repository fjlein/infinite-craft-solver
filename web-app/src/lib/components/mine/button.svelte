<script type="ts">
	import { scale } from 'svelte/transition';

	export let fadeIn = false;
</script>

<button
	on:click
	in:scale={{ delay: 0, duration: fadeIn ? 300 : 0 }}
	class="px-2 py-1 border rounded-md shadow-sm shrink-0 bg-white hover:bg-slate-50 active:shadow-none"
>
	<slot />
</button>

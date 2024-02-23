<script lang="ts">
	import '../app.css';
	import StatusBar from './status-bar.svelte';
</script>

<div class="max-w-2xl min-h-[90vh] px-4 py-10 mx-auto flex flex-col justify-between">
	<div>
		<div class="mb-1 md:mt-10">
			<h1 class="text-4xl font-semibold">Infinite Craft Solver</h1>
		</div>

		<p class="mb-5 text-muted-foreground">Find the shortest recipe in Infinite Craft.</p>
		<slot />
	</div>

	<div class="mt-10 justify-self-end">
		<StatusBar></StatusBar>
	</div>
</div>

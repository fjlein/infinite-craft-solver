<script lang="ts">
	import '../app.css';
	import StatusBar from './status-bar.svelte';
</script>

<div class="max-w-2xl min-h-[90vh] px-4 py-10 mx-auto flex flex-col justify-between">
	<div>
		<slot />
	</div>

	<div class="mt-10 justify-self-end">
		<StatusBar></StatusBar>
	</div>
</div>

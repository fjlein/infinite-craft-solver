<script lang="ts">
	import '../app.css';
	import StatusBar from './status-bar.svelte';
</script>

<div
	class="-z-10 fixed h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
></div>

<div class="max-w-2xl px-4 mx-auto">
	<div class="flex flex-col justify-between min-h-[100vh]">
		<div class="mt-10">
			<div class="mb-1 md:mt-10">
				<h1 class="text-4xl font-semibold">Infinite Craft Solver</h1>
			</div>

			<p class="mb-5 text-muted-foreground">
				Find the shortest recipe in <a
					href="https://neal.fun/infinite-craft"
					class="underline underline-offset-4">Infinite Craft</a
				>.
			</p>
			<slot />
		</div>

		<div class="mb-20 mt-10">
			<StatusBar></StatusBar>
		</div>
	</div>

	<div class="h-[10vh]">
		<p class="text-muted-foreground text-center">
			Made with ❤️ by <a href="https://github.com/fjlein" class="underline underline-offset-4"
				>fjlein</a
			>
		</p>
	</div>
</div>

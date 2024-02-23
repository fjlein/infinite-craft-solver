<script lang="ts">
	import { goto } from '$app/navigation';

	// import type { PageData } from './$types';
	import * as Accordion from '$lib/components/ui/accordion';

	// export let data: PageData;
</script>

<div class="flex flex-row justify-between space-x-2 font-medium">
	<button class="px-2 py-1 border rounded-md shadow-sm shrink-0" on:click={() => goto('/')}>
		⬅️ Search
	</button>
	<button
		class="px-2 py-1 border rounded-md shadow-sm shrink-0"
		on:click={() => alert('Coming soon!')}
	>
		🔀
	</button>
</div>

<Accordion.Root class="w-full mt-5">
	<Accordion.Item value="item-1">
		<Accordion.Trigger>Is it accessible?</Accordion.Trigger>
		<Accordion.Content>Yes. It adheres to the WAI-ARIA design pattern.</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="item-2">
		<Accordion.Trigger>Is it styled?</Accordion.Trigger>
		<Accordion.Content>
			Yes. It comes with default styles that matches the other components' aesthetic.
		</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="item-3">
		<Accordion.Trigger>Is it animated?</Accordion.Trigger>
		<Accordion.Content>
			Yes. It's animated by default, but you can disable it if you prefer.
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>

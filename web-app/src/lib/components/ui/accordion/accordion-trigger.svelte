<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import ChevronDown from 'svelte-radix/ChevronDown.svelte';
	import { cn } from '$lib/utils';

	type $$Props = AccordionPrimitive.TriggerProps;
	type $$Events = AccordionPrimitive.TriggerEvents;

	let className: $$Props['class'] = undefined;
	export let level: AccordionPrimitive.HeaderProps['level'] = 3;
	export { className as class };
</script>

<AccordionPrimitive.Header {level} class="flex">
	<AccordionPrimitive.Trigger
		class={cn(
			'flex flex-1 items-center justify-between py-4 font-medium transition-all text-base [&[data-state=open]>div]:rotate-180',
			className
		)}
		{...$$restProps}
		on:click
	>
		<slot />
		<div class="transition-transform duration-200 mx-2">⬇️</div>
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>

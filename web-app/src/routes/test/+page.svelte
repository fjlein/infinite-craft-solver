<script lang="ts">
	import type { PageData } from './$types';
	import Force from './force.svelte';

	const numberOfDots = 100;
	let dots = new Array(numberOfDots).fill(0).map((_) => ({}));

	import { forceX, forceY, forceCollide, forceRadial } from 'd3-force';
	let centerPosition = [200, 200];
	let useForceCollide = true;
	let useForceRadial = true;
	$: activeForceX = forceX().x(centerPosition[0]);
	$: activeForceY = forceY().y(centerPosition[1]);
	$: activeForceCollide = forceCollide().radius(10).iterations(3);
	$: activeForceRadial = forceRadial(150, centerPosition[0], centerPosition[1]);
	$: forces = [
		['x', activeForceX],
		['y', activeForceY],
		useForceCollide && ['collide', activeForceCollide],
		useForceRadial && ['radial', activeForceRadial]
	].filter((d) => d);

	export let data: PageData;
</script>

<Force {forces} {dots} />

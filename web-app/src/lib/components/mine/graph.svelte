<script>
	import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
	import { onMount } from 'svelte';

	let width = 400;
	let height = 600;
	const margin = { top: 0, right: 0, left: 0, bottom: 0 };

	$: innerWidth = width - margin.left - margin.right;
	let innerHeight = height - margin.top - margin.bottom;

	export let nodes = [];
	export let links = [];

	let simulation = forceSimulation();

	function ticked() {
		nodes = nodes;
		links = links;
	}

	$: {
		simulation
			.nodes(nodes)
			.force('repulsion', forceManyBody().strength(-200))
			.force(
				'link',
				forceLink(links)
					.id((d) => d.id)
					.distance(100)
			)
			// .force('charge', forceManyBody().strength(-500))
			.force('center', forceCenter(width / 2, height / 2))
			// .force(
			// 	'collide',
			// 	forceCollide((d) => 70)
			// )
			.on('tick', ticked);
	}

	export function addLink(from, to) {
		links.push({ source: from, target: to });
		simulation
			.force(
				'link',
				forceLink(links).id((d) => d.id)
			)
			.alpha(0.2);
	}

	export function addNode(name) {
		nodes.push({ id: name, x: width / 2, y: height / 2 });
		simulation.nodes(nodes).alpha(0.2);
	}
</script>

<div bind:clientWidth={width} bind:clientHeight={height}>
	<svg {width} {height}>
		{#each links as link}
			<line
				x1={link.source.x}
				y1={link.source.y}
				x2={link.target.x}
				y2={link.target.y}
				stroke={'#000000'}
			>
			</line>
		{/each}

		{#each nodes as point}
			<circle cx={point.x} cy={point.y} r="8" fill={'#ff0000'}>
				<title>{point.id}</title>
			</circle>
			<text x={point.x - 5} y={point.y + 5} class="text-white">{point.id}</text>
		{/each}
	</svg>
</div>

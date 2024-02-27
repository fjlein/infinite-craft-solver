<script>
	import _ from 'lodash';
	import { forceX, select, zoom } from 'd3';
	import {
		forceSimulation,
		forceLink,
		forceManyBody,
		forceCenter,
		forceCollide,
		forceY
	} from 'd3-force';

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
			// .force('repulsion', forceManyBody().strength(-100))
			.force(
				'link',
				forceLink(links)
					.id((d) => d.id)
					.distance(70)
					.strength(10)
			)
			.force('charge', forceManyBody().strength(-300))
			// .force(
			// 	'y',
			// 	forceY()
			// 		.y((d) => {
			// 			return d.level * 100 + 50;
			// 		})
			// 		.strength(3)
			// )
			.force('center', forceCenter(width / 2, height / 2))
			.force(
				'x',
				forceX()
					.x((d) => width / 2)
					.strength(0.1)
			)
			.force('collide', forceCollide(70).strength(0.3))
			.on('tick', ticked);
	}

	export function addLink(from, to) {
		links.push({ source: from, target: to, x: _.random(width), y: _.random(height) });
		simulation.force(
			'link',
			forceLink(links).id((d) => d.id)
		);
	}

	export function addNode(name, level, text) {
		nodes.push({ id: name, text: text });
		simulation.nodes(nodes).alpha(0.2).restart();
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
				stroke={'#bfbfbf'}
			>
			</line>
		{/each}

		{#each nodes as point}
			<g>
				<!-- <rect
					x={point.x - 50}
					y={point.y - 15}
					stroke={'black'}
					fill="#ffffff"
					height="30"
					width="100"
				></rect> -->
				<text x={point.x - 5} y={point.y + 5} text-anchor={'middle'}>{point.text}</text>
			</g>
		{/each}
	</svg>
</div>

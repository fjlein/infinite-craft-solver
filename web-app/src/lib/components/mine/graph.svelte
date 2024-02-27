<script>
	import _ from 'lodash';
	import { count, forceX, select, zoom } from 'd3';
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
			)
			.force('charge', forceManyBody().strength(-100))
			// .force(
			// 	'y',
			// 	forceY()
			// 		.y((d) => {
			// 			return d.level * 100 + 50;
			// 		})
			// 		.strength(3)
			// )
			.force('center', forceCenter(width / 2, height / 2).strength(0.05))
			// .force(
			// 	'x',
			// 	forceX(width / 2).strength((d) => 0.5 - d.level * 0.05)
			// )
			// .force(
			// 	'y',
			// 	forceY(height / 2).strength((d) => 0.5 - d.level * 0.1)
			// )
			.force('collide', forceCollide(70).strength(0.3))
			.on('tick', ticked);
	}

	export function addLink(from, to) {
		links.push({ source: from, target: to });
		simulation.force(
			'link',
			forceLink(links).id((d) => d.id)
		);
	}

	export function addNode(name, level, text, parent) {
		const parent_node = _.find(nodes, (n) => n.id == parent) ?? { x: width / 2, y: height / 2 };
		const new_x = parent_node.x > width / 2 ? parent_node.x + 100 : parent_node.x - 100;
		const new_y = parent_node.y > height / 2 ? parent_node.y + 100 : parent_node.y - 100;
		nodes.push({ id: name, text: text, level: level, x: new_x, y: new_y });
		simulation.nodes(nodes).alpha(0.2).restart();
	}
</script>

<div bind:clientWidth={width} bind:clientHeight={height}>
	<svg {width} {height}>
		<defs>
			<marker
				id="arrow"
				viewBox="0 0 10 10"
				refX="5"
				refY="5"
				markerWidth="8"
				markerHeight="8"
				orient="auto-start-reverse"
				fill={'#cccccc'}
			>
				<path d="M 0 0 L 10 5 L 0 10 z" />
			</marker>
		</defs>
		{#each links as link}
			<line
				x1={link.source.x}
				y1={link.source.y}
				x2={(link.target.x + link.source.x) / 2}
				y2={(link.target.y + link.source.y) / 2}
				stroke={'#dddddd'}
			></line>
			<line
				x2={link.target.x}
				y2={link.target.y}
				x1={(link.target.x + link.source.x) / 2}
				y1={(link.target.y + link.source.y) / 2}
				stroke={'#dddddd'}
				marker-start={`url(#arrow)`}
			></line>
			<!-- <line
			x1={link.source.x}
			y1={link.source.y}
			x2={link.target.x}
			y2={link.target.y}
			stroke={'#dddddd'}
		>
			</line> -->
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

<script>
	import _ from 'lodash';
	import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
	import { onMount } from 'svelte';
	import { forceX, forceY, select, selectAll, zoom } from 'd3';

	let width = 400;
	let height = 500;

	export let nodes = [];
	export let links = [];

	let simulation;
	let z;

	function ticked() {
		nodes = nodes;
		links = links;
		if (nodes.length > 0) {
			nodes[0].x = width / 2;
			nodes[0].y = height / 2;

			z.scaleExtent([1, 1]).translateExtent([
				[_.minBy(nodes, (n) => n.x).x - 50, _.minBy(nodes, (n) => n.y).y - 50],
				[_.maxBy(nodes, (n) => n.x).x + 50, _.maxBy(nodes, (n) => n.y).y + 50]
			]);
		}
	}

	function zoomed(e) {
		selectAll('g').attr('transform', e.transform);
		selectAll('line').attr('transform', e.transform);
	}

	onMount(() => {
		z = zoom().on('zoom', zoomed);
		select('svg rect').call(z);
		simulation = forceSimulation(nodes)
			.force(
				'link',
				forceLink(links)
					.id((d) => d.id)
					.distance(80)
					.strength(11)
			)
			.force('charge', forceManyBody().strength(-200))
			.force('collide', forceCollide(80).strength(0.7))
			.on('tick', ticked);
	});

	export function addLink(from, to) {
		links.push({ source: from, target: to });
		simulation.force(
			'link',
			forceLink(links).id((d) => d.id)
		);
	}

	export function addNode(name, level, text, parent) {
		const parent_node = _.find(nodes, (n) => n.id == parent) ?? { x: width / 2, y: height / 2 };
		const vector = [parent_node.x - width / 2, parent_node.y - height / 2];
		const vector_length = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
		const vector_norm = [vector[0] * (1 / vector_length), vector[1] * (1 / vector_length)];
		const new_x = parent_node.x + vector_norm[0] * 100;
		const new_y = parent_node.y + vector_norm[1] * 100;
		nodes.push({ id: name, text: text, level: level, x: new_x, y: new_y });
		simulation.nodes(nodes).alpha(0.2).restart();
	}
</script>

<div bind:clientWidth={width} bind:clientHeight={height} class="cursor-grab">
	<svg {width} {height}>
		<defs>
			<marker
				id="arrow"
				viewBox="0 0 10 10"
				refX="5"
				refY="5"
				markerWidth="10"
				markerHeight="10"
				orient="auto-start-reverse"
				fill={'#cccccc'}
			>
				<path d="M 0 0 L 10 5 L 0 10 z" />
			</marker>
		</defs>
		<rect {width} {height} fill={'none'} pointer-events={'all'}></rect>
		{#each links as link}
			<line
				x1={link.source.x}
				y1={link.source.y}
				x2={(link.target.x + link.source.x) / 2}
				y2={(link.target.y + link.source.y) / 2}
				stroke={'#dddddd'}
				stroke-dasharray={'3 3'}
			></line>
			<line
				x2={link.target.x}
				y2={link.target.y}
				x1={(link.target.x + link.source.x) / 2}
				y1={(link.target.y + link.source.y) / 2}
				stroke={'#dddddd'}
				marker-start={`url(#arrow)`}
			></line>
		{/each}

		{#each nodes as point, i}
			<g>
				<text x={point.x - 5} y={point.y + 5} text-anchor={'middle'} pointer-events={'none'}
					>{point.text}</text
				>
			</g>
		{/each}
	</svg>
</div>

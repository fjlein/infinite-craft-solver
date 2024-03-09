<!-- This File is a crazy mess.
I'm just happy this code somehow works.
The typing is bad, I know.
I'm sorry. -->

<script lang="ts">
	import _ from 'lodash';
	import {
		forceSimulation,
		forceLink,
		forceManyBody,
		forceCenter,
		forceCollide,
		type Simulation,
		type SimulationNodeDatum,
		type SimulationLinkDatum
	} from 'd3-force';
	import { onMount } from 'svelte';
	import { forceX, forceY, select, selectAll, zoom } from 'd3';

	let width = 400;
	let height = 100;

	interface ND extends SimulationNodeDatum {
		source: ND | null;
		target: ND | null;
		id: string;
		text: string;
	}

	interface LD extends SimulationLinkDatum<ND> {
		source: ND;
		target: ND;
	}

	export let nodes: ND[] = [];
	export let links: LD[] = [];

	let simulation: Simulation<ND, LD>;
	let z;

	function ticked() {
		nodes = nodes;
		links = links;
		if (nodes.length > 0) {
			nodes[0].x = width / 2;
			nodes[0].y = height / 2;

			nodes.forEach((node) => {
				if (node.id == 'tmp') {
					node.x = (node.source!.x! + node.target!.x!) / 2;
					node.y = (node.source!.y! + node.target!.y!) / 2;
				}
			});
		}
	}

	function ending(e) {
		z.scaleExtent([1, 1]).translateExtent([
			[
				Math.min(0, _.minBy(nodes, (n) => n.x).x - 50),
				Math.min(0, _.minBy(nodes, (n) => n.y).y - 50)
			],
			[
				Math.max(width, _.maxBy(nodes, (n) => n.x).x + 50),
				Math.max(height, _.maxBy(nodes, (n) => n.y).y + 50)
			]
		]);
	}

	function zoomed(e) {
		selectAll('g').attr('transform', e.transform);
		selectAll('line').attr('transform', e.transform);
	}

	onMount(() => {
		z = zoom().scaleExtent([1, 1]).on('zoom', zoomed);
		select('svg rect').call(z);
		simulation = forceSimulation(nodes)
			.force(
				'link',
				forceLink(links)
					.id((d) => d.id)
					.distance(40)
				// .strength(1)
			)
			.force('charge', forceManyBody().strength(-5))
			.force('collide', forceCollide(40).strength(0.7))
			// .alpha(0.5)
			.on('tick', ticked)
			.on('end', ending);
	});

	export function addLink(from: string, to: string) {
		links.push({ source: from, target: to });
		simulation.force(
			'link',
			forceLink(links).id((d) => d.id)
		);
		const last = links[links.length - 1];
		const source = last.source as ND;
		const target = last.target as ND;
		nodes.push({
			x: (source.x! + target.x!) / 2,
			y: (source.y! + target.y!) / 2,
			id: 'tmp',
			source: source,
			target: target,
			text: ''
		});
	}

	export function addNode(id: string, text: string, parent: string) {
		const parent_node = _.find(nodes, (n) => n.id == parent) ?? { x: width / 2, y: height / 2 };
		const vector = [parent_node.x! - width / 2, parent_node.y! - height / 2];
		const vector_length = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
		const vector_norm = [vector[0] * (1 / vector_length), vector[1] * (1 / vector_length)];
		let new_x = parent_node.x! + vector_norm[0] * 80;
		let new_y = parent_node.y! + vector_norm[1] * 80;

		if (nodes.length == 1) {
			new_x = width / 2;
			new_y = height / 2 + 100;
		} else if (nodes.length == 2) {
			new_x = width / 2;
			new_y = height / 2 - 100;
		} else {
		}

		nodes.push({ id: id, text: text, x: new_x, y: new_y, source: null, target: null });
		simulation.nodes(nodes).alpha(0.01).restart();
	}
</script>

<div class="mt-5 border shadow-sm rounded-md grow flex-col flex">
	<div bind:clientWidth={width} bind:clientHeight={height} class="grow">
		<svg {height} {width}>
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
					<text
						x={point.x - 5}
						y={point.y + 5}
						text-anchor={'middle'}
						pointer-events={'none'}
						font-weight={i == 0 ? 'bold' : 'normal'}
						class="select-none">{point.text}</text
					>
				</g>
			{/each}
		</svg>
	</div>
</div>

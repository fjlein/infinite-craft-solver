import clientPromise from '$lib/mongodb-client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const dbConnection = await clientPromise;
	const db = dbConnection.db('infinite-craft');
	const collection = db.collection('recipes');
	const recipe = await collection.findOne(
		{ 'result.name': params.element },
		{ projection: { _id: 0, 'result.explored': 0 }, sort: ['result.explored', 'asc'] }
	);

	if (!recipe) {
		error(404, {
			message: 'Not found'
		});
	}

	// const tree = await getTree(element.result.name);

	// async function getTree(element: string): Promise<unknown> {
	// 	const recipe = await collection.findOne(
	// 		{ 'result.name': element },
	// 		{ sort: ['result.explored', 'asc'] }
	// 	);

	// 	if (!recipe) {
	// 		error(404, {
	// 			message: 'Not found'
	// 		});
	// 	}

	// 	if (['Fire', 'Water', 'Earth', 'Wind'].includes(recipe.result.name)) {
	// 		return { name: recipe.result.name, emoji: recipe.result.emoji };
	// 	} else {
	// 		const first = recipe!.first;
	// 		const second = recipe!.second;

	// 		return {
	// 			name: recipe.result.name,
	// 			emoji: recipe.result.emoji,
	// 			first: await getTree(first),
	// 			second: await getTree(second)
	// 		};
	// 	}
	// }

	return json(recipe);
};

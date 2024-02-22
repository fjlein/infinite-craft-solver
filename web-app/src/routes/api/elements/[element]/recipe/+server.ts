import clientPromise from '$lib/mongodb-client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const dbConnection = await clientPromise;
	const db = dbConnection.db('infinite-craft');
	const collection = db.collection('recipes');
	const element = await collection.findOne({ 'result.name': params.element });

	if (!element) {
		error(404, {
			message: 'Not found'
		});
	}

	return json({
		element: {
			name: element.result.name,
			emoji: element.result.emoji
		}
	});
};

// function recursiveSearch(recipe: any, collection: any) {

// 	if (element in ['Fire', 'Water', 'Earth', 'Wind']) {
// 		return element;
// 	}
// }

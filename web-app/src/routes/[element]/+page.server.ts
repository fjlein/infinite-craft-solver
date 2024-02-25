import clientPromise from '$lib/mongodb-client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const dbConnection = await clientPromise;
	const db = dbConnection.db('infinite-craft');
	const collection = db.collection('recipes');
	const recipe = await collection.findOne({ 'result.name': params.element });

	if (!recipe || ['Nothing', 'Fire', 'Water', 'Wind', 'Earth'].includes(recipe.result.name)) {
		error(404, {
			message: 'Not found'
		});
	}

	return {
		element: recipe.result
	};
}) satisfies PageServerLoad;

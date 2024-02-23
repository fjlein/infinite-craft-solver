import clientPromise from '$lib/mongodb-client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const dbConnection = await clientPromise;
	const db = dbConnection.db('infinite-craft');
	const collection = db.collection('recipes');
	const element = await collection.findOne({ 'result.name': params.element });

	if (!element) {
		error(404, {
			message: 'Not found'
		});
	}

	return {
		element: {
			name: element.result.name,
			emoji: element.result.emoji
		}
	};
}) satisfies PageServerLoad;

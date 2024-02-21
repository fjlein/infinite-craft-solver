import type { PageServerLoad } from './$types';
import clientPromise from '$lib/mongodb-client';

export const load = (async () => {
	const dbConnection = await clientPromise;
	const db = dbConnection.db('infinite-craft');
	const collection = db.collection('recipes');
	const result = await collection.countDocuments({ result: { $ne: null } });
	return {
		result
	};
}) satisfies PageServerLoad;

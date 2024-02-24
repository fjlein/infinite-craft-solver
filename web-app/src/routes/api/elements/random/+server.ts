import clientPromise from '$lib/mongodb-client';
import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const dbConnection = await clientPromise;
	const db = dbConnection.db('infinite-craft');
	const collection = db.collection('recipes');
	const cursor = collection.aggregate([
		{
			$group: {
				_id: '$result.name'
			}
		},
		{
			$match: {
				_id: { $nin: ['Fire', 'Water', 'Earth', 'Wind'] }
			}
		},
		{
			$sample: { size: 1 }
		},
		{
			$project: {
				name: '$_id',
				_id: false
			}
		}
	]);

	const element = (await cursor.toArray())[0];

	await cursor.close();

	console.log(element);

	return json(element);
};

import clientPromise from '$lib/mongodb-client';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DateTime } from 'luxon';

export const GET: RequestHandler = async () => {
	const dbConnection = await clientPromise;
	const db = dbConnection.db('infinite-craft');
	const collection = db.collection('recipes');
	const resolved = await collection.countDocuments({ result: { $ne: null } });
	const queued = await collection.countDocuments({ result: null });
	const last_resolve = await collection.findOne(
		{ result: { $ne: null } },
		{ sort: { 'result.explored': -1 } }
	);

	let name = 'Stopped';

	if (last_resolve) {
		const now = DateTime.now();
		const last_resolve_time = DateTime.fromJSDate(last_resolve.result.explored);

		const diff = now.diff(last_resolve_time);

		if (diff.toMillis() > 1000 * 60 * 10) {
			name = 'Stopped';
		} else if (diff.toMillis() > 1000 * 10) {
			name = 'Waiting';
		} else {
			name = 'Running';
		}
	}

	const elements = (await collection.distinct('result.name')).length;

	return json({
		resolved,
		queued,
		elements,
		name
	});
};

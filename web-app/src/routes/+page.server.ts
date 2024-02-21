import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	const res = await fetch('/api/status');
	const status = await res.json();
	return { status };
}) satisfies PageServerLoad;

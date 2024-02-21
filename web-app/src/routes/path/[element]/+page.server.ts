import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	return {
		element: params.element
	};
}) satisfies PageServerLoad;

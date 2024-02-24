import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	const res = await fetch('api/elements/random');

	const element = await res.json();

	console.log(element);

	throw redirect(307, `/${element.name}`);
}) satisfies PageServerLoad;

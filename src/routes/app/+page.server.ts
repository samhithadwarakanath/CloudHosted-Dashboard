import { redirect, type RequestEvent } from '@sveltejs/kit';

export const load = async ({ locals }: RequestEvent) => {
	// Check if user is authenticated
	if (!locals.user) {
		throw redirect(303, '/?error=unauthorized');
	}

	// Return user data to the page
	return {
		user: locals.user
	};
};
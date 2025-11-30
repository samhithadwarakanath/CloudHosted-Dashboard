import { redirect } from '@sveltejs/kit';
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from '$env/static/private';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

export const GET = async () => {
	const params = new URLSearchParams({
		client_id: GOOGLE_CLIENT_ID,
		redirect_uri: GOOGLE_REDIRECT_URI,
		response_type: 'code',
		scope: 'openid email profile',
		access_type: 'offline',
		prompt: 'consent'
	});

	throw redirect(302, `${GOOGLE_AUTH_URL}?${params.toString()}`);
};

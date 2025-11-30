import { redirect } from '@sveltejs/kit';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '$env/static/private';
import { OAuth2Client } from 'google-auth-library';
import { upsertUser } from '$lib/db/User.db.ts';

export async function GET({ url, cookies }) {
	const code = url.searchParams.get('code');

	if (!code) {
		throw redirect(303, '/?error=Missing%20authorization%20code');
	}

	try {
		const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
		const response = await client.getToken(code);
		client.setCredentials(response.tokens);

		const ticket = await client.verifyIdToken({
			idToken: client.credentials.id_token!,
			audience: GOOGLE_CLIENT_ID
		});
		const payload = ticket.getPayload();

		if (!payload) throw redirect(303, '/?error=No%20payload%20returned');

		await upsertUser({
			googleId: payload.sub,
			name: payload.name ?? '',
			email: payload.email ?? '',
			picture: payload.picture ?? '',
			idToken: client.credentials.id_token!,
			accessToken: client.credentials.access_token!,
			expiryDate: client.credentials.expiry_date!,
			refreshToken: client.credentials.refresh_token ?? ''
		});

		cookies.set('session', payload.sub, {
			httpOnly: true,
			path: '/',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7
		});

		cookies.set('google_access_token', client.credentials.access_token!, {
			httpOnly: true,
			path: '/',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 3600
		});

		if (client.credentials.refresh_token) {
			cookies.set('google_refresh_token', client.credentials.refresh_token, {
				httpOnly: true,
				path: '/',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 30
			});
		}

		// ✅ This throws a redirect — but we’ll let it pass cleanly
		throw redirect(303, '/app');
	} catch (error) {
		if (error instanceof redirect || error instanceof Response) {
			throw error;
		}

		throw redirect(303, '/app');
	}
}

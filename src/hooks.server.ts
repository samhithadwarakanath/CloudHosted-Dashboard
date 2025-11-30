import { sequence } from '@sveltejs/kit/hooks';
import { OAuth2Client } from 'google-auth-library';
import { redirect, type Handle } from '@sveltejs/kit';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '$env/static/private';

// Implement these yourself based on your DB and DB interface
import { getUserById, updateUserTokens } from '$lib/db/User.db';

/**
 * This function is based on client.isTokenExpiring() from
 * google library but for some reason, the function is private
 * You can find the function code here
 * https://github.com/googleapis/google-auth-library-nodejs/blob/12f2c87266de0a3ccd33e6b4993cab3537f9a242/src/auth/oauth2client.ts#L1548
*/
function isTokenExpiring({
	eagerRefreshThresholdMillis = 2000,
	expiry_date
}: {
	eagerRefreshThresholdMillis?: number;
	expiry_date: number;
}) {
	const now = new Date().getTime();
	return expiry_date ? now >= expiry_date - eagerRefreshThresholdMillis : false;
}

const authentication: Handle = async ({ event, resolve }) => {
	const googleSub = event.cookies.get('session');
	if (googleSub) {
		const user = await getUserById(googleSub);

		if (user) {
			event.locals.user = user;

			if (isTokenExpiring({ expiry_date: user.expiryDate })) {
				const client = new OAuth2Client(
					GOOGLE_CLIENT_ID,
					GOOGLE_CLIENT_SECRET,
					GOOGLE_REDIRECT_URI
				);
				client.setCredentials({
					access_token: user.accessToken,
					refresh_token: user.refreshToken,
					expiry_date: user.expiryDate
				});
				const { credentials } = await client.refreshAccessToken();
				await updateUserTokens({
					googleId: user.googleId,
					accessToken: credentials.access_token!,
					expiryDate: credentials.expiry_date!,
					refreshToken: credentials.refresh_token || user.refreshToken
				});
				user.accessToken = credentials.access_token!;
				user.refreshToken = credentials.refresh_token
					? credentials.refresh_token
					: user.refreshToken;
				user.expiryDate = credentials.expiry_date!;
			}
		} else {
			event.cookies.delete('session', {
				path: '/'
			});
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};

const authorization: Handle = async ({ event, resolve }) => {
	// Optional: If you wish to have protected routes.
	const googleSub = event.cookies.get('session');
	console.log('Protecting route:', googleSub, event.url.pathname);
	const protectedRoutes = ['/app'];
	
	if (protectedRoutes.some((route) => event.url.pathname.startsWith(route))) {
		if (!googleSub) {
			throw redirect(303, '/?error=unauthorized');
		}
	}

	return resolve(event);
};

export const handle = sequence(authentication, authorization);
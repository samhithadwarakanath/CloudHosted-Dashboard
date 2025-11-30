// src/lib/tests/backend/auth.test.js
import { describe, it, expect } from 'vitest';

// mock SvelteKit private env before importing the route
vi.mock('$env/static/private', () => ({
	GOOGLE_CLIENT_ID: 'test-client-id',
	GOOGLE_REDIRECT_URI: 'http://localhost/callback'
}));

import { GET } from '../../../routes/auth/login/google/+server';

describe('Auth Login Route (/auth/login/google)', () => {
	it('throws a 302 redirect to Google OAuth', async () => {
		try {
			// call route handler
			await GET({ url: new URL('http://localhost/auth/login/google') });
			throw new Error('Expected redirect to be thrown');
		} catch (e) {
			const err = /** @type {any} */ (e);
			expect(err.status).toBe(302);
			expect(err.location).toContain(
				'https://accounts.google.com/o/oauth2/v2/auth'
			);
		}
	});

	it('includes correct client_id and redirect_uri in redirect URL', async () => {
		try {
			await GET({ url: new URL('http://localhost/auth/login/google') });
			throw new Error('Expected redirect to be thrown');
		} catch (e) {
			const err = /** @type {any} */ (e);
			const url = new URL(err.location);
			expect(url.searchParams.get('client_id')).toBe('test-client-id');
			expect(url.searchParams.get('redirect_uri')).toBe('http://localhost/callback');
			expect(url.searchParams.get('scope')).toContain('openid');
		}
	});
});

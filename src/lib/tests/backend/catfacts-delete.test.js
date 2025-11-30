// src/lib/tests/backend/catfacts-delete.test.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import { DELETE } from '../../../routes/api/cats/+server';

const originalFetch = global.fetch;

afterEach(() => {
	global.fetch = originalFetch;
});

describe('DELETE /api/cats Svelte endpoint', () => {
	it('returns 400 when fact query param is missing', async () => {
		const url = new URL('http://localhost/api/cats'); // no ?fact
		const res = await DELETE({ url });
		expect(res.status).toBe(400);
		const body = await res.json();
		expect(body.error).toBe('Missing fact');
	});

	it('deletes fact successfully when backend returns ok', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ success: true })
		});

		const url = new URL('http://localhost/api/cats?fact=Cat%20is%20cute');
		const res = await DELETE({ url });
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.success).toBe(true);
	});

	it('returns 500 when backend delete fails', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
			json: async () => ({ error: 'backend failed' })
		});

		const url = new URL('http://localhost/api/cats?fact=Bad%20fact');
		const res = await DELETE({ url });
		expect(res.status).toBe(500);
		const body = await res.json();
		expect(body.error).toBe('Failed to delete fact');
	});
});

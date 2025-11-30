// src/lib/tests/backend/catfacts-get.test.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import { GET } from '../../../routes/api/cats/+server';

const originalFetch = global.fetch;

afterEach(() => {
	global.fetch = originalFetch;
});

describe('GET /api/cats Svelte endpoint', () => {
	it('returns array of cat facts when backend succeeds', async () => {
		const fakeFacts = [{ id: 1, fact: 'Cats sleep 16 hours a day' }];

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => fakeFacts
		});

		const res = await GET();
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(Array.isArray(body)).toBe(true);
		expect(body).toEqual(fakeFacts);
	});

	it('sets Content-Type to application/json', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => []
		});

		const res = await GET();
		expect(res.headers.get('Content-Type')).toMatch(/application\/json/);
	});

	it('returns 500 when backend responds with non-ok status', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
			json: async () => ({ error: 'backend broke' })
		});

		const res = await GET();
		expect(res.status).toBe(500);
		const body = await res.json();
		expect(body.error).toBe('Failed to fetch cats');
	});

	it('returns 500 when backend fetch throws', async () => {
		global.fetch = vi.fn().mockRejectedValue(new Error('network down'));

		const res = await GET();
		expect(res.status).toBe(500);
		const body = await res.json();
		expect(body.error).toBe('Failed to fetch cats');
	});
});

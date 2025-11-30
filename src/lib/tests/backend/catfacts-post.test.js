// src/lib/tests/backend/catfacts-post.test.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import { POST } from '../../../routes/api/cats/+server';

const originalFetch = global.fetch;

afterEach(() => {
	global.fetch = originalFetch;
});

describe('POST /api/cats Svelte endpoint', () => {
	it('forwards new fact to backend and returns its response', async () => {
		const newFact = { fact: 'Cats sleep 16 hours a day' };

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ id: 1, ...newFact })
		});

		const req = new Request('http://localhost/api/cats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newFact)
		});

		const res = await POST({ request: req });
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.fact).toBe(newFact.fact);
	});

	it('returns 500 if backend throws', async () => {
		const newFact = { fact: 'Cats purr to self-heal' };

		global.fetch = vi.fn().mockRejectedValue(new Error('network down'));

		const req = new Request('http://localhost/api/cats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newFact)
		});

		const res = await POST({ request: req });
		expect(res.status).toBe(500);
		const body = await res.json();
		expect(body.error).toBe('Failed to post fact');
	});
});

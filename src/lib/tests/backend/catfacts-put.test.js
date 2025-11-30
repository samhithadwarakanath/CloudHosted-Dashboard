// src/lib/tests/backend/catfacts-put.test.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import { PUT } from '../../../routes/api/cats/[id]/+server';

const originalFetch = global.fetch;

afterEach(() => {
	global.fetch = originalFetch;
});

describe('PUT /api/cats/[id] Svelte endpoint', () => {
	it('updates a fact successfully', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ id: '1', fact: 'Updated cat fact!' })
		});

		const req = new Request('http://localhost/api/cats/1', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ fact: 'Updated cat fact!' })
		});

		const res = await PUT({ params: { id: '1' }, request: req });
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.fact).toBe('Updated cat fact!');
	});

	it('returns 400 when body is missing fact', async () => {
		const req = new Request('http://localhost/api/cats/1', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({})
		});

		const res = await PUT({ params: { id: '1' }, request: req });
		expect(res.status).toBe(400);
		const body = await res.json();
		expect(body.error).toBe('Invalid fact');
	});

	it('returns 404 when backend responds with not found', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 404,
			json: async () => ({ error: 'not found' })
		});

		const req = new Request('http://localhost/api/cats/999', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ fact: 'does not matter' })
		});

		const res = await PUT({ params: { id: '999' }, request: req });
		expect(res.status).toBe(404);
		const body = await res.json();
		expect(body.error).toBe('Fact not found');
	});
});

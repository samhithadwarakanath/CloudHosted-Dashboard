// src/lib/tests/backend/errors.test.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import { GET as GET_ALL } from '../../../routes/api/cats/+server';
import { DELETE as DELETE_BY_ID } from '../../../routes/api/cats/[id]/+server';

const originalFetch = global.fetch;

afterEach(() => {
	global.fetch = originalFetch;
});

describe('Server Error Handling for cat routes', () => {
	it('GET /api/cats returns 500 when backend fetch throws', async () => {
		global.fetch = vi.fn().mockRejectedValue(new Error('DB error'));

		const res = await GET_ALL();
		expect(res.status).toBe(500);
		const body = await res.json();
		expect(body.error).toBe('Failed to fetch cats');
	});

	it('DELETE /api/cats/[id] returns 500 when backend fetch throws', async () => {
		global.fetch = vi.fn().mockRejectedValue(new Error('DB error'));

		const res = await DELETE_BY_ID({ params: { id: '1' } });
		expect(res.status).toBe(500);
		const body = await res.json();
		expect(body.error).toBe('Failed to delete cat fact');
	});

	it('DELETE /api/cats/[id] returns 404 when backend returns 404', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 404,
			json: async () => ({ error: 'not found' })
		});

		const res = await DELETE_BY_ID({ params: { id: '999' } });
		expect(res.status).toBe(404);
		const body = await res.json();
		expect(body.error).toBe('Fact not found');
	});
});

// src/lib/tests/backend/validation.test.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import { POST } from '../../../routes/api/cats/+server';

const originalFetch = global.fetch;

afterEach(() => {
	global.fetch = originalFetch;
});

describe('Input Validation for POST /api/cats', () => {
	it('rejects missing fact field with 400', async () => {
		const req = new Request('http://localhost/api/cats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({})
		});

		const res = await POST({ request: req });
		expect(res.status).toBe(400);
		const body = await res.json();
		expect(body.error).toBe('Invalid fact');
	});

	it('rejects non-string fact with 400', async () => {
		const req = new Request('http://localhost/api/cats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ fact: 123 })
		});

		const res = await POST({ request: req });
		expect(res.status).toBe(400);
		const body = await res.json();
		expect(body.error).toBe('Invalid fact');
	});

	it('rejects extremely long fact with 400', async () => {
		const longFact = 'a'.repeat(2001);

		const req = new Request('http://localhost/api/cats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ fact: longFact })
		});

		const res = await POST({ request: req });
		expect(res.status).toBe(400);
		const body = await res.json();
		expect(body.error).toBe('Invalid fact');
	});
});

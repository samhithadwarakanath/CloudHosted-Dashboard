// src/routes/api/cats/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

const BACKEND_URL = 'http://localhost:3000/api/cats';

// 🐱 GET all cat facts
export const GET: RequestHandler = async () => {
	try {
		const res = await fetch(BACKEND_URL);
		if (!res.ok) {
			console.error('Backend GET failed with status', res.status);
			return new Response(JSON.stringify({ error: 'Failed to fetch cats' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		const data = await res.json();
		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('GET /api/cats error:', err);
		return new Response(JSON.stringify({ error: 'Failed to fetch cats' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

// 🐾 POST a new fact (with simple validation)
export const POST: RequestHandler = async ({ request }) => {
	try {
		const newFact = await request.json();

		// basic validation
		if (!newFact?.fact || typeof newFact.fact !== 'string' || newFact.fact.length > 1000) {
			return new Response(JSON.stringify({ error: 'Invalid fact' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		console.log('🆕 New fact received:', newFact);

		const res = await fetch(BACKEND_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newFact)
		});

		if (!res.ok) {
			console.error('Backend POST failed with status', res.status);
			return new Response(JSON.stringify({ error: 'Failed to save fact' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const data = await res.json();
		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('POST /api/cats error:', err);
		return new Response(JSON.stringify({ error: 'Failed to post fact' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

// ❌ DELETE by fact text (?fact=...)
export const DELETE: RequestHandler = async ({ url }) => {
	try {
		const fact = url.searchParams.get('fact');
		if (!fact) {
			return new Response(JSON.stringify({ error: 'Missing fact' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const res = await fetch(`${BACKEND_URL}?fact=${encodeURIComponent(fact)}`, {
			method: 'DELETE'
		});

		if (!res.ok) {
			console.error('Backend DELETE failed with status', res.status);
			return new Response(JSON.stringify({ error: 'Failed to delete fact' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const data = await res.json();
		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('DELETE /api/cats error:', err);
		return new Response(JSON.stringify({ error: 'Failed to delete fact' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

// src/routes/api/cats/[id]/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

const BACKEND_URL = 'http://localhost:3000/api/cats';

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	try {
		const res = await fetch(`${BACKEND_URL}/${id}`);
		if (!res.ok) {
			return new Response(JSON.stringify({ error: 'Fact not found' }), {
				status: res.status,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		const data = await res.json();
		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('GET /api/cats/[id] error:', err);
		return new Response(JSON.stringify({ error: 'Failed to fetch cat fact' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const { id } = params;

	try {
		const body = await request.json();
		if (!body?.fact || typeof body.fact !== 'string') {
			return new Response(JSON.stringify({ error: 'Invalid fact' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const res = await fetch(`${BACKEND_URL}/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		if (!res.ok) {
			return new Response(JSON.stringify({ error: 'Fact not found' }), {
				status: res.status,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const data = await res.json();
		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('PUT /api/cats/[id] error:', err);
		return new Response(JSON.stringify({ error: 'Failed to update cat fact' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	const { id } = params;

	try {
		const res = await fetch(`${BACKEND_URL}/${id}`, {
			method: 'DELETE'
		});

		if (!res.ok) {
			return new Response(JSON.stringify({ error: 'Fact not found' }), {
				status: res.status,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const data = await res.json();
		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('DELETE /api/cats/[id] error:', err);
		return new Response(JSON.stringify({ error: 'Failed to delete cat fact' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

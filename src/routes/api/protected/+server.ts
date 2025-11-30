import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
    const session = cookies.get('session');

    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify({ message: 'Protected content' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};

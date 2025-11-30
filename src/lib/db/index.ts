import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const turso = createClient({
	url: "file:./data.db",
	
});

export const db = drizzle(turso);
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite', // 'mysql' | 'sqlite' | 'turso'
	schema: './src/lib/db/schema',
	dbCredentials: {
		url: "file:./data.db"
	}
});
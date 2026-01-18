import type { Config } from 'drizzle-kit';

// Use SQLite for local development, PostgreSQL for production
const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

export default {
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: isProduction && databaseUrl ? 'postgresql' : 'sqlite',
  dbCredentials: isProduction && databaseUrl
    ? { url: databaseUrl }
    : { url: './local.db' },
} satisfies Config;

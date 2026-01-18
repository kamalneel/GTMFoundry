import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import { createClient } from '@libsql/client';
import postgres from 'postgres';
import * as schema from './schema';

// Determine which database to use based on environment
const databaseUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';
const usePostgres = isProduction && databaseUrl?.includes('supabase');

// Create the appropriate database client
function createDb() {
  if (usePostgres && databaseUrl) {
    // Production: PostgreSQL via Supabase
    const client = postgres(databaseUrl);
    return drizzlePostgres(client, { schema });
  } else {
    // Development: SQLite
    const client = createClient({
      url: databaseUrl || 'file:./local.db',
    });
    return drizzleSqlite(client, { schema });
  }
}

// Export the database instance
export const db = createDb();

// Export schema for use in other files
export * from './schema';

// Type helper for database
export type Database = typeof db;

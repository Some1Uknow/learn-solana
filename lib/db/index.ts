import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = 'postgresql://postgres:2004@127.0.0.1:5432/learnsol';

if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// Create the connection
const client = postgres(connectionString, { 
  max: 1,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const db = drizzle(client, { schema });

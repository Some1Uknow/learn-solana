import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});

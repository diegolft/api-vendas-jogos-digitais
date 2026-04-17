import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { getDatabaseUrlFromEnv } from './src/infra/database/database.config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/infra/database/schema.ts',
  out: './migrations',
  dbCredentials: {
    url: getDatabaseUrlFromEnv(process.env),
  },
  verbose: true,
  strict: true,
});


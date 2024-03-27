import { createClient } from '@libsql/client';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

if (!process.env.DATABASE_TOKEN) {
  throw new Error('DATABASE_TOKEN is not set');
}

export const db = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_TOKEN!,
});

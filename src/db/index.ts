import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schema } from './client';

// Supabaseでは外部キー制約のサポートを確実にするため、prepare: falseを明示的に設定
const client = postgres(process.env.SUPABASE_DB_URI || '', {
  prepare: false,
  // Supabaseの外部キー制約をサポートするための設定
  transform: postgres.camel,
});

const db = drizzle(client, {
  schema,
  // 外部キー制約を有効にする
  logger: process.env.NODE_ENV === 'development',
});

export default db;

import { pgTable, varchar, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const ExampleTable = pgTable('example', {
  // Primary key
  id: varchar('id', { length: 255 }).primaryKey().unique(),
  
  // Basic fields
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  
  // Status and flags
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  isActive: boolean('is_active').notNull().default(true),
  
  // Numeric fields
  displayOrder: integer('display_order').notNull().default(0),
  count: integer('count').notNull().default(0),
  
  // JSON data
  metadata: jsonb('metadata'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}).enableRLS();
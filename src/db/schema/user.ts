import { pgTable, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

export const UserTable = pgTable('user', {
  // Primary key - matches Supabase auth.users.id
  id: varchar('id', { length: 255 }).primaryKey().unique(),
  
  // Basic user information
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  profileImageUrl: varchar('profile_image_url', { length: 500 }),
  
  // Birth date information
  birthYear: integer('birth_year'),
  birthMonth: integer('birth_month'),
  birthDay: integer('birth_day'),
  
  // Contact information
  phoneNumber: varchar('phone_number', { length: 20 }),
  
  // Status
  status: varchar('status', { length: 20 }).notNull().default('active'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}).enableRLS();
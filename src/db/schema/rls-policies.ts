import { sql } from 'drizzle-orm';
import { pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole, anonRole } from 'drizzle-orm/supabase';
import { ExampleTable } from './example';
import { UserTable } from './user';

// Example テーブルのRLSポリシー

// 全員が読み取り可能
export const exampleSelectPolicy = pgPolicy('public_can_read_examples', {
  for: 'select',
  to: [authenticatedRole, anonRole],
  using: sql`true`,
}).link(ExampleTable);

// 認証済みユーザーのみ作成可能
export const exampleInsertPolicy = pgPolicy('authenticated_can_insert_examples', {
  for: 'insert',
  to: authenticatedRole,
  withCheck: sql`true`,
}).link(ExampleTable);

// 認証済みユーザーのみ更新可能
export const exampleUpdatePolicy = pgPolicy('authenticated_can_update_examples', {
  for: 'update',
  to: authenticatedRole,
  using: sql`true`,
  withCheck: sql`true`,
}).link(ExampleTable);

// 認証済みユーザーのみ削除可能
export const exampleDeletePolicy = pgPolicy('authenticated_can_delete_examples', {
  for: 'delete',
  to: authenticatedRole,
  using: sql`true`,
}).link(ExampleTable);

// User テーブルのRLSポリシー

// ユーザーは自分のプロフィールのみ読み取り可能
export const userSelectPolicy = pgPolicy('users_can_select_own_profile', {
  for: 'select',
  to: authenticatedRole,
  using: sql`(select auth.uid()::text) = id`,
}).link(UserTable);

// ユーザーは自分のプロフィールのみ作成可能
export const userInsertPolicy = pgPolicy('users_can_insert_own_profile', {
  for: 'insert',
  to: authenticatedRole,
  withCheck: sql`(select auth.uid()::text) = id`,
}).link(UserTable);

// ユーザーは自分のプロフィールのみ更新可能
export const userUpdatePolicy = pgPolicy('users_can_update_own_profile', {
  for: 'update',
  to: authenticatedRole,
  using: sql`(select auth.uid()::text) = id`,
  withCheck: sql`(select auth.uid()::text) = id`,
}).link(UserTable);

// ユーザーは自分のプロフィールのみ削除可能
export const userDeletePolicy = pgPolicy('users_can_delete_own_profile', {
  for: 'delete',
  to: authenticatedRole,
  using: sql`(select auth.uid()::text) = id`,
}).link(UserTable);
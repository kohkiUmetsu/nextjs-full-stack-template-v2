import { ExampleTable } from './schema/example';
import { UserTable } from './schema/user';
import { ExampleRelations } from './schema/relations';
// RLSポリシーのインポート
import * as rlsPolicies from './schema/rls-policies';

export * from 'drizzle-orm';

// スキーマをオブジェクトとしてエクスポート
export const schema = {
  example: ExampleTable,
  user: UserTable,
  // リレーション定義
  exampleRelations: ExampleRelations,
  // RLSポリシー
  ...rlsPolicies,
};

import { relations } from 'drizzle-orm';
import { ExampleTable } from './example';

// Exampleテーブルのリレーション定義
export const ExampleRelations = relations(ExampleTable, ({ one, many }) => ({
  // 必要に応じてリレーションを追加
  // 例：
  // relatedItems: many(RelatedItemTable),
  // parent: one(ExampleTable, {
  //   fields: [ExampleTable.parentId],
  //   references: [ExampleTable.id],
  // }),
}));
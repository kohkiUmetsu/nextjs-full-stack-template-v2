import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import { createClient } from '@/utils/supabase/server';
import { getAuthFromHeaders } from '@/lib/auth-server';

/**
 * tRPC 応答時に参照できるコンテキストの生成関数.
 * baseProcedureではcookieを使用しないよう、Supabaseクライアントの作成を遅延評価にする
 */
export const createTRPCContext = cache(async () => {
  // baseProcedureではSupabaseクライアントを作成しない
  // protectedProcedureで必要な時のみ作成する
  return {
    // 遅延評価でSupabaseクライアントを作成する関数
    getSupabaseClient: async () => {
      const supabase = await createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      return {
        supabase,
        session,
        userId: session?.user.id,
      };
    },
  };
});

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createTRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

/**
 * 認証が必要なProcedure
 * middlewareで設定された認証情報を使用（パフォーマンス最適化）
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // middlewareで設定された軽量な認証情報を確認
  const authFromHeaders = await getAuthFromHeaders();

  if (!authFromHeaders.isAuthenticated) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  // Supabaseクライアントは必要な場合のみ取得
  const { supabase } = await ctx.getSupabaseClient();

  return next({
    ctx: {
      ...ctx,
      // ヘッダーからの認証情報を使用（高速）
      userId: authFromHeaders.id,
      userEmail: authFromHeaders.email,
      supabase,
      // 後方互換性のため
      session: { user: { id: authFromHeaders.id, email: authFromHeaders.email } },
    },
  });
});

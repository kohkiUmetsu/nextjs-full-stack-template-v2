/**
 * クライアントサイド認証ヘルパー関数
 *
 * このファイルはクライアントサイド（ブラウザ）での認証処理専用です。
 * サーバーサイドでの認証処理は lib/auth-server.ts を使用してください。
 *
 * 主な機能：
 * - クライアントサイドでのログアウト処理
 * - 認証状態のリフレッシュ
 * - Zustandストアとの連携
 */

import { createClient } from '@/utils/supabase/client';
import { useAuthStore } from './store/auth';

/**
 * ユーザー情報を取得
 *
 * @returns {Promise<{ user: User | null, error: Error | null }>}
 */
export const getUser = async () => {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error('Error getting user:', error);
    return { user: null, error };
  }
};

/**
 * ログアウト処理
 * Supabaseからログアウトし、Zustandのストアもクリアする
 */
export const signOut = async () => {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }

    // Zustandストアをクリア
    useAuthStore.getState().logout();

    return { success: true };
  } catch (error) {
    console.error('Sign out failed:', error);
    return { success: false, error };
  }
};

/**
 * 認証状態をリフレッシュ
 * 現在のセッション状態を確認してストアを更新
 */
export const refreshAuth = async () => {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Error refreshing auth:', error);
      useAuthStore.getState().setUser(null);
      return { user: null, error };
    }

    useAuthStore.getState().setUser(user);
    return { user, error: null };
  } catch (error) {
    console.error('Auth refresh failed:', error);
    useAuthStore.getState().setUser(null);
    return { user: null, error };
  }
};

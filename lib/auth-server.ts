import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

// サーバーサイド認証情報の型定義
export interface ServerAuthUser {
  id: string;
  email: string | undefined;
  isAuthenticated: true;
}

export interface ServerAuthNoUser {
  isAuthenticated: false;
}

export type ServerAuthInfo = ServerAuthUser | ServerAuthNoUser;

/**
 * middlewareで設定された認証情報をヘッダーから取得
 * パフォーマンス重視の軽量版
 */
export async function getAuthFromHeaders(): Promise<ServerAuthInfo> {
  try {
    const headersList = await headers();
    const userInfoHeader = headersList.get('x-user-info');

    if (!userInfoHeader) {
      return { isAuthenticated: false };
    }

    const userInfo = JSON.parse(Buffer.from(userInfoHeader, 'base64').toString());

    if (userInfo.isAuthenticated) {
      return {
        id: userInfo.id,
        email: userInfo.email,
        isAuthenticated: true,
      };
    }

    return { isAuthenticated: false };
  } catch (error) {
    console.error('Error parsing auth headers:', error);
    return { isAuthenticated: false };
  }
}

/**
 * Supabaseから直接認証情報を取得
 * より信頼性が必要な場合の詳細版
 */
export async function getAuthFromSupabase() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { isAuthenticated: false } as const;
    }

    return {
      id: user.id,
      email: user.email,
      user, // 完全なユーザーオブジェクト
      isAuthenticated: true,
    } as const;
  } catch (error) {
    console.error('Error getting auth from Supabase:', error);
    return { isAuthenticated: false } as const;
  }
}

/**
 * 認証が必要なページで使用するヘルパー
 * 認証されていない場合はnullを返す
 */
export async function requireAuth(): Promise<ServerAuthUser | null> {
  const auth = await getAuthFromHeaders();

  if (auth.isAuthenticated) {
    return auth;
  }

  return null;
}

/**
 * 認証状態を確認し、未認証の場合はエラー情報を返す
 */
export async function checkAuth(): Promise<{
  user: ServerAuthUser | null;
  isAuthenticated: boolean;
  shouldRedirect: boolean;
}> {
  const auth = await getAuthFromHeaders();

  if (auth.isAuthenticated) {
    return {
      user: auth,
      isAuthenticated: true,
      shouldRedirect: false,
    };
  }

  return {
    user: null,
    isAuthenticated: false,
    shouldRedirect: true,
  };
}

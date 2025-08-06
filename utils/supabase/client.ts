import { createBrowserClient } from '@supabase/ssr';

// カスタムストレージクラス：Remember Meの状態に基づいて動的にストレージを切り替え
class DynamicStorage {
  private getStorageType(): Storage {
    // Remember Meの状態をローカルストレージから確認
    const rememberMe = localStorage.getItem('remember-me-preference');

    if (rememberMe === 'true') {
      // Remember Meが有効な場合はローカルストレージを使用
      return window.localStorage;
    } else {
      // Remember Meが無効な場合はセッションストレージを使用
      return window.sessionStorage;
    }
  }

  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return this.getStorageType().getItem(key);
  }

  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    this.getStorageType().setItem(key, value);
  }

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    this.getStorageType().removeItem(key);
  }
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // セッション永続化を有効にし、ログイン状態を保持
        persistSession: true,
        // カスタムストレージを使用してRemember Meに基づいて動的切り替え
        storage: typeof window !== 'undefined' ? new DynamicStorage() : undefined,
      },
    }
  );
}

// Remember Meの設定を保存する関数
export function setRememberMePreference(remember: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('remember-me-preference', remember.toString());
  }
}

// Remember Meの設定を取得する関数
export function getRememberMePreference(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('remember-me-preference') === 'true';
  }
  return false;
}

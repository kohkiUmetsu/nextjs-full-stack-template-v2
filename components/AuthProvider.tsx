'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuthStore } from '@/lib/store/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading, setInitialized, isInitialized } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    // 初期認証状態を軽量取得（キャッシュ利用で高速化）
    const initializeAuth = async () => {
      try {
        // getSessionはキャッシュされたセッションを取得（高速）
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        setInitialized(true);
      } finally {
        setLoading(false);
      }
    };

    // 初期認証状態を取得（初回のみ）
    if (!isInitialized) {
      initializeAuth();
    }

    // 認証状態の変更をリッスン（ログイン・ログアウト時のみ）
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      // ログイン・ログアウト時のイベントログ
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading, setInitialized, isInitialized]);

  return <>{children}</>;
}

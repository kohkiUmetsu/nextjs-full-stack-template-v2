'use server';

import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const remember = formData.get('remember') === 'true';
  const supabase = await createClient();

  // ログイン実行
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // ログイン成功時の処理
  if (!error && data.session) {
    if (remember) {
      // Remember Meが有効な場合のログ出力
      console.log('Remember me enabled for session:', data.session.user.email);
    } else {
      // Remember Meが無効な場合のログ出力
      console.log('Session will expire when browser closes:', data.session.user.email);
    }
  }

  if (error) {
    console.error('Login error:', error.message);
    // エラーコードとメッセージを定義
    let errorCode = 500;
    let errorMessage = 'ログインに失敗しました';

    if (error.message.includes('Invalid login credentials')) {
      errorCode = 401;
      errorMessage = '無効なログイン情報です';
    } else if (error.message.includes('Email not confirmed')) {
      errorCode = 403;
      errorMessage = 'メールアドレスが確認されていません';
    }

    console.error(`Error Code: ${errorCode}, Message: ${errorMessage}`);

    return {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
      },
    };
  }

  return {
    success: true,
  };
}

'use server';

import { createClient } from '@/utils/supabase/server';

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return {
      success: false,
      error: {
        code: 400,
        message: 'メールアドレスが入力されていません',
      },
    };
  }

  try {
    const supabase = await createClient();

    // Supabaseのパスワードリセット機能を使用
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
    });

    if (error) {
      console.error('Password reset error:', error.message);

      // エラーの種類に応じてメッセージを調整
      let errorMessage = 'パスワードリセットの申請に失敗しました';

      if (error.message.includes('not found') || error.message.includes('invalid')) {
        errorMessage = '指定されたメールアドレスが見つかりません';
      } else if (error.message.includes('rate limit')) {
        errorMessage =
          '短時間に複数回のリクエストがあります。しばらく時間をおいてから再度お試しください';
      }

      return {
        success: false,
        error: {
          code: 400,
          message: errorMessage,
        },
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Unexpected error during password reset:', error);
    return {
      success: false,
      error: {
        code: 500,
        message: 'システムエラーが発生しました',
      },
    };
  }
}

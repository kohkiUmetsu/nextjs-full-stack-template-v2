'use server';

import { createClient } from '@/utils/supabase/server';

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string;

  if (!password) {
    return {
      success: false,
      error: {
        code: 400,
        message: 'パスワードが入力されていません',
      },
    };
  }

  try {
    const supabase = await createClient();

    // 現在のセッションを確認
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Session error:', sessionError?.message);
      return {
        success: false,
        error: {
          code: 401,
          message: 'セッションが無効です。再度パスワードリセットを申請してください',
        },
      };
    }

    // パスワードを更新
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      console.error('Password update error:', updateError.message);

      let errorMessage = 'パスワードの更新に失敗しました';

      if (updateError.message.includes('weak')) {
        errorMessage = 'パスワードが弱すぎます。より強力なパスワードを設定してください';
      } else if (updateError.message.includes('same')) {
        errorMessage = '現在のパスワードと同じパスワードは設定できません';
      } else if (
        updateError.message.includes('expired') ||
        updateError.message.includes('invalid')
      ) {
        errorMessage =
          'セッションの有効期限が切れています。再度パスワードリセットを申請してください';
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
    console.error('Unexpected error during password update:', error);
    return {
      success: false,
      error: {
        code: 500,
        message: 'システムエラーが発生しました',
      },
    };
  }
}

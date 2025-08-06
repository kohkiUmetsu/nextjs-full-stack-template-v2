import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  console.log('request.url', request.url);
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  console.log('Auth confirm route accessed:', { token_hash: !!token_hash, type, next });

  if (token_hash && type) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      console.log('OTP verification successful, type:', type);

      // パスワードリセット（recovery）の場合
      if (type === 'recovery') {
        // OTP検証成功後、update-passwordページにリダイレクト
        // Supabaseが自動的にcodeパラメータを付与してくれる
        console.log('Password recovery verified, redirecting to update-password page');
        redirect('/auth/update-password');
      } else {
        // その他のタイプ（signup confirmation等）は従来通りの処理
        console.log('OTP verification successful, redirecting to:', next);
        redirect(next);
      }
    } else {
      console.error('OTP verification failed:', error.message);
      console.error('Error details:', error);

      // エラーの種類に応じてより詳細なエラー情報を提供
      let errorUrl = '/error';
      if (type === 'recovery') {
        if (error.message.includes('expired')) {
          errorUrl =
            '/auth/update-password?error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired';
        } else if (error.message.includes('invalid')) {
          errorUrl =
            '/auth/update-password?error=access_denied&error_code=invalid_token&error_description=Invalid+or+malformed+token';
        } else {
          errorUrl =
            '/auth/update-password?error=verification_failed&error_description=' +
            encodeURIComponent(error.message);
        }
      }
      redirect(errorUrl);
    }
  } else {
    console.error('Missing required parameters:', { token_hash: !!token_hash, type });

    // パラメータ不足の場合も適切なエラーページにリダイレクト
    if (type === 'recovery' || searchParams.get('next')?.includes('update-password')) {
      redirect(
        '/auth/update-password?error=missing_params&error_description=Missing+required+parameters'
      );
    } else {
      redirect('/error');
    }
  }
}

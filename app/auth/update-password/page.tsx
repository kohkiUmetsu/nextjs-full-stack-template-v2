'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updatePassword } from './actions';
import { UpdatePasswordFormData, updatePasswordSchema } from '@/types/auth';
import { createClient } from '@/utils/supabase/client';

export default function UpdatePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [tokensLoaded, setTokensLoaded] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<UpdatePasswordFormData>({
    mode: 'onSubmit',
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  // セッション確認：confirm routeで既にセッションが確立されているかチェック
  useEffect(() => {
    const checkSession = async () => {
      if (typeof window !== 'undefined') {
        // クエリパラメータからエラーをチェック
        const urlParams = new URLSearchParams(window.location.search);
        const errorCode = urlParams.get('error_code');
        const errorDescription = urlParams.get('error_description');

        if (errorCode) {
          let errorMessage = 'リセットリンクでエラーが発生しました。';

          if (errorCode === 'otp_expired') {
            errorMessage =
              'リセットリンクの有効期限が切れています。新しいパスワードリセットを申請してください。';
          } else if (errorCode === 'access_denied') {
            errorMessage = 'アクセスが拒否されました。新しいパスワードリセットを申請してください。';
          } else if (errorDescription) {
            errorMessage = `エラー: ${decodeURIComponent(errorDescription)}`;
          }

          setErrorMessage(errorMessage);
          setTokensLoaded(true);
          return;
        }

        // 既に確立されているセッションをチェック
        try {
          const supabase = createClient();
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.error('Get session error:', error);
            setErrorMessage(
              'セッションの取得に失敗しました。再度パスワードリセットを申請してください。'
            );
          } else if (session) {
            console.log('Valid session found for password update');
            setIsSessionReady(true);
          } else {
            console.log('No valid session found');
            setErrorMessage(
              '有効なセッションが見つかりません。再度パスワードリセットを申請してください。'
            );
          }
        } catch (error) {
          console.error('Unexpected error during session check:', error);
          setErrorMessage(
            'セッションの確認中にエラーが発生しました。再度パスワードリセットを申請してください。'
          );
        }

        setTokensLoaded(true);
      }
    };

    checkSession();
  }, []);

  const onSubmit = async (data: UpdatePasswordFormData) => {
    if (!isSessionReady) {
      setErrorMessage('認証情報が不正です。再度パスワードリセットを申請してください。');
      return;
    }

    try {
      // zodでバリデーション実行
      clearErrors();
      setErrorMessage('');
      const validatedData = updatePasswordSchema.parse(data);

      const formData = new FormData();
      formData.append('password', validatedData.password);

      // パスワード更新実行
      const result = await updatePassword(formData);

      if (result.success) {
        alert('パスワードが正常に更新されました。ログイン画面に移動します。');
        router.push('/login');
      } else {
        setErrorMessage(result.error?.message || 'パスワードの更新に失敗しました');
      }
    } catch (error: any) {
      if (error.errors) {
        // zodのバリデーションエラーをフォームエラーに設定
        error.errors.forEach((err: any) => {
          setError(err.path[0] as keyof UpdatePasswordFormData, {
            type: 'manual',
            message: err.message,
          });
        });
      } else {
        console.error('Update password error:', error);
        setErrorMessage('パスワードの更新に失敗しました');
      }
    }
  };

  // トークンが読み込まれる前の表示
  if (!tokensLoaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-2xl border border-figure-color bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-center text-2xl font-bold">パスワード更新</h1>
          <div className="text-center">
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  // セッションが確立されていない場合の表示
  if (!isSessionReady) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-2xl border border-figure-color bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-center text-2xl font-bold">パスワード更新</h1>
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3">
            <p className="text-sm text-red-700">
              {errorMessage ||
                'リセットリンクが無効です。再度パスワードリセットを申請してください。'}
            </p>
          </div>
          <div className="text-center">
            <Button asChild>
              <button type="button" onClick={() => router.push('/auth/reset-password')}>
                パスワードリセット申請に戻る
              </button>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl border border-figure-color bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">パスワード更新</h1>

        {errorMessage && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        <div className="mb-6 text-center text-sm text-gray-600">
          新しいパスワードを入力してください。
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              新しいパスワード
            </label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="新しいパスワードを入力してください。"
              className="mt-1"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
              新しいパスワード（確認）
            </label>
            <Input
              id="passwordConfirm"
              type={showPasswordConfirm ? 'text' : 'password'}
              placeholder="新しいパスワードを再度入力してください。"
              className="mt-1"
              {...register('passwordConfirm')}
            />
            {errors.passwordConfirm && (
              <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm.message}</p>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? '更新中...' : 'パスワードを更新'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button asChild>
            <button type="button" onClick={() => router.push('/login')}>
              ログイン画面に戻る
            </button>
          </Button>
        </div>
      </div>
    </div>
  );
}

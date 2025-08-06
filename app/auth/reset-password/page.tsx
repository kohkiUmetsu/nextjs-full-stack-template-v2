'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { requestPasswordReset } from './actions';
import { ResetPasswordFormData, resetPasswordSchema } from '@/types/auth';

export default function ResetPasswordPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ResetPasswordFormData>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      // zodでバリデーション実行
      clearErrors();
      setErrorMessage('');
      setSuccessMessage('');
      const validatedData = resetPasswordSchema.parse(data);

      const formData = new FormData();
      formData.append('email', validatedData.email);

      // パスワードリセット申請実行
      const result = await requestPasswordReset(formData);

      if (result.success) {
        setSuccessMessage('パスワードリセットのメールを送信しました。メールをご確認ください。');
      } else {
        setErrorMessage(result.error?.message || 'パスワードリセットの申請に失敗しました');
      }
    } catch (error: any) {
      if (error.errors) {
        // zodのバリデーションエラーをフォームエラーに設定
        error.errors.forEach((err: any) => {
          setError(err.path[0] as keyof ResetPasswordFormData, {
            type: 'manual',
            message: err.message,
          });
        });
      } else {
        console.error('Reset password error:', error);
        setErrorMessage('パスワードリセットの申請に失敗しました');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-figure-color bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">パスワードリセット</h1>

        {errorMessage && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-md border border-green-300 bg-green-50 p-3">
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        <div className="mb-6 text-center text-sm text-gray-600">
          登録時のメールアドレスを入力してください。
          <br />
          パスワードリセット用のリンクをお送りします。
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <Input
              id="email"
              type="email"
              placeholder="メールアドレスを入力してください。"
              className="mt-1"
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? '送信中...' : 'リセットメールを送信'}
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

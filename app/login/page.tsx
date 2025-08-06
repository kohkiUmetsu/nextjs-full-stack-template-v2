'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient, setRememberMePreference } from '@/utils/supabase/client';
import { useAuthStore } from '@/lib/store/auth';
import { login } from './actions';
import { LoginFormData, loginSchema } from '@/types/auth';

// ローディングコンポーネント
function LoginLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl border border-figure-color bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">ログイン</h1>
        <div className="space-y-6">
          <div className="h-16 animate-pulse rounded bg-gray-200"></div>
          <div className="h-16 animate-pulse rounded bg-gray-200"></div>
          <div className="h-12 animate-pulse rounded bg-gray-200"></div>
          <div className="h-12 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}

// useSearchParamsを使用するログインフォームコンポーネント
function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuthStore();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  // エラーコードと日本語メッセージのマッピング
  const getErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      login_failed: 'ログインに失敗しました',
      invalid_credentials: 'メールアドレスまたはパスワードが正しくありません',
      email_not_confirmed: 'メールアドレスの確認が完了していません',
    };
    return errorMessages[errorCode] || errorCode;
  };

  useEffect(() => {
    const message = searchParams?.get('message');
    if (message) {
      setErrorMessage(getErrorMessage(message));
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      // zodでバリデーション実行
      clearErrors();
      setErrorMessage('');
      const validatedData = loginSchema.parse(data);

      // Remember Meの設定を事前に保存（ストレージタイプを決定するため）
      setRememberMePreference(validatedData.remember ?? false);

      const formData = new FormData();
      formData.append('email', validatedData.email);
      formData.append('password', validatedData.password);
      if (validatedData.remember) {
        formData.append('remember', 'true');
      }

      // ログイン実行
      const result = await login(formData);

      if (result.success) {
        // ログイン成功時は即座にクライアントサイドでユーザー情報を取得・保存
        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();
          if (userError) {
            console.error('Error fetching user after login:', userError);
          } else if (user) {
            // ストアに即座にユーザー情報を保存
            setUser(user);
            console.log('User data saved to store immediately:', user.email);
          }
        } catch (error) {
          console.error('Error updating user store:', error);
        }

        // クライアントサイドで画面遷移
        router.push('/');
      } else {
        // エラー時はメッセージを表示
        setErrorMessage(result.error?.message || 'ログインに失敗しました');
      }
    } catch (error: any) {
      if (error.errors) {
        // zodのバリデーションエラーをフォームエラーに設定
        error.errors.forEach((err: any) => {
          setError(err.path[0] as keyof LoginFormData, {
            type: 'manual',
            message: err.message,
          });
        });
      } else {
        console.error('Login error:', error);
        setErrorMessage('ログインに失敗しました');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl border border-figure-color bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">ログイン</h1>
        {errorMessage && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}
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
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="パスワードを入力してください。"
              className="mt-1"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="remember"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                次回からログイン不要にする
              </label>
            </div>
            <a href="/auth/reset-password" className="text-sm text-secondary-color hover:underline">
              パスワードを忘れた方はこちらから
            </a>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'ログイン中...' : 'ログイン'}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <Button asChild>
            <a href="/register">会員登録はこちらから</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

// メインコンポーネント
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ConfirmPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">メールを確認してください</h1>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">
            アカウントを有効にするためのリンクを記載したメールを送信しました。
          </p>
          <p className="text-sm text-gray-500">
            メールが届かない場合は、迷惑メールフォルダをご確認ください。
          </p>
        </div>
        <div className="mt-8">
          <Button asChild className="w-full">
            <Link href="/login">ログインページに戻る</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

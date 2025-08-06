'use client';

import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">エラーが発生しました</h2>
          <p className="mt-2 text-sm text-gray-600">
            申し訳ありません。処理中にエラーが発生しました。
          </p>
        </div>
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-yellow-800">メール認証でお困りの場合</h3>
            <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
              <li>メールリンクの有効期限が切れている可能性があります</li>
              <li>メールアドレスが正しく確認されていない可能性があります</li>
              <li>再度登録を行ってみてください</li>
            </ul>
          </div>
          <div className="flex flex-col space-y-2">
            <Link
              href="/register"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              新規登録に戻る
            </Link>
            <Link
              href="/login"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ログインページに戻る
            </Link>
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ホームページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

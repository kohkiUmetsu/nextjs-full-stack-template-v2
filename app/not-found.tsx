import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-color">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[var(--color-text-black-color)] mb-4">404</h1>
          <h2 className="text-2xl font-bold text-[var(--color-text-black-color)] mb-2">
            ページが見つかりません
          </h2>
          <p className="text-[var(--color-figure-color)]">
            申し訳ありません。お探しのページは存在しないか、移動した可能性があります。
          </p>
        </div>
        <div className="space-y-4">
          <div className="bg-white border border-[var(--color-image-holder-color)] rounded-lg p-4">
            <h3 className="text-sm font-medium text-[var(--color-text-black-color)] mb-2">
              お困りの場合
            </h3>
            <ul className="text-sm text-[var(--color-figure-color)] list-disc list-inside space-y-1">
              <li>URLが正しく入力されているかご確認ください</li>
              <li>ページが移動している可能性があります</li>
              <li>以下のリンクから目的のページにアクセスしてください</li>
            </ul>
          </div>
          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[var(--color-secondary-color)] hover:bg-[var(--color-secondary-color)]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary-color)] transition-colors"
            >
              施設を探す（ホームページ）
            </Link>
            <Link
              href="/favorite"
              className="w-full flex justify-center py-2 px-4 border border-[var(--color-image-holder-color)] rounded-lg shadow-sm text-sm font-medium text-[var(--color-text-black-color)] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary-color)] transition-colors"
            >
              お気に入り
            </Link>
            <Link
              href="/qa"
              className="w-full flex justify-center py-2 px-4 border border-[var(--color-image-holder-color)] rounded-lg shadow-sm text-sm font-medium text-[var(--color-text-black-color)] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary-color)] transition-colors"
            >
              よくある質問
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

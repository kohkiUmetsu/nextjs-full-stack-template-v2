# 認証システム

このプロジェクトでは、Next.js + Supabase + Zustandを組み合わせた最適化された認証システムを実装しています。

## 認証システムの構成

### 1. **Middleware層（サーバーサイド）**

- **ファイル**: `utils/supabase/middleware.ts`
- **役割**: 全てのリクエストでセッション管理とユーザー情報の前処理
- **機能**:
  - Supabaseセッションの同期
  - ユーザー情報をヘッダーに追加（`x-user-info`）
  - セキュリティとパフォーマンスの両立

### 2. **サーバーサイド認証管理**

- **ファイル**: `lib/auth-server.ts`
- **対象**: Server Components、API Routes、Server Actions
- **機能**:
  - `getAuthFromHeaders()`: middlewareで設定されたヘッダーから高速取得（推奨）
  - `getAuthFromSupabase()`: 詳細情報が必要な場合のSupabase直接取得（最小限使用）
  - `requireAuth()`: 認証必須ページ用のヘルパー
  - `checkAuth()`: 認証状態の詳細チェック

### 3. **クライアントサイド状態管理**

- **ファイル**: `lib/store/auth.ts`
- **技術**: Zustand + persist middleware
- **機能**:
  - グローバル認証状態の管理
  - ローカルストレージでの永続化
  - リアルタイム状態更新

### 4. **クライアントサイド認証処理**

- **ファイル**: `lib/auth.ts`
- **対象**: Client Components、ブラウザ処理
- **機能**:
  - ログアウト処理
  - 認証状態のリフレッシュ
  - Zustandストアとの連携

### 5. **認証状態初期化**

- **ファイル**: `components/AuthProvider.tsx`
- **役割**: アプリ全体での認証状態の初期化とリスナー設定
- **配置**: `app/layout.tsx`で全体をラップ

## 使用方法

### サーバーサイドでの認証（推奨）

```typescript
// app/dashboard/page.tsx
import { checkAuth } from '@/lib/auth-server';

export default async function DashboardPage() {
  const { user, shouldRedirect } = await checkAuth();

  if (shouldRedirect) {
    redirect('/login');
  }

  return <div>Welcome {user?.email}</div>;
}
```

### クライアントサイドでの認証

```typescript
// components/UserProfile.tsx
'use client';
import { useAuth } from '@/lib/hooks/useAuth';

export default function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return <div>Hello {user?.email}</div>;
}
```

### tRPCでの認証

```typescript
// trpc/routers/user.ts
export const userRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    // ctx.userId, ctx.userEmail が自動で利用可能
    return { id: ctx.userId, email: ctx.userEmail };
  }),
});
```

## パフォーマンス最適化

### 1. **二段階認証チェック**

- **第一段階**: middlewareでヘッダーに設定された軽量な認証情報
- **第二段階**: 必要時のみSupabaseから詳細情報を取得

### 2. **リクエスト削減**

- クライアントサイドでの不要なSupabaseリクエストを削減
- サーバーサイドではヘッダーからの高速取得を優先

### 3. **状態管理の最適化**

- Zustandによる効率的なグローバル状態管理
- 永続化による初期化の高速化

## ファイル構成

```
lib/
├── auth.ts                 # クライアントサイド認証（'use client'専用）
├── auth-server.ts          # サーバーサイド認証（Server Components用）
├── hooks/
│   └── useAuth.ts         # 認証状態フック
└── store/
    └── auth.ts            # Zustand認証ストア

components/
├── AuthProvider.tsx       # 認証状態初期化プロバイダー
├── Header.tsx            # 最適化されたヘッダー
└── UserMenu.tsx          # 認証済みユーザーメニュー

utils/supabase/
├── middleware.ts         # セッション管理middleware
├── server.ts            # サーバーサイドSupabaseクライアント
└── client.ts            # クライアントサイドSupabaseクライアント
```

## セキュリティ

### 1. **セッション同期**

- middlewareによる自動的なセッション同期
- ブラウザとサーバー間の状態整合性を保証

### 2. **認証情報の安全な転送**

- ヘッダー情報はBase64エンコード
- 最小限の情報のみを転送（ID、email、認証状態）

### 3. **エラーハンドリング**

- 全ての認証処理でのエラーハンドリング
- フォールバック処理によるセキュリティ確保

## テスト

```bash
# 認証ストアのテスト
npm test -- lib/store/auth.test.ts

# サーバーサイド認証のテスト
npm test -- lib/auth-server.test.ts
```

## 今後の拡張

- [ ] ロール・権限ベースのアクセス制御
- [ ] ソーシャルログインの統合
- [ ] 多要素認証の対応
- [ ] セッション管理の詳細設定

このシステムにより、セキュリティを維持しながら高速で使いやすい認証機能を提供しています。

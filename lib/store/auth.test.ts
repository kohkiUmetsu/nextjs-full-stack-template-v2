import { act, renderHook } from '@testing-library/react';
import { useAuthStore } from './auth';

// Zustandのpersistミドルウェアをモック
jest.mock('zustand/middleware', () => ({
  persist: jest.fn((fn) => fn),
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // 各テスト前にストアをリセット
    act(() => {
      useAuthStore.getState().reset();
    });
  });

  it('初期状態が正しく設定されている', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isInitialized).toBe(false);
  });

  it('setUserでユーザーを設定できる', () => {
    const { result } = renderHook(() => useAuthStore());

    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
    };

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
  });

  it('setLoadingでローディング状態を変更できる', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('setInitializedで初期化状態を変更できる', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setInitialized(true);
    });

    expect(result.current.isInitialized).toBe(true);
  });

  it('logoutでユーザーをクリアできる', () => {
    const { result } = renderHook(() => useAuthStore());

    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
    };

    // ユーザーを設定
    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);

    // ログアウト実行
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('resetで全ての状態を初期値に戻せる', () => {
    const { result } = renderHook(() => useAuthStore());

    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
    };

    // 状態を変更
    act(() => {
      result.current.setUser(mockUser);
      result.current.setInitialized(true);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isInitialized).toBe(true);

    // リセット実行
    act(() => {
      result.current.reset();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isInitialized).toBe(false);
  });
});

import { render, waitFor, act } from '@testing-library/react';
import AuthProvider from './AuthProvider';
import { useAuthStore } from '@/lib/store/auth';

// createClient を関数としてモック
jest.mock('@/utils/supabase/client', () => ({
  __esModule: true,
  createClient: jest.fn(),
}));

jest.mock('@/lib/store/auth');

import { createClient } from '@/utils/supabase/client';
const mockCreateClient = createClient as jest.Mock;
const mockUseAuthStore = useAuthStore as unknown as jest.Mock;

describe('AuthProvider (logic only)', () => {
  const mockSetUser = jest.fn();
  const mockSetInitialized = jest.fn();
  const mockSetLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuthStore.mockReturnValue({
      setUser: mockSetUser,
      setInitialized: mockSetInitialized,
      setLoading: mockSetLoading,
      isInitialized: false,
    });
  });

  it('calls setUser and setInitialized on mount with session', async () => {
    const mockUser = { id: 'u1', email: 'test@example.com' };
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: { user: mockUser } },
        }),
        onAuthStateChange: jest.fn().mockReturnValue({
          data: {
            subscription: { unsubscribe: jest.fn() },
          },
        }),
      },
    };
    mockCreateClient.mockReturnValue(mockSupabase as any);

    await act(async () => {
      render(
        <AuthProvider>
          <div>child</div>
        </AuthProvider>
      );
    });

    // getSession による初期化
    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockSetInitialized).toHaveBeenCalledWith(true);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  it('falls back to null user on getSession error', async () => {
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockRejectedValue(new Error('fail')),
        onAuthStateChange: jest.fn().mockReturnValue({
          data: {
            subscription: { unsubscribe: jest.fn() },
          },
        }),
      },
    };
    mockCreateClient.mockReturnValue(mockSupabase as any);

    await act(async () => {
      render(
        <AuthProvider>
          <div>child</div>
        </AuthProvider>
      );
    });

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(null);
      expect(mockSetInitialized).toHaveBeenCalledWith(true);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  it('updates user on auth state change SIGNED_IN / SIGNED_OUT', async () => {
    const listeners: any[] = [];
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null },
        }),
        onAuthStateChange: jest.fn((_cb: any) => {
          listeners.push(_cb);
          return {
            data: {
              subscription: { unsubscribe: jest.fn() },
            },
          };
        }),
      },
    };
    mockCreateClient.mockReturnValue(mockSupabase as any);

    await act(async () => {
      render(
        <AuthProvider>
          <div>child</div>
        </AuthProvider>
      );
    });

    const user = { id: 'u2', email: 'signedin@example.com' };
    // 模擬的に onAuthStateChange のコールバックを手動実行
    act(() => {
      listeners[0]('SIGNED_IN', { user });
    });

    expect(mockSetUser).toHaveBeenCalledWith(user);

    act(() => {
      listeners[0]('SIGNED_OUT', null);
    });

    expect(mockSetUser).toHaveBeenCalledWith(null);
  });
});

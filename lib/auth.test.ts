import { getUser, signOut, refreshAuth } from './auth';

// --- 依存関係のモック化 ---

// Supabaseクライアントのモック
const mockSupabaseAuthGetUser = jest.fn();
const mockSupabaseAuthSignOut = jest.fn();

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: mockSupabaseAuthGetUser,
      signOut: mockSupabaseAuthSignOut,
    },
  })),
}));

// Zustandストアのモック
const mockAuthStoreSetUser = jest.fn();
const mockAuthStoreLogout = jest.fn();

jest.mock('./store/auth', () => ({
  useAuthStore: {
    getState: jest.fn(() => ({
      setUser: mockAuthStoreSetUser,
      logout: mockAuthStoreLogout,
    })),
  },
}));

// --- テスト本体 ---

describe('lib/auth.ts', () => {
  beforeEach(() => {
    // 各テストの前にすべてのモックの履歴をリセット
    jest.clearAllMocks();
  });

  // getUser関数のテスト
  describe('getUser', () => {
    it('ユーザー取得に成功した場合、ユーザー情報を返す', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' };
      mockSupabaseAuthGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });

      const { user, error } = await getUser();

      expect(user).toEqual(mockUser);
      expect(error).toBeNull();
      expect(mockSupabaseAuthGetUser).toHaveBeenCalledTimes(1);
    });

    it('ユーザー取得に失敗した場合、エラー情報を返す', async () => {
      const mockError = new Error('Failed to fetch user');
      mockSupabaseAuthGetUser.mockResolvedValue({ data: { user: null }, error: mockError });

      const { user, error } = await getUser();

      expect(user).toBeNull();
      expect(error).toEqual(mockError);
    });
  });

  // signOut関数のテスト
  describe('signOut', () => {
    it('サインアウトに成功した場合、ストアのlogoutを呼び出す', async () => {
      mockSupabaseAuthSignOut.mockResolvedValue({ error: null });

      const result = await signOut();

      expect(result.success).toBe(true);
      expect(mockSupabaseAuthSignOut).toHaveBeenCalledTimes(1);
      expect(mockAuthStoreLogout).toHaveBeenCalledTimes(1);
    });

    it('サインアウトに失敗した場合、エラー情報を返し、logoutは呼ばれない', async () => {
      const mockError = new Error('Sign out failed');
      mockSupabaseAuthSignOut.mockResolvedValue({ error: mockError });

      const result = await signOut();

      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError);
      expect(mockAuthStoreLogout).not.toHaveBeenCalled();
    });
  });

  // refreshAuth関数のテスト
  describe('refreshAuth', () => {
    it('ユーザー取得に成功した場合、ストアにユーザー情報をセットする', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' };
      mockSupabaseAuthGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });

      await refreshAuth();

      expect(mockSupabaseAuthGetUser).toHaveBeenCalledTimes(1);
      expect(mockAuthStoreSetUser).toHaveBeenCalledWith(mockUser);
    });

    it('ユーザー取得に失敗した場合、ストアのユーザー情報をnullでセットする', async () => {
      const mockError = new Error('Failed to refresh');
      mockSupabaseAuthGetUser.mockResolvedValue({ data: { user: null }, error: mockError });

      await refreshAuth();

      expect(mockAuthStoreSetUser).toHaveBeenCalledWith(null);
    });
  });
});

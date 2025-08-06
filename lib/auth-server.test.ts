/**
 * @jest-environment node
 */

import { getAuthFromHeaders } from './auth-server';

// Next.jsのheadersをモック
jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

// Supabaseクライアントをモック
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

const mockHeaders = require('next/headers').headers;

describe('auth-server', () => {
  // console.errorをモックして、テスト中のエラーログを抑制
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe('getAuthFromHeaders', () => {
    it('認証済みユーザーの情報を正しく取得できる', async () => {
      const userInfo = {
        id: 'test-user-id',
        email: 'test@example.com',
        isAuthenticated: true,
      };

      const encodedUserInfo = Buffer.from(JSON.stringify(userInfo)).toString('base64');

      mockHeaders.mockResolvedValue({
        get: jest.fn().mockReturnValue(encodedUserInfo),
      });

      const result = await getAuthFromHeaders();

      expect(result).toEqual({
        id: 'test-user-id',
        email: 'test@example.com',
        isAuthenticated: true,
      });
    });

    it('未認証の場合にfalseを返す', async () => {
      const userInfo = { isAuthenticated: false };
      const encodedUserInfo = Buffer.from(JSON.stringify(userInfo)).toString('base64');

      mockHeaders.mockResolvedValue({
        get: jest.fn().mockReturnValue(encodedUserInfo),
      });

      const result = await getAuthFromHeaders();

      expect(result).toEqual({ isAuthenticated: false });
    });

    it('ヘッダーが存在しない場合にfalseを返す', async () => {
      mockHeaders.mockResolvedValue({
        get: jest.fn().mockReturnValue(null),
      });

      const result = await getAuthFromHeaders();

      expect(result).toEqual({ isAuthenticated: false });
    });

    it('無効なヘッダーの場合にfalseを返す', async () => {
      mockHeaders.mockResolvedValue({
        get: jest.fn().mockReturnValue('invalid-base64'),
      });

      const result = await getAuthFromHeaders();

      expect(result).toEqual({ isAuthenticated: false });
    });

    it('JSON解析エラーの場合にfalseを返す', async () => {
      const invalidJson = Buffer.from('invalid json').toString('base64');

      mockHeaders.mockResolvedValue({
        get: jest.fn().mockReturnValue(invalidJson),
      });

      const result = await getAuthFromHeaders();

      expect(result).toEqual({ isAuthenticated: false });
    });

    it('headers()関数が例外をスローした場合にfalseを返す', async () => {
      mockHeaders.mockRejectedValue(new Error('Headers error'));

      const result = await getAuthFromHeaders();

      expect(result).toEqual({ isAuthenticated: false });
    });
  });
});

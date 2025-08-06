// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// -----------------------------------------------------------------
// Browser API Mocks
// -----------------------------------------------------------------

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  cb: ResizeObserverCallback;

  constructor(cb: ResizeObserverCallback) {
    this.cb = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Supabaseクライアントのモック
jest.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      }),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  }),
}));

// isowsのモック
jest.mock('isows', () => ({
  WebSocket: jest.fn().mockImplementation(() => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    send: jest.fn(),
    close: jest.fn(),
    readyState: 1,
  })),
}));

// Supabase realtimeのモック
jest.mock('@supabase/realtime-js', () => ({
  RealtimeClient: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    channel: jest.fn(),
  })),
}));

// Next.js router のモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}));

// ウィンドウオブジェクトのモック（jsdom環境でのみ設定）
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // PointerEvent のモック (Radix UI + JSDOM)
  class MockPointerEvent extends Event {
    button: number;
    ctrlKey: boolean;
    pointerId: number;
    pointerType: string;

    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.button = params.button ?? 0;
      this.ctrlKey = params.ctrlKey ?? false;
      this.pointerId = params.pointerId ?? 0;
      this.pointerType = params.pointerType ?? '';
    }
  }
  window.PointerEvent = MockPointerEvent as any;

  if (!window.Element.prototype.hasPointerCapture) {
    window.Element.prototype.hasPointerCapture = function (pointerId) {
      return false;
    };
  }
  if (!window.Element.prototype.releasePointerCapture) {
    window.Element.prototype.releasePointerCapture = function (pointerId) {};
  }
  if (!window.Element.prototype.scrollIntoView) {
    window.Element.prototype.scrollIntoView = function () {};
  }

  // -----------------------------------------------------------------
  // window.location の最終的なモック
  // -----------------------------------------------------------------

  // モックするlocationオブジェクトを定義
  const mockLocation = {
    assign: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    href: 'http://localhost/',
    origin: 'http://localhost',
    pathname: '/',
    search: '',
    hash: '',
  };

  // window.locationをObject.definePropertyでモック
  // configurable: true にすることで、再定義可能にする
  Object.defineProperty(window, 'location', {
    configurable: true,
    enumerable: true,
    get: () => mockLocation, // 常にモックされたlocationオブジェクトを返す
    set: (value) => {
      // locationに新しい値が設定されようとした場合、mockLocationを更新する
      // ただし、通常はテスト内で直接locationを再設定することはないはず
      Object.assign(mockLocation, value);
    },
  });

  beforeEach(() => {
    // 各テストの前にモックをクリアし、初期状態に戻す
    mockLocation.assign.mockClear();
    mockLocation.reload.mockClear();
    mockLocation.replace.mockClear();

    mockLocation.href = 'http://localhost/';
    mockLocation.origin = 'http://localhost';
    mockLocation.pathname = '/';
    mockLocation.search = '';
    mockLocation.hash = '';
  });

  // afterAllは不要。Jestがテスト環境をクリーンアップするため。
}

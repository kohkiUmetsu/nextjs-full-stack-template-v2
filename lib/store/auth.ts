import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  logout: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  isLoading: true,
  isInitialized: false,

  setUser: (user) => set({ user, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),

  setInitialized: (isInitialized) => set({ isInitialized }),

  logout: () => set({ user: null, isLoading: false }),

  reset: () =>
    set({
      user: null,
      isLoading: true,
      isInitialized: false,
    }),
}));

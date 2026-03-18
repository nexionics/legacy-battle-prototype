import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { queryClient } from '@/shared/lib/queryClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserData } from '@/shared/types';

interface AuthStore {
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  user: UserData | null;
  setLoading: (loading: boolean) => void;
  setToken: (token: string) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: UserData | null) => void;
  setHasHydrated: (state: boolean) => void;
  _hasHydrated: boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoading: true,
      isAuthenticated: false,
      token: null,
      user: null,
      _hasHydrated: false,
      setLoading: (loading) => set({ isLoading: loading }),
      setToken: (token) => set({ token }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setUser: (user) => set({ user }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      logout: () =>
        set(() => {
          queryClient.clear();
          return { token: '', isAuthenticated: false, user: null };
        }),
    }),
    {
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      name: 'authStore',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

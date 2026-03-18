import React, { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import * as authApi from '@/features/auth/data/api/auth.api';
import type { AuthUser } from '@/shared/types';

function syncSessionToStore(
  user: AuthUser | null,
  accessToken: string | null,
  store: ReturnType<typeof useAuthStore.getState>
) {
  store.setUser(user);
  store.setToken(accessToken ?? '');
  store.setIsAuthenticated(!!user && !!accessToken);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setToken = useAuthStore((s) => s.setToken);
  const setIsAuthenticated = useAuthStore((s) => s.setIsAuthenticated);

  useEffect(() => {
    const init = async () => {
      const { user, accessToken } = await authApi.getSessionWithToken();
      setUser(user);
      setToken(accessToken ?? '');
      setIsAuthenticated(!!user && !!accessToken);
      setLoading(false);
    };

    init();

    const unsubscribe = authApi.subscribeToAuthChanges((user, accessToken) => {
      syncSessionToStore(user, accessToken, useAuthStore.getState());
    });
    return unsubscribe;
  }, [setUser, setLoading, setToken, setIsAuthenticated]);

  return <>{children}</>;
};

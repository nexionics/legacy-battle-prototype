import { useAuthStore } from '../../data/store/auth.store';
import * as authApi from '../../data/api/auth.api';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const logout = useAuthStore((s) => s.logout);

  const signUp = async (params: import('@/shared/types').SignUpParams) => authApi.signUp(params);
  const signIn = async (params: import('@/shared/types').SignInParams) => authApi.signIn(params);
  const signOut = async () => {
    await authApi.signOut();
    logout();
  };

  return {
    user,
    loading: isLoading,
    signUp,
    signIn,
    signOut,
  };
}

import { useAuthStore } from '../../data/store/auth.store';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.isLoading);
  const logout = useAuthStore((s) => s.logout);

  return {
    user,
    loading,
    signOut: logout,
  };
}

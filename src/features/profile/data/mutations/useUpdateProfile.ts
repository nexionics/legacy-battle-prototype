import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileKeys } from '../keys';
import { updateProfile } from '../api/profile.api';

export function useUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { username?: string; displayName?: string; bio?: string }) =>
      updateProfile(data),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });
      }
    },
  });
}

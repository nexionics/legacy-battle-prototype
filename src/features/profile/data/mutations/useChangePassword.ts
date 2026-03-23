import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changePassword } from '../api/profile.api';
import { profileKeys } from '../keys';

export function useChangePassword(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      changePassword(oldPassword, newPassword),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });
      }
    },
  });
}

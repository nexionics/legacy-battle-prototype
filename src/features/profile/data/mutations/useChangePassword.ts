import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../api/profile.api';

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      changePassword(oldPassword, newPassword),
  });
}

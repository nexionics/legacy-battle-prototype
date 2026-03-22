import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadAvatar } from '../api/avatar.api';
import { profileKeys } from '../keys';

export function useUpdateAvatar(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uri: string) => uploadAvatar(uri),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });
      }
    },
  });
}

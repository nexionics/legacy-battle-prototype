import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileKeys } from '../keys';
import { updateUserPreferences } from '../api/preferences.api';
import type { UpdateUserPreferences } from '@/shared/types';

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPreferences) => updateUserPreferences(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.preferences() });
    },
  });
}

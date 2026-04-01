import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBattleRequest } from '../api/battles.api';
import type { CreateBattlePayload } from '../api/types';
import { battlesKeys } from '../keys';

export function useCreateBattle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBattlePayload) => {
      const res = await createBattleRequest(payload);
      if (!res.success) {
        throw new Error(res.error.message);
      }
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: battlesKeys.all });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { battlesStrings } from '@/features/battles/string';
import { joinBattleRequest } from '../api/battles.api';
import { battlesKeys } from '../keys';

export function useJoinBattle(battleId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pick: string) => {
      if (!battleId) {
        throw new Error(battlesStrings.errors.missingBattle);
      }
      const res = await joinBattleRequest(battleId, { pick });
      if (!res.success) {
        throw new Error(res.error.message);
      }
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: battlesKeys.all });
      if (battleId) {
        await queryClient.invalidateQueries({ queryKey: battlesKeys.detail(battleId) });
      }
    },
  });
}

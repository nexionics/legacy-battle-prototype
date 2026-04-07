import { useMutation, useQueryClient } from '@tanstack/react-query';
import { battlesStrings } from '@/features/battles/string';
import { inviteToBattleRequest } from '../api/battles.api';
import type { InviteToBattlePayload } from '../api/types';
import { battlesKeys } from '../keys';

export function useInviteToBattle(battleId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: InviteToBattlePayload) => {
      if (!battleId) {
        throw new Error(battlesStrings.errors.missingBattle);
      }
      const res = await inviteToBattleRequest(battleId, body);
      if (!res.success) {
        throw new Error(res.error.message);
      }
      return res.data;
    },
    onSuccess: async () => {
      if (battleId) {
        await queryClient.invalidateQueries({ queryKey: battlesKeys.detail(battleId) });
      }
    },
  });
}

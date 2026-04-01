import { useQuery } from '@tanstack/react-query';
import { fetchBattleDetail } from '../api/battles.api';
import { mapBattleDetailDto } from '../api/mappers';
import { battlesKeys } from '../keys';
import type { BattleWithParticipants } from '@/shared/types';

export function useBattleQuery(battleId: string | undefined) {
  return useQuery({
    queryKey: battlesKeys.detail(battleId ?? ''),
    queryFn: async (): Promise<BattleWithParticipants> => {
      const res = await fetchBattleDetail(battleId!);
      if (!res.success) {
        return {
          battle: null,
          participants: [],
          error: new Error(res.error.message),
        };
      }
      const { battle, participants } = mapBattleDetailDto(res.data);
      return { battle, participants, error: null };
    },
    enabled: !!battleId,
  });
}

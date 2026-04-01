import { useQuery } from '@tanstack/react-query';
import { fetchBattlesQuickPicks } from '../api/battles.api';
import { mapBattleListItemToExploreBattle } from '../api/mappers';
import { battlesKeys } from '../keys';
import type { Battle } from '@/shared/types';

export function useQuickPickBattlesQuery(limit = 20, page = 1) {
  return useQuery({
    queryKey: battlesKeys.quickPicks({ limit, page }),
    queryFn: async (): Promise<Battle[]> => {
      const res = await fetchBattlesQuickPicks({ limit, page });
      if (!res.success) {
        throw new Error(res.error.message);
      }
      return res.data.items.map((row) => mapBattleListItemToExploreBattle(row));
    },
  });
}

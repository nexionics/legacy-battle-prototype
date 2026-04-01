import { useQuery } from '@tanstack/react-query';
import { fetchBattlesPage } from '../api/battles.api';
import { mapBattleListItemToExploreBattle } from '../api/mappers';
import { battlesKeys } from '../keys';
import type { Battle } from '@/shared/types';

const DEFAULT_PAGE = { limit: 20, page: 1 };

export function useBattlesQuery(params: { limit?: number; page?: number } = DEFAULT_PAGE) {
  const { limit = 20, page = 1 } = params;
  return useQuery({
    queryKey: battlesKeys.list({ limit, page }),
    queryFn: async (): Promise<Battle[]> => {
      const res = await fetchBattlesPage({ limit, page });
      if (!res.success) {
        throw new Error(res.error.message);
      }
      return res.data.items.map((row) => mapBattleListItemToExploreBattle(row));
    },
  });
}

import { useQuery } from '@tanstack/react-query';
import { fetchBattlesExplore } from '../api/battles.api';
import { mapBattleListItemToExploreBattle } from '../api/mappers';
import { battlesKeys } from '../keys';
import type { ExploreTab } from '../types';
import type { ExploreBattle } from '@/shared/types';
import type { BattlesExploreDataDto } from '../api/types';

const TAB_TO_KEY: Record<ExploreTab, keyof BattlesExploreDataDto> = {
  Trending: 'trending',
  'Ending Soon': 'ending',
  New: 'new',
  'High Activity': 'highActivity',
} as const;

export function useExploreBattlesQuery(tab: ExploreTab) {
  return useQuery({
    queryKey: battlesKeys.exploreTab(tab),
    queryFn: async (): Promise<ExploreBattle[]> => {
      const res = await fetchBattlesExplore();
      if (!res.success) {
        throw new Error(res.error.message);
      }
      const key = TAB_TO_KEY[tab];
      const rows = res.data[key] ?? [];
      return rows.map((row) => mapBattleListItemToExploreBattle(row));
    },
  });
}

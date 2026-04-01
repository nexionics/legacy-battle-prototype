import { useBattlesQuery } from '../../data/queries';
import { useBattlesStore } from '../../data/store/battles.store';

export function useBattles() {
  const battlesQuery = useBattlesQuery({ limit: 20, page: 1 });
  const { listActiveTab, setListActiveTab } = useBattlesStore();

  const battles = battlesQuery.data ?? [];
  const filteredBattles = battles.filter((battle) => {
    if (listActiveTab === 'open') return battle.status === 'open';
    if (listActiveTab === 'active') return battle.status === 'active';
    if (listActiveTab === 'completed')
      return battle.status === 'completed' || battle.status === 'canceled';
    return true;
  });

  return {
    battles: filteredBattles,
    isLoading: battlesQuery.isLoading,
    isRefreshing: battlesQuery.isFetching,
    error: battlesQuery.error,
    refetch: battlesQuery.refetch,
    listActiveTab,
    setListActiveTab,
  };
}

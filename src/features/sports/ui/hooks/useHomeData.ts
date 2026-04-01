import { useUpcomingGamesQuery } from '../../data/queries/useUpcomingGamesQuery';
import { useRecentResultsQuery } from '../../data/queries/useRecentResultsQuery';
import { useQuickPickBattlesQuery } from '@/features/battles/data/queries/useQuickPickBattlesQuery';
import { useMyAcceptedBattlesQuery } from '@/features/battles/data/queries/useMyAcceptedBattlesQuery';

export function useHomeData(_userId: string | undefined) {
  const upcomingQuery = useUpcomingGamesQuery();
  const recentQuery = useRecentResultsQuery();
  const quickPicksQuery = useQuickPickBattlesQuery(5, 1);
  const myBattlesQuery = useMyAcceptedBattlesQuery(5, 1);

  const upcomingGames = upcomingQuery.data ?? [];
  const recentResults = recentQuery.data ?? [];
  const quickPicks = quickPicksQuery.data ?? [];
  const myBattles = myBattlesQuery.data ?? [];

  const isLoading = upcomingQuery.isLoading || recentQuery.isLoading;
  const error = upcomingQuery.error ?? recentQuery.error;

  const refetch = () => {
    upcomingQuery.refetch();
    recentQuery.refetch();
    quickPicksQuery.refetch();
    myBattlesQuery.refetch();
  };

  return {
    upcomingGames: upcomingGames.slice(0, 5),
    recentResults: recentResults.slice(0, 5),
    quickPicks,
    myBattles,
    homeLoading: isLoading,
    homeError: error?.message ?? null,
    refetch,
  };
}

import { useCallback } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '@/app/navigation/types';
import type { SportFilter } from '@/shared/types';
import type { SportsEvent } from '@/shared/types';
import { useAllUpcomingGames } from './useAllUpcomingGames';

export type AllUpcomingGamesScreenViewProps = ReturnType<typeof useAllUpcomingGamesScreen>;

export function useAllUpcomingGamesScreen(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  initialSport?: SportFilter,
) {
  const {
    games,
    gamesLoading,
    gamesRefreshing,
    gamesSelectedSport,
    setGamesSelectedSport,
    refetch,
  } = useAllUpcomingGames(initialSport);

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSportSelect = useCallback(
    (sport: SportFilter) => {
      setGamesSelectedSport(sport);
    },
    [setGamesSelectedSport],
  );

  const onRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const onBattle = useCallback(
    (event: SportsEvent) => {
      navigation.navigate('BattleVisibility', {
        prefillTitle: `${event.strHomeTeam} vs ${event.strAwayTeam}`,
        prefillEventId: event.idEvent,
        homeTeam: event.strHomeTeam,
        awayTeam: event.strAwayTeam,
      });
    },
    [navigation],
  );

  return {
    games,
    gamesLoading,
    gamesRefreshing,
    gamesSelectedSport,
    onSportSelect,
    onRefresh,
    onBack,
    onBattle,
  };
}

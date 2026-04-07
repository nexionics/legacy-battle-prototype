import { useCallback } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '@/app/navigation/types';
import type { SportFilter } from '@/shared/types';
import { useAllResults } from './useAllResults';

export type AllResultsScreenViewProps = ReturnType<typeof useAllResultsScreen>;

export function useAllResultsScreen(
  navigation: NativeStackNavigationProp<AppStackParamList>,
) {
  const {
    results,
    resultsLoading,
    resultsRefreshing,
    resultsSelectedSport,
    setResultsSelectedSport,
    refetch,
  } = useAllResults();

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSportSelect = useCallback(
    (sport: SportFilter) => {
      setResultsSelectedSport(sport);
    },
    [setResultsSelectedSport],
  );

  const onRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  return {
    results,
    resultsLoading,
    resultsRefreshing,
    resultsSelectedSport,
    onSportSelect,
    onRefresh,
    onBack,
  };
}

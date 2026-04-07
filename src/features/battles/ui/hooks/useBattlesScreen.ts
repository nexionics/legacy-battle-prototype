import { useCallback } from 'react';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList, TabParamList } from '@/app/navigation/types';
import type { TabType } from '@/shared/types';
import { useBattles } from './useBattles';

export type BattlesScreenNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Battles'>,
  NativeStackNavigationProp<AppStackParamList>
>;

export type BattlesScreenViewProps = ReturnType<typeof useBattlesScreen>;

export function useBattlesScreen(navigation: BattlesScreenNavigation) {
  const {
    battles: filteredBattles,
    isLoading: listLoading,
    isRefreshing: listRefreshing,
    listActiveTab,
    error: listError,
    refetch,
    setListActiveTab,
  } = useBattles();

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const onCreateBattle = useCallback(() => {
    navigation.navigate('CreateBattle');
  }, [navigation]);

  const onOpenBattleDetail = useCallback(
    (battleId: string) => {
      navigation.navigate('BattleDetail', { battleId });
    },
    [navigation],
  );

  const onTabChange = useCallback(
    (key: string) => {
      setListActiveTab(key as TabType);
    },
    [setListActiveTab],
  );

  return {
    filteredBattles,
    listLoading,
    listRefreshing,
    listActiveTab,
    listError,
    onRefresh,
    onCreateBattle,
    onOpenBattleDetail,
    onTabChange,
    onRetry: onRefresh,
  };
}

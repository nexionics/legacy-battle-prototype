import { useCallback, useMemo } from 'react';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/shared/hooks/useAuth';
import { useProfile } from '@/features/profile/ui/hooks/useProfile';
import type { AppStackParamList, TabParamList } from '@/app/navigation/types';
import type { Battle, SportsEvent } from '@/shared/types';
import { useHomeData } from './useHomeData';

export type HomeScreenNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<AppStackParamList>
>;

export type HomeScreenViewProps = {
  loading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  displayName: string | undefined;
  username: string | undefined;
  email: string | undefined;
  avatarUrl: string | null | undefined;
  xp: number;
  walletBalance: number;
  quickPicks: Battle[];
  myBattles: Battle[];
  upcomingGames: SportsEvent[];
  recentResults: SportsEvent[];
  onRefreshUpcoming: () => void;
  onViewAllBattles: () => void;
  onBattleDetail: (battleId: string) => void;
  onViewAllUpcoming: () => void;
  onJoinEvent: (event: SportsEvent) => void;
  onStartBattle: () => void;
  onViewAllResults: () => void;
};

export function useHomeScreen(navigation: HomeScreenNavigation): HomeScreenViewProps {
  const { user } = useAuth();
  const {
    upcomingGames,
    recentResults,
    quickPicks,
    myBattles,
    homeLoading,
    homeError,
    refetch,
  } = useHomeData(user?.id);
  const { profile, profileError, refetch: refetchProfile } = useProfile(user?.id);

  const loading = homeLoading;
  const errorMessage = useMemo(
    () => homeError || (user?.id ? profileError : null),
    [homeError, profileError, user?.id],
  );

  const onRetry = useCallback(() => {
    refetch();
    void refetchProfile();
  }, [refetch, refetchProfile]);

  const onViewAllBattles = useCallback(() => {
    navigation.navigate('Battles');
  }, [navigation]);

  const onBattleDetail = useCallback(
    (battleId: string) => {
      navigation.navigate('BattleDetail', { battleId });
    },
    [navigation],
  );

  const onViewAllUpcoming = useCallback(() => {
    navigation.navigate('AllUpcomingGames');
  }, [navigation]);

  const onJoinEvent = useCallback(
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

  const onStartBattle = useCallback(() => {
    navigation.navigate('BattleType');
  }, [navigation]);

  const onViewAllResults = useCallback(() => {
    navigation.navigate('AllResults');
  }, [navigation]);

  return {
    loading,
    errorMessage,
    onRetry,
    displayName: profile?.displayName || user?.displayName,
    username: profile?.username || user?.username,
    email: user?.email,
    avatarUrl: profile?.avatarUrl,
    xp: profile?.xp ?? 0,
    walletBalance: Number(profile?.walletBalance ?? 0),
    quickPicks,
    myBattles,
    upcomingGames,
    recentResults,
    onRefreshUpcoming: refetch,
    onViewAllBattles,
    onBattleDetail,
    onViewAllUpcoming,
    onJoinEvent,
    onStartBattle,
    onViewAllResults,
  };
}

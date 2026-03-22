import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, AppText, LoadingState, ErrorState } from '@/shared/ui';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';
import { useAuth } from '@/features/auth/ui/hooks/useAuth';
import { useProfile } from '@/features/profile/ui/hooks/useProfile';
import { useHomeData } from '../hooks/useHomeData';
import type { AppStackParamList, TabParamList } from '@/app/navigation/types';
import { HomeHeader } from '../components/HomeHeader';
import { StatsCard } from '../components/StatsCard';
import { QuickPicksSection } from '../components/QuickPicksSection';
import { MyBattlesSection } from '../components/MyBattlesSection';
import { UpcomingGamesSection } from '../components/UpcomingGamesSection';
import { RecentResultsSection } from '../components/RecentResultsSection';

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user } = useAuth();
  const { upcomingGames, recentResults, quickPicks, myBattles, homeLoading, homeError, refetch } =
    useHomeData(user?.id);
  const { profile, profileLoading, profileError, refetch: refetchProfile } = useProfile(user?.id);

  const waitingForProfile = Boolean(user?.id) && profileLoading;

  if (homeLoading || waitingForProfile) {
    return (
      <Screen>
        <LoadingState message="Loading home feed..." />
      </Screen>
    );
  }

  const feedError = homeError || (user?.id ? profileError : null);
  if (feedError) {
    return (
      <Screen>
        <ErrorState
          message={feedError}
          onRetry={() => {
            refetch();
            void refetchProfile();
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen padding={0}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <HomeHeader
          displayName={profile?.displayName}
          username={profile?.username}
          email={user?.email}
          avatarUrl={profile?.avatarUrl}
        />
        <StatsCard xp={profile?.xp ?? 0} walletBalance={Number(profile?.walletBalance ?? 0)} />
        <QuickPicksSection
          quickPicks={quickPicks}
          onViewAll={() => navigation.navigate('Battles')}
          onPickPress={(battleId) => navigation.navigate('BattleDetail', { battleId })}
        />
        <MyBattlesSection
          myBattles={myBattles}
          onViewAll={() => navigation.navigate('Battles')}
          onBattlePress={(battleId) => navigation.navigate('BattleDetail', { battleId })}
        />
        <UpcomingGamesSection
          upcomingGames={upcomingGames}
          loading={false}
          onRefresh={() => refetch()}
          onViewAll={() => navigation.navigate('AllUpcomingGames')}
          onJoin={(event) => {
            navigation.navigate('BattleVisibility', {
              prefillTitle: `${event.strHomeTeam} vs ${event.strAwayTeam}`,
              prefillEventId: event.idEvent,
              homeTeam: event.strHomeTeam,
              awayTeam: event.strAwayTeam,
            });
          }}
        />
        <TouchableOpacity
          style={styles.startBattleButton}
          onPress={() => navigation.navigate('BattleType')}
        >
          <AppText variant="buttonLg" style={styles.startBattleText}>
            Start Battle Now
          </AppText>
          <Ionicons name="flash" size={20} color={colors.white} />
        </TouchableOpacity>
        <RecentResultsSection
          recentResults={recentResults}
          loading={false}
          onViewAll={() => navigation.navigate('AllResults')}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  startBattleButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  startBattleText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
});

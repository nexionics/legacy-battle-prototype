import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, LoadingState, ErrorState } from '@/shared/ui';
import If from '@/shared/ui/atoms/If';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';
import { homeScreenStrings } from '@/features/sports/strings';
import type { HomeScreenViewProps } from '../../hooks/useHomeScreen';
import { HomeHeader } from '../../components/HomeHeader';
import { StatsCard } from '../../components/StatsCard';
import { QuickPicksSection } from '../../components/QuickPicksSection';
import { MyBattlesSection } from '../../components/MyBattlesSection';
import { UpcomingGamesSection } from '../../components/UpcomingGamesSection';
import { RecentResultsSection } from '../../components/RecentResultsSection';

export function HomeScreen(props: HomeScreenViewProps) {
  const {
    loading,
    errorMessage,
    onRetry,
    displayName,
    username,
    email,
    avatarUrl,
    xp,
    walletBalance,
    quickPicks,
    myBattles,
    upcomingGames,
    recentResults,
    onRefreshUpcoming,
    onViewAllBattles,
    onBattleDetail,
    onViewAllUpcoming,
    onJoinEvent,
    onStartBattle,
    onViewAllResults,
  } = props;

  const showMain = !loading && !errorMessage;
  const showError = !loading && Boolean(errorMessage);

  return (
    <>
      <If condition={loading}>
        <Screen>
          <LoadingState message={homeScreenStrings.loadingMessage} />
        </Screen>
      </If>
      <If condition={showError}>
        <Screen>
          <ErrorState message={errorMessage ?? ''} onRetry={onRetry} />
        </Screen>
      </If>
      <If condition={showMain}>
        <Screen padding={0} edges={['top', 'left', 'right']}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <HomeHeader
              displayName={displayName}
              username={username}
              email={email}
              avatarUrl={avatarUrl}
            />
            <StatsCard xp={xp} walletBalance={walletBalance} />
            <QuickPicksSection
              quickPicks={quickPicks}
              onViewAll={onViewAllBattles}
              onPickPress={onBattleDetail}
            />
            <MyBattlesSection
              myBattles={myBattles}
              onViewAll={onViewAllBattles}
              onBattlePress={onBattleDetail}
            />
            <UpcomingGamesSection
              upcomingGames={upcomingGames}
              loading={false}
              onRefresh={onRefreshUpcoming}
              onViewAll={onViewAllUpcoming}
              onJoin={onJoinEvent}
            />
            <TouchableOpacity style={styles.startBattleButton} onPress={onStartBattle}>
              <AppText variant="buttonLg" style={styles.startBattleText}>
                {homeScreenStrings.startBattleCta}
              </AppText>
              <Ionicons name="flash" size={20} color={colors.white} />
            </TouchableOpacity>
            <RecentResultsSection
              recentResults={recentResults}
              loading={false}
              onViewAll={onViewAllResults}
            />
          </ScrollView>
        </Screen>
      </If>
    </>
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

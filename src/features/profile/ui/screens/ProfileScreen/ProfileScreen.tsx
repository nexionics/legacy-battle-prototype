import { ScrollView, StyleSheet } from 'react-native';
import { Screen, LoadingState, ErrorState } from '@/shared/ui';
import { spacing } from '@/shared/theme';
import type { ProfileScreenProps } from '@/shared/types';
import { ProfileHeader } from '../../components/ProfileHeader';
import { StatsGrid } from '../../components/StatsGrid';
import { LevelCard } from '../../components/LevelCard';
import { WalletCard } from '../../components/WalletCard';
import { ProfileMenu } from '../../components/ProfileMenu';
import type { UseProfileScreenReturn } from '../../hooks/useProfileScreen';

export type ProfileScreenViewProps = ProfileScreenProps & UseProfileScreenReturn;

export function ProfileScreen({
  profile,
  profileLoading,
  profileError,
  refetchProfile,
  battleStats,
  crewCount,
  followingCount,
  user,
  mode,
  toggleTheme,
  handleLogout,
  onSettingsPress,
  onAchievementsPress,
  onStatisticsPress,
  onCrewPress,
  onWalletPress,
  onNotificationsPress,
  onHelpPress,
  walletBalance,
  xpValue,
  levelInfo,
  profileScreenStrings,
}: ProfileScreenViewProps) {
  if (profileLoading) {
    return (
      <Screen>
        <LoadingState message={profileScreenStrings.loadingMessage} />
      </Screen>
    );
  }

  if (profileError) {
    return (
      <Screen>
        <ErrorState
          title={profileScreenStrings.errorTitle}
          message={profileError}
          onRetry={() => {
            void refetchProfile();
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen padding={0} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ProfileHeader
          displayName={profile?.displayName || user?.displayName || undefined}
          username={profile?.username || user?.username || undefined}
          email={user?.email ?? undefined}
          xp={xpValue}
          avatarUrl={profile?.avatarUrl}
          level={profile?.level}
          onSettingsPress={onSettingsPress}
        />

        <StatsGrid battleStats={battleStats} walletBalance={walletBalance} />

        <LevelCard levelInfo={levelInfo} xp={xpValue} />

        <WalletCard walletBalance={walletBalance} />

        <ProfileMenu
          crewCount={crewCount}
          followingCount={followingCount}
          themeMode={mode}
          onToggleTheme={toggleTheme}
          onAchievementsPress={onAchievementsPress}
          onStatisticsPress={onStatisticsPress}
          onCrewPress={onCrewPress}
          onWalletPress={onWalletPress}
          onNotificationsPress={onNotificationsPress}
          onLogout={handleLogout}
          onHelpPress={onHelpPress}
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
});

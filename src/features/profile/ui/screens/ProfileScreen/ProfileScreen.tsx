import { ScrollView, StyleSheet } from 'react-native';
import If from '@/shared/ui/atoms/If';
import { Screen, LoadingState } from '@/shared/ui';
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
  battleStats,
  crewCount,
  followingCount,
  user,
  mode,
  toggleTheme,
  handleLogout,
  onCrewPress,
  onHelpPress,
  walletBalance,
  xpValue,
  levelInfo,
  profileScreenStrings,
}: ProfileScreenViewProps) {
  return (
    <>
      <If condition={profileLoading}>
        <Screen>
          <LoadingState message={profileScreenStrings.loadingMessage} />
        </Screen>
      </If>

      <If condition={!profileLoading}>
        <Screen padding={0} edges={['top', 'left', 'right']}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <ProfileHeader
              displayName={profile?.displayName || user?.displayName || undefined}
              username={profile?.username || user?.username || undefined}
              email={user?.email ?? undefined}
              xp={xpValue}
              avatarUrl={profile?.avatarUrl}
              level={profile?.level}
            />

            <StatsGrid battleStats={battleStats} walletBalance={walletBalance} />

            <LevelCard levelInfo={levelInfo} xp={xpValue} />

            <WalletCard walletBalance={walletBalance} />

            <ProfileMenu
              crewCount={crewCount}
              followingCount={followingCount}
              themeMode={mode}
              onToggleTheme={toggleTheme}
              onCrewPress={onCrewPress}
              onLogout={handleLogout}
              onHelpPress={onHelpPress}
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
});

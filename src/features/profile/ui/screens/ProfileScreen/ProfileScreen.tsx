import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen, LoadingState, ErrorState } from '@/shared/ui';
import If from '@/shared/ui/atoms/If';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { buildProfileActivityItems, buildProfileStatsItems } from '@/shared/constants';
import { horizontalScale, verticalScale } from '@/shared/theme';
import type { ProfileScreenProps } from '@/shared/types';
import { ProfileHeader } from '../../components/ProfileHeader';
import { StatsGrid } from '../../components/StatsGrid';
import { LevelCard } from '../../components/LevelCard';
import { WalletCard } from '../../components/WalletCard';
import { ProfileCrewCard } from '../../components/ProfileCrewCard';
import { ProfileActivityCard } from '../../components/ProfileActivityCard';
import type { UseProfileScreenReturn } from '../../hooks/useProfileScreen';

export type ProfileScreenViewProps = ProfileScreenProps & UseProfileScreenReturn;

export function ProfileScreen({
  profile,
  profileLoading,
  profileError,
  refetchProfile,
  battleStats,
  crewCount,
  user,
  onBackPress,
  onSettingsPress,
  onCrewPress,
  onWalletPress,
  onNotificationsPress,
  walletBalance,
  xpValue,
  levelInfo,
  profileScreenStrings,
}: ProfileScreenViewProps) {
  const colors = useThemeColors();
  const statsItems = buildProfileStatsItems({
    battleStats,
    levelInfo,
    xpValue,
    strings: profileScreenStrings,
    colors: {
      warning: colors.warning,
      success: colors.success,
      info: colors.info,
    },
  });
  const activityItems = buildProfileActivityItems({
    battleStats,
    strings: profileScreenStrings,
  });

  const avatarLabel = (profile?.displayName || profile?.username || user?.displayName || 'LB')
    .substring(0, 2)
    .toUpperCase();

  return (
    <>
      <If condition={profileLoading}>
        <Screen>
          <LoadingState message={profileScreenStrings.loadingMessage} />
        </Screen>
      </If>

      <If condition={!profileLoading && profileError}>
        <Screen>
          <ErrorState
            title={profileScreenStrings.errorTitle}
            message={profileError ?? ''}
            onRetry={() => {
              void refetchProfile();
            }}
          />
        </Screen>
      </If>

      <If condition={!profileLoading && !profileError}>
        <Screen padding={0} edges={['top', 'left', 'right']}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <LinearGradient colors={['#3A1215', '#18080A']} style={styles.heroSection}>
              <ProfileHeader
                displayName={profile?.displayName || user?.displayName || undefined}
                username={profile?.username || user?.username || undefined}
                email={user?.email ?? undefined}
                xp={xpValue}
                avatarUrl={profile?.avatarUrl}
                level={profile?.level}
                onBackPress={onBackPress}
                onSettingsPress={onSettingsPress}
              />

              <StatsGrid items={statsItems} />
            </LinearGradient>

            <View style={styles.body}>
              <LevelCard
                levelInfo={levelInfo}
                xp={xpValue}
                ctaLabel={profileScreenStrings.inviteBannerLabel}
                onCtaPress={onNotificationsPress}
              />

              <WalletCard
                walletBalance={walletBalance}
                actionLabel={profileScreenStrings.walletAction}
                onPress={onWalletPress}
              />

              <ProfileCrewCard
                title={profileScreenStrings.crewTitle}
                crewCount={crewCount}
                avatarUrl={profile?.avatarUrl}
                avatarLabel={avatarLabel}
                buttonLabel={profileScreenStrings.crewAction}
                onPress={onCrewPress}
              />

              <ProfileActivityCard
                title={profileScreenStrings.recentActivityTitle}
                items={activityItems}
              />
            </View>
          </ScrollView>
        </Screen>
      </If>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: verticalScale(20),
  },
  heroSection: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(24),
  },
  body: {
    paddingHorizontal: horizontalScale(20),
    marginTop: verticalScale(18),
  },
});

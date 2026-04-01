import { Alert } from 'react-native';
import { useAuth } from '@/shared/hooks/useAuth';
import { useAppTheme } from '@/app/providers';
import type { ProfileScreenProps } from '@/shared/types';
import { getLevelInfo } from '../../helpers/level';
import { useProfile } from './useProfile';
import {
  logoutAlertStrings,
  profileMenuComingSoonStrings,
  profileScreenStrings,
} from '../../string';

function showComingSoon(message: string) {
  Alert.alert(profileMenuComingSoonStrings.title, message);
}

export function useProfileScreen({ navigation }: Pick<ProfileScreenProps, 'navigation'>) {
  const { signOut, user } = useAuth();
  const { mode, toggleTheme } = useAppTheme();
  const {
    profile,
    profileLoading,
    profileError,
    battleStats,
    crewCount,
    crewPreviewMembers,
    followingCount,
    refetch,
  } = useProfile(user?.id);

  const handleLogout = () => {
    Alert.alert(logoutAlertStrings.title, logoutAlertStrings.message, [
      { text: logoutAlertStrings.cancel, style: 'cancel' },
      {
        text: logoutAlertStrings.confirm,
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  const walletBalance = Number(profile?.walletBalance || 0).toFixed(2);
  const xpValue = profile?.xp || 0;
  const levelInfo = getLevelInfo(xpValue, profile?.level);

  return {
    profile,
    profileLoading,
    profileError,
    refetchProfile: refetch,
    battleStats,
    crewCount,
    crewPreviewMembers,
    followingCount,
    user,
    mode,
    toggleTheme,
    handleLogout,
    onBackPress: () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    },
    onSettingsPress: () => navigation.navigate('Settings'),
    onAchievementsPress: () => showComingSoon(profileMenuComingSoonStrings.achievements),
    onStatisticsPress: () => showComingSoon(profileMenuComingSoonStrings.statistics),
    onCrewPress: () => navigation.navigate('Friends'),
    onWalletPress: () => showComingSoon(profileMenuComingSoonStrings.wallet),
    onNotificationsPress: () => showComingSoon(profileMenuComingSoonStrings.notifications),
    onHelpPress: () => navigation.navigate('ContactUs'),
    walletBalance,
    xpValue,
    levelInfo,
    profileScreenStrings,
  };
}

export type UseProfileScreenReturn = ReturnType<typeof useProfileScreen>;

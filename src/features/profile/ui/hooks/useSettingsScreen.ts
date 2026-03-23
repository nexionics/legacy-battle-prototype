import { Alert } from 'react-native';
import { useToast } from '@/app/providers/useToast';
import type { SettingsScreenProps, UpdateUserPreferences } from '@/shared/types';
import { logoutSession } from '@/features/auth/data/logoutSession';
import { logoutAlertStrings, settingsScreenStrings } from '../../string';
import { usePreferencesQuery } from '../../data/queries/usePreferencesQuery';
import { useUpdatePreferences } from '../../data/mutations/useUpdatePreferences';

export function useSettingsScreen({ navigation }: Pick<SettingsScreenProps, 'navigation'>) {
  const { data: preferencesData, isLoading } = usePreferencesQuery();
  const updatePreferences = useUpdatePreferences();
  const { showToast } = useToast();

  const preferences =
    preferencesData && 'success' in preferencesData && preferencesData.success
      ? preferencesData.data
      : null;

  const togglePreference = (key: keyof UpdateUserPreferences) => {
    if (!preferences || !('bcUpdatesEnabled' in preferences)) return;
    const currentValue = preferences[key as keyof typeof preferences];
    updatePreferences.mutate({ [key]: !currentValue });
  };

  const handleLogout = () => {
    Alert.alert(logoutAlertStrings.title, logoutAlertStrings.message, [
      { text: logoutAlertStrings.cancel, style: 'cancel' },
      {
        text: logoutAlertStrings.confirm,
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutSession();
          } catch {
            showToast('fail', settingsScreenStrings.logoutFailedToast);
          }
        },
      },
    ]);
  };

  return {
    preferences,
    isLoading,
    togglePreference,
    handleLogout,
    settingsScreenStrings,
    onBack: () => navigation.goBack(),
    onNavigateAccountDetails: () => navigation.navigate('AccountDetails'),
    onNavigateSecurityPrivacy: () => navigation.navigate('SecurityPrivacy'),
    onNavigateTerms: () => navigation.navigate('TermsOfService'),
    onNavigatePrivacy: () => navigation.navigate('PrivacyPolicy'),
    onNavigateContact: () => navigation.navigate('ContactUs'),
  };
}

export type UseSettingsScreenReturn = ReturnType<typeof useSettingsScreen>;

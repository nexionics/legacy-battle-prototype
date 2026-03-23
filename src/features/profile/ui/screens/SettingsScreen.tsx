import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { spacing, radii } from '@/shared/theme';
import { AppText, Screen, ScreenHeader, SettingSection, SettingRow } from '@/shared/ui';
import type { SettingsScreenProps, UpdateUserPreferences } from '@/shared/types';
import { usePreferencesQuery } from '../../data/queries/usePreferencesQuery';
import { useUpdatePreferences } from '../../data/mutations/useUpdatePreferences';
import { ActivityIndicator, Alert } from 'react-native';
import { useToast } from '@/app/providers/useToast';
import { logoutSession } from '@/features/auth/data/logoutSession';

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const colors = useThemeColors();
  const { data: preferencesData, isLoading, error } = usePreferencesQuery();
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
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutSession();
          } catch (error) {
            showToast('fail', 'Failed to log out. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <Screen scroll padding={spacing[4]}>
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} style={styles.header} />

      <SettingSection title="ACCOUNT">
        <SettingRow
          icon="person-outline"
          title="Account Details"
          subtitle="Personal Information's"
          onPress={() => navigation.navigate('AccountDetails')}
          iconColor="#33A0FF"
          iconBgColor="#0088FF33"
        />
        <SettingRow
          icon="lock-closed-outline"
          title="Security & Privacy"
          subtitle="Private Details"
          onPress={() => navigation.navigate('SecurityPrivacy')}
          iconColor="#FF6B3D"
          iconBgColor="#FF6B3D33"
        />
      </SettingSection>

      <SettingSection
        icon="notifications-outline"
        title="Notifications"
        subtitle="Manage Your Notification Preferences"
      >
        <SettingRow
          icon="flash-outline"
          title="Challenge Details"
          subtitle="Personal Information's"
          showChevron={false}
          iconColor="#EF4444"
          iconBgColor="#EF444433"
          rightSlot={
            isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <TouchableOpacity onPress={() => togglePreference('challengeDetailsEnabled')}>
                <View
                  style={[
                    styles.switchTrack,
                    {
                      backgroundColor:
                        preferences &&
                        'challengeDetailsEnabled' in preferences &&
                        preferences.challengeDetailsEnabled
                          ? colors.primary
                          : colors.black,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      {
                        transform: [
                          {
                            translateX:
                              preferences &&
                              'challengeDetailsEnabled' in preferences &&
                              preferences.challengeDetailsEnabled
                                ? 20
                                : 0,
                          },
                        ],
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            )
          }
        />
        <SettingRow
          icon="card-outline"
          title="Bc Updates"
          subtitle="Personal Information's"
          showChevron={false}
          iconColor="#FDE047"
          iconBgColor="#FDE04733"
          rightSlot={
            isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <TouchableOpacity onPress={() => togglePreference('bcUpdatesEnabled')}>
                <View
                  style={[
                    styles.switchTrack,
                    {
                      backgroundColor:
                        preferences &&
                        'bcUpdatesEnabled' in preferences &&
                        preferences.bcUpdatesEnabled
                          ? colors.primary
                          : colors.black,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      {
                        transform: [
                          {
                            translateX:
                              preferences &&
                              'bcUpdatesEnabled' in preferences &&
                              preferences.bcUpdatesEnabled
                                ? 20
                                : 0,
                          },
                        ],
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            )
          }
        />
        <SettingRow
          icon="settings-outline"
          title="System Updates"
          subtitle="Personal Information's"
          showChevron={false}
          iconColor="#94A3B8"
          iconBgColor="#94A3B833"
          rightSlot={
            isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <TouchableOpacity onPress={() => togglePreference('systemUpdatesEnabled')}>
                <View
                  style={[
                    styles.switchTrack,
                    {
                      backgroundColor:
                        preferences &&
                        'systemUpdatesEnabled' in preferences &&
                        preferences.systemUpdatesEnabled
                          ? colors.primary
                          : colors.black,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      {
                        transform: [
                          {
                            translateX:
                              preferences &&
                              'systemUpdatesEnabled' in preferences &&
                              preferences.systemUpdatesEnabled
                                ? 20
                                : 0,
                          },
                        ],
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            )
          }
        />
      </SettingSection>

      <SettingSection
        icon="notifications-outline"
        title="Legal & Support"
        subtitle="Manage Your Notification Preferences"
      >
        <SettingRow
          icon="document-text-outline"
          title="Terms Of Service"
          subtitle="Personal Information's"
          onPress={() => navigation.navigate('TermsOfService')}
          iconColor="#FFD3A3"
          iconBgColor="#FEEEE633"
        />
        <SettingRow
          icon="shield-checkmark-outline"
          title="Privacy & Policy"
          subtitle="Personal Information's"
          onPress={() => navigation.navigate('PrivacyPolicy')}
          iconColor="#FFD3A3"
          iconBgColor="#FEEEE633"
        />
        <SettingRow
          icon="mail-outline"
          title="Contact Us"
          subtitle="Personal Information's"
          onPress={() => navigation.navigate('ContactUs')}
          iconColor="#FFD3A3"
          iconBgColor="#FEEEE633"
        />
      </SettingSection>

      <View style={styles.footer}>
        <AppText variant="captionSm" style={[styles.versionText, { color: colors.textSecondary }]}>
          Version 1.0.0
        </AppText>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: colors.error + '20', borderColor: colors.error + '40' },
          ]}
          onPress={handleLogout}
        >
          <AppText variant="buttonMd" style={{ color: colors.error }}>
            Log Out
          </AppText>
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colors.error}
            style={styles.logoutIcon}
          />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing[4],
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  footer: {
    marginTop: spacing[4],
    marginBottom: spacing[6],
    alignItems: 'center',
  },
  versionText: {
    marginBottom: spacing[4],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: spacing[4],
    borderRadius: radii.xl,
    borderWidth: 1,
  },
  logoutIcon: {
    marginLeft: spacing[2],
  },
});

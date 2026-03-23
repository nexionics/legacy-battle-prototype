import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { spacing, radii, borderWidths, sizes } from '@/shared/theme';
import { profileScreenLayout } from '../../theme/profileScreenLayout';
import { settingsRowAccents } from '../../theme/settingsRowAccents';
import { AppText, Screen, ScreenHeader, SettingSection, SettingRow } from '@/shared/ui';
import type { SettingsScreenProps } from '@/shared/types';
import type { UseSettingsScreenReturn } from '../../hooks/useSettingsScreen';

export type SettingsScreenViewProps = SettingsScreenProps & UseSettingsScreenReturn;

export function SettingsScreen({
  preferences,
  isLoading,
  togglePreference,
  handleLogout,
  settingsScreenStrings,
  onBack,
  onNavigateAccountDetails,
  onNavigateSecurityPrivacy,
  onNavigateTerms,
  onNavigatePrivacy,
  onNavigateContact,
}: SettingsScreenViewProps) {
  const colors = useThemeColors();

  return (
    <Screen scroll padding={spacing[4]}>
      <ScreenHeader title={settingsScreenStrings.headerTitle} onBack={onBack} style={styles.header} />

      <SettingSection title={settingsScreenStrings.sectionAccount}>
        <SettingRow
          icon="person-outline"
          title={settingsScreenStrings.accountDetails.title}
          subtitle={settingsScreenStrings.accountDetails.subtitle}
          onPress={onNavigateAccountDetails}
          iconColor={settingsRowAccents.account.iconColor}
          iconBgColor={settingsRowAccents.account.iconBgColor}
        />
        <SettingRow
          icon="lock-closed-outline"
          title={settingsScreenStrings.securityPrivacy.title}
          subtitle={settingsScreenStrings.securityPrivacy.subtitle}
          onPress={onNavigateSecurityPrivacy}
          iconColor={settingsRowAccents.security.iconColor}
          iconBgColor={settingsRowAccents.security.iconBgColor}
        />
      </SettingSection>

      <SettingSection
        icon="notifications-outline"
        title={settingsScreenStrings.sectionNotifications.title}
        subtitle={settingsScreenStrings.sectionNotifications.subtitle}
      >
        <SettingRow
          icon="flash-outline"
          title={settingsScreenStrings.challengeDetails.title}
          subtitle={settingsScreenStrings.challengeDetails.subtitle}
          showChevron={false}
          iconColor={settingsRowAccents.challenge.iconColor}
          iconBgColor={settingsRowAccents.challenge.iconBgColor}
          rightSlot={
            isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <TouchableOpacity onPress={() => togglePreference('challengeDetailsEnabled')}>
                <View
                  style={[
                    styles.switchTrack,
                    {
                      borderColor: colors.inputBorder,
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
                        backgroundColor: colors.white,
                        transform: [
                          {
                            translateX:
                              preferences &&
                              'challengeDetailsEnabled' in preferences &&
                              preferences.challengeDetailsEnabled
                                ? profileScreenLayout.switchThumbTravelX
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
          title={settingsScreenStrings.bcUpdates.title}
          subtitle={settingsScreenStrings.bcUpdates.subtitle}
          showChevron={false}
          iconColor={settingsRowAccents.bcUpdates.iconColor}
          iconBgColor={settingsRowAccents.bcUpdates.iconBgColor}
          rightSlot={
            isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <TouchableOpacity onPress={() => togglePreference('bcUpdatesEnabled')}>
                <View
                  style={[
                    styles.switchTrack,
                    {
                      borderColor: colors.inputBorder,
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
                        backgroundColor: colors.white,
                        transform: [
                          {
                            translateX:
                              preferences &&
                              'bcUpdatesEnabled' in preferences &&
                              preferences.bcUpdatesEnabled
                                ? profileScreenLayout.switchThumbTravelX
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
          title={settingsScreenStrings.systemUpdates.title}
          subtitle={settingsScreenStrings.systemUpdates.subtitle}
          showChevron={false}
          iconColor={settingsRowAccents.system.iconColor}
          iconBgColor={settingsRowAccents.system.iconBgColor}
          rightSlot={
            isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <TouchableOpacity onPress={() => togglePreference('systemUpdatesEnabled')}>
                <View
                  style={[
                    styles.switchTrack,
                    {
                      borderColor: colors.inputBorder,
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
                        backgroundColor: colors.white,
                        transform: [
                          {
                            translateX:
                              preferences &&
                              'systemUpdatesEnabled' in preferences &&
                              preferences.systemUpdatesEnabled
                                ? profileScreenLayout.switchThumbTravelX
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
        title={settingsScreenStrings.sectionLegal.title}
        subtitle={settingsScreenStrings.sectionLegal.subtitle}
      >
        <SettingRow
          icon="document-text-outline"
          title={settingsScreenStrings.termsOfService.title}
          subtitle={settingsScreenStrings.termsOfService.subtitle}
          onPress={onNavigateTerms}
          iconColor={settingsRowAccents.legal.iconColor}
          iconBgColor={settingsRowAccents.legal.iconBgColor}
        />
        <SettingRow
          icon="shield-checkmark-outline"
          title={settingsScreenStrings.privacyPolicy.title}
          subtitle={settingsScreenStrings.privacyPolicy.subtitle}
          onPress={onNavigatePrivacy}
          iconColor={settingsRowAccents.legal.iconColor}
          iconBgColor={settingsRowAccents.legal.iconBgColor}
        />
        <SettingRow
          icon="mail-outline"
          title={settingsScreenStrings.contactUs.title}
          subtitle={settingsScreenStrings.contactUs.subtitle}
          onPress={onNavigateContact}
          iconColor={settingsRowAccents.legal.iconColor}
          iconBgColor={settingsRowAccents.legal.iconBgColor}
        />
      </SettingSection>

      <View style={styles.footer}>
        <AppText variant="captionSm" style={[styles.versionText, { color: colors.textSecondary }]}>
          {settingsScreenStrings.version}
        </AppText>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: colors.error + '20', borderColor: colors.error + '40' },
          ]}
          onPress={handleLogout}
        >
          <AppText variant="buttonMd" style={{ color: colors.error }}>
            {settingsScreenStrings.logOut}
          </AppText>
          <Ionicons
            name="log-out-outline"
            size={sizes.icon20}
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
    width: profileScreenLayout.switchTrackWidth,
    height: profileScreenLayout.switchTrackHeight,
    borderRadius: profileScreenLayout.switchTrackBorderRadius,
    padding: profileScreenLayout.switchPadding,
    justifyContent: 'center',
    borderWidth: borderWidths.hairline,
  },
  switchThumb: {
    width: profileScreenLayout.switchThumbWidth,
    height: profileScreenLayout.switchThumbHeight,
    borderRadius: profileScreenLayout.switchThumbBorderRadius,
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
    borderWidth: borderWidths.hairline,
  },
  logoutIcon: {
    marginLeft: spacing[2],
  },
});

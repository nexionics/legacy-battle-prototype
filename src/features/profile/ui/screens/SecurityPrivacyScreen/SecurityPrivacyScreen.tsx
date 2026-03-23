import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { spacing, radii, borderWidths, lineHeights } from '@/shared/theme';
import { profileScreenLayout } from '../../theme/profileScreenLayout';
import { settingsRowAccents } from '../../theme/settingsRowAccents';
import { AppText, Screen, ScreenHeader, SettingSection, SettingRow } from '@/shared/ui';
import type { SecurityPrivacyScreenProps } from '@/shared/types';
import type { UseSecurityPrivacyScreenReturn } from '../../hooks/useSecurityPrivacyScreen';

export type SecurityPrivacyScreenViewProps = SecurityPrivacyScreenProps &
  UseSecurityPrivacyScreenReturn;

export function SecurityPrivacyScreen({
  biometricsEnabled,
  isLoading,
  isToggling,
  biometricsAvailable,
  toggleBiometrics,
  securityPrivacyScreenStrings,
  onBack,
  onNavigateChangePassword,
}: SecurityPrivacyScreenViewProps) {
  const colors = useThemeColors();

  return (
    <Screen scroll padding={spacing[4]}>
      <ScreenHeader
        title={securityPrivacyScreenStrings.headerTitle}
        onBack={onBack}
        style={styles.header}
      />

      <SettingSection style={styles.menuSection}>
        <SettingRow
          icon="key-outline"
          title={securityPrivacyScreenStrings.changePassword.title}
          subtitle={securityPrivacyScreenStrings.changePassword.subtitle}
          onPress={onNavigateChangePassword}
          iconColor={settingsRowAccents.changePassword.iconColor}
          iconBgColor={settingsRowAccents.changePassword.iconBgColor}
        />
        <SettingRow
          icon="finger-print"
          title={securityPrivacyScreenStrings.biometric.title}
          subtitle={
            !biometricsAvailable
              ? securityPrivacyScreenStrings.biometric.subtitleUnavailable
              : biometricsEnabled
                ? securityPrivacyScreenStrings.biometric.subtitleEnabled
                : securityPrivacyScreenStrings.biometric.subtitleDisabled
          }
          showChevron={false}
          iconColor={settingsRowAccents.biometric.iconColor}
          iconBgColor={settingsRowAccents.biometric.iconBgColor}
          rightSlot={
            isLoading || isToggling ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <TouchableOpacity
                onPress={() => toggleBiometrics(!biometricsEnabled)}
                disabled={!biometricsAvailable}
              >
                <View
                  style={[
                    styles.switchTrack,
                    {
                      borderColor: colors.inputBorder,
                      backgroundColor: biometricsEnabled ? colors.primary : colors.black,
                      opacity: biometricsAvailable ? 1 : 0.5,
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
                            translateX: biometricsEnabled
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

      <View style={styles.infoContainer}>
        <AppText variant="captionSm" style={[styles.infoText, { color: colors.textSecondary }]}>
          {biometricsAvailable
            ? securityPrivacyScreenStrings.infoAvailable
            : securityPrivacyScreenStrings.infoUnavailable}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing[4],
  },
  menuSection: {
    borderRadius: radii.lg,
    marginBottom: spacing[4],
    overflow: 'hidden',
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
  infoContainer: {
    marginTop: spacing[4],
    paddingHorizontal: spacing[2],
  },
  infoText: {
    textAlign: 'center',
    lineHeight: lineHeights.sm,
  },
});

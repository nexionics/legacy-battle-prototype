import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { spacing } from '@/shared/theme';
import { AppText, Screen, ScreenHeader, SettingSection, SettingRow } from '@/shared/ui';
import type { RootStackScreenProps } from '@/shared/types/navigation';
type SecurityPrivacyScreenProps = RootStackScreenProps<'SecurityPrivacy'>;
import { useToast } from '@/app/providers/useToast';
import {
  getBiometricsEnrolled,
  getBiometricsRequested,
  setBiometricsRequested,
} from '@/features/auth/data/biometricSecureStorage';
import { checkBiometricsAvailable, enrollBiometrics } from '@/features/auth/lib/biometrics';
import { useAuthStore } from '@/features/auth/data/store/auth.store';

export default function SecurityPrivacyScreen({ navigation }: SecurityPrivacyScreenProps) {
  const colors = useThemeColors();
  const { showToast } = useToast();
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const user = useAuthStore((s) => s.user);
  const deviceId = useAuthStore((s) => s.deviceId);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    void loadBiometricStatus();
  }, []);

  const loadBiometricStatus = async () => {
    try {
      setIsLoading(true);
      const { available } = await checkBiometricsAvailable();
      setBiometricsAvailable(available);

      if (available) {
        const enrolled = await getBiometricsEnrolled();
        const requested = await getBiometricsRequested();
        setBiometricsEnabled(enrolled || requested);
      }
    } catch (error) {
      console.error('[SecurityPrivacy] Error loading biometric status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBiometrics = async (enabled: boolean) => {
    if (!biometricsAvailable) {
      showToast('fail', 'Biometric authentication is not available on this device');
      return;
    }

    setIsToggling(true);
    try {
      if (enabled) {
        // User wants to enable biometrics
        if (!deviceId || !user?.email || !accessToken) {
          showToast('fail', 'Unable to enable biometrics. Please try logging in again.');
          return;
        }

        const enrolled = await getBiometricsEnrolled();
        if (!enrolled) {
          // Need to enroll
          const result = await enrollBiometrics(accessToken, user.email, deviceId);
          if (result.ok) {
            await setBiometricsRequested(true);
            setBiometricsEnabled(true);
            showToast('success', 'Biometric authentication enabled successfully!');
          } else {
            showToast('fail', 'Failed to enable biometric authentication');
            setBiometricsEnabled(false);
          }
        } else {
          // Already enrolled, just update preference
          await setBiometricsRequested(true);
          setBiometricsEnabled(true);
          showToast('success', 'Biometric authentication enabled');
        }
      } else {
        // User wants to disable biometrics
        await setBiometricsRequested(false);
        setBiometricsEnabled(false);
        showToast('success', 'Biometric authentication disabled');
      }
    } catch (error) {
      console.error('[SecurityPrivacy] Error toggling biometrics:', error);
      showToast('fail', 'An error occurred. Please try again.');
      setBiometricsEnabled(!enabled);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Screen scroll padding={spacing[4]}>
      <ScreenHeader
        title="Security & Privacy"
        onBack={() => navigation.goBack()}
        style={styles.header}
      />

      <SettingSection
        icon="lock-closed-outline"
        title="Authentication"
        subtitle="Manage your authentication preferences"
      >
        <SettingRow
          icon="finger-print"
          title="Biometric Authentication"
          subtitle={
            !biometricsAvailable
              ? 'Not available on this device'
              : biometricsEnabled
                ? 'Enabled'
                : 'Disabled'
          }
          showChevron={false}
          iconColor="#10B981"
          iconBgColor="#10B98133"
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
                      backgroundColor: biometricsEnabled ? colors.primary : colors.black,
                      opacity: biometricsAvailable ? 1 : 0.5,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      {
                        transform: [
                          {
                            translateX: biometricsEnabled ? 20 : 0,
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
            ? 'Enable biometric authentication to quickly and securely log in to your account using your fingerprint or face.'
            : 'Biometric authentication is not available on this device. You may need to set up biometrics in your device settings first.'}
        </AppText>
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
  infoContainer: {
    marginTop: spacing[4],
    paddingHorizontal: spacing[2],
  },
  infoText: {
    textAlign: 'center',
    lineHeight: 20,
  },
});

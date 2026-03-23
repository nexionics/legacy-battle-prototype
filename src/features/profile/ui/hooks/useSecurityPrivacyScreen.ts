import { useState, useEffect } from 'react';
import { useToast } from '@/app/providers/useToast';
import type { SecurityPrivacyScreenProps } from '@/shared/types';
import {
  getBiometricsEnrolled,
  getBiometricsRequested,
  setBiometricsRequested,
} from '@/features/auth/data/biometricSecureStorage';
import { checkBiometricsAvailable, enrollBiometrics } from '@/features/auth/lib/biometrics';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import { securityPrivacyScreenStrings } from '../../string';

export function useSecurityPrivacyScreen({
  navigation,
}: Pick<SecurityPrivacyScreenProps, 'navigation'>) {
  const { showToast } = useToast();
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const user = useAuthStore((s) => s.user);
  const deviceId = useAuthStore((s) => s.deviceId);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setBiometricEnabledStore = useAuthStore((s) => s.setBiometricEnabled);
  const isBiometricEnabledStore = useAuthStore((s) => s.isBiometricEnabled);

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
        const enabled = enrolled || requested;
        setBiometricsEnabled(enabled);
        if (enabled !== isBiometricEnabledStore) {
          setBiometricEnabledStore(enabled);
        }
      }
    } catch (error) {
      console.error('[SecurityPrivacy] Error loading biometric status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBiometrics = async (enabled: boolean) => {
    if (!biometricsAvailable) {
      showToast('fail', securityPrivacyScreenStrings.toast.unavailable);
      return;
    }

    setIsToggling(true);
    try {
      if (enabled) {
        if (!deviceId || !user?.email || !accessToken) {
          showToast('fail', securityPrivacyScreenStrings.toast.enableMissingSession);
          return;
        }

        const enrolled = await getBiometricsEnrolled();
        if (!enrolled) {
          const result = await enrollBiometrics(accessToken, user.email, deviceId);
          if (result.ok) {
            await setBiometricsRequested(true);
            setBiometricsEnabled(true);
            setBiometricEnabledStore(true);
            showToast('success', securityPrivacyScreenStrings.toast.enableSuccess);
          } else {
            showToast('fail', securityPrivacyScreenStrings.toast.enableFailed);
            setBiometricsEnabled(false);
            setBiometricEnabledStore(false);
          }
        } else {
          await setBiometricsRequested(true);
          setBiometricsEnabled(true);
          setBiometricEnabledStore(true);
          showToast('success', securityPrivacyScreenStrings.toast.enabled);
        }
      } else {
        await setBiometricsRequested(false);
        setBiometricsEnabled(false);
        setBiometricEnabledStore(false);
        showToast('success', securityPrivacyScreenStrings.toast.disabled);
      }
    } catch (error) {
      console.error('[SecurityPrivacy] Error toggling biometrics:', error);
      showToast('fail', securityPrivacyScreenStrings.toast.genericError);
      setBiometricsEnabled(!enabled);
    } finally {
      setIsToggling(false);
    }
  };

  return {
    biometricsEnabled,
    isLoading,
    isToggling,
    biometricsAvailable,
    toggleBiometrics,
    securityPrivacyScreenStrings,
    onBack: () => navigation.goBack(),
    onNavigateChangePassword: () => navigation.navigate('ChangePassword'),
  };
}

export type UseSecurityPrivacyScreenReturn = ReturnType<typeof useSecurityPrivacyScreen>;

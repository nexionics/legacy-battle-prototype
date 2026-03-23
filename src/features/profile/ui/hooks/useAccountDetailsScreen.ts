import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { useToast } from '@/app/providers/useToast';
import { useAuth } from '@/features/auth/ui/hooks/useAuth';
import { useProfile } from './useProfile';
import { useProfileStore } from '../../data/store/profile.store';
import { useUpdateAvatar } from '../../data/mutations/useUpdateAvatar';
import type { AccountDetailsScreenProps } from '@/shared/types';
import { accountDetailsScreenStrings } from '../../string';
import { useAuthStore } from '@/features/auth';
import { getBiometricSecureItem } from '@/features/auth/data/biometricSecureStorage';

export function useAccountDetailsScreen({ navigation }: Pick<AccountDetailsScreenProps, 'navigation'>) {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const { avatarVersion, setAvatarVersion } = useProfileStore();
  const updateAvatar = useUpdateAvatar(user?.id);
  const { showToast } = useToast();
  const setLocallyUnlocked = useAuthStore((s) => s.setLocallyUnlocked);
  const [resolvedEmail, setResolvedEmail] = useState(user?.email ?? '');

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const fallbackEmail = await getBiometricSecureItem('biometric_email');
      if (cancelled) return;
      setResolvedEmail(user?.email || fallbackEmail || '');
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const displayName =
    profile?.displayName ||
    user?.displayName ||
    user?.username ||
    accountDetailsScreenStrings.defaultDisplayName;
  const email = resolvedEmail || accountDetailsScreenStrings.defaultEmail;
  const avatarUrl = profile?.avatarUrl ? `${profile.avatarUrl}?v=${avatarVersion}` : null;

  const handleEditAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    // Native pickers can momentarily background the app and trigger biometric lock.
    // Keep the current session unlocked when control returns to this flow.
    setLocallyUnlocked(true);

    if (!result.canceled && result.assets[0].uri) {
      try {
        await updateAvatar.mutateAsync(result.assets[0].uri);
        setAvatarVersion(Date.now());
        showToast('success', accountDetailsScreenStrings.avatarUpdatedToast);
      } catch {
        showToast('fail', accountDetailsScreenStrings.avatarUpdateFailedToast);
      }
    }
  };

  return {
    displayName,
    email,
    avatarUrl,
    updateAvatarPending: updateAvatar.isPending,
    handleEditAvatar,
    accountDetailsScreenStrings,
    onBack: () => navigation.goBack(),
    onEditUsername: () => navigation.navigate('EditUsername'),
    onEditEmail: () => navigation.navigate('EditEmail'),
  };
}

export type UseAccountDetailsScreenReturn = ReturnType<typeof useAccountDetailsScreen>;

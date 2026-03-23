import { useState, useEffect } from 'react';
import { useToast } from '@/app/providers/useToast';
import { getCheckUsername } from '@/features/auth/data/api/authApi';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import { useUpdateProfile } from '../../data/mutations/useUpdateProfile';
import { useProfile } from './useProfile';
import type { EditUsernameScreenProps } from '@/shared/types';
import { editUsernameScreenStrings } from '../../string';
import { formatUsernameForApi } from '@/shared/utils/helpers';

export function useEditUsernameScreen({ navigation }: Pick<EditUsernameScreenProps, 'navigation'>) {
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const { profile } = useProfile(user?.id);

  const [username, setUsername] = useState('');

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const updateProfileMutation = useUpdateProfile(user?.id);

  const currentUsername = profile?.username ?? '';
  const currentDisplayName = profile?.displayName ?? '';
  const displayNamePlaceholder = currentDisplayName || editUsernameScreenStrings.placeholder;

  useEffect(() => {
    setUsername(currentDisplayName);
  }, [currentDisplayName]);

  const trimmedUsername = username.trim();
  const normalizedUsername = formatUsernameForApi(trimmedUsername);

  useEffect(() => {
    if (!trimmedUsername || normalizedUsername === currentUsername) {
      setIsAvailable(null);
      setStatusMessage('');
      return;
    }

    if (normalizedUsername.length < 3) {
      setIsAvailable(false);
      setStatusMessage(editUsernameScreenStrings.validation.minLength);
      return;
    }

    const timer = setTimeout(async () => {
      setIsChecking(true);
      try {
        const result = await getCheckUsername(normalizedUsername);
        if (result.success) {
          setIsAvailable(result.data.available);
          setStatusMessage(result.data.message);
        } else {
          setIsAvailable(false);
          setStatusMessage(editUsernameScreenStrings.validation.checkError);
        }
      } catch {
        setIsAvailable(false);
        setStatusMessage(editUsernameScreenStrings.validation.checkError);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [trimmedUsername, normalizedUsername, currentUsername]);

  const handleSave = async () => {
    if (!trimmedUsername || normalizedUsername === currentUsername) {
      showToast('fail', editUsernameScreenStrings.toast.enterNew);
      return;
    }

    if (isAvailable === false) {
      showToast('fail', editUsernameScreenStrings.toast.notAvailable);
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        username: normalizedUsername,
        displayName: trimmedUsername,
      });
      showToast('success', editUsernameScreenStrings.toast.success);


      navigation.goBack();
    } catch (error: any) {
      const msg = error?.response?.data?.message || editUsernameScreenStrings.toast.updateFailed;
      showToast('fail', msg);
    }
  };

  return {
    username,
    handleUsernameChange,
    isChecking,
    isAvailable,
    statusMessage,
    profileUsername: currentUsername,
    displayNamePlaceholder,
    updateProfilePending: updateProfileMutation.isPending,
    handleSave,
    editUsernameScreenStrings,
    onBeforeBack: () => navigation.goBack(),
  };
}

export type UseEditUsernameScreenReturn = ReturnType<typeof useEditUsernameScreen>;

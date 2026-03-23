import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/providers/useToast';
import { getCheckUsername } from '@/features/auth/data/api/authApi';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import { useUpdateProfile } from '../../data/mutations/useUpdateProfile';
import { useProfile } from './useProfile';
import { profileKeys } from '../../data/keys';
import type { EditUsernameScreenProps } from '@/shared/types';
import { editUsernameScreenStrings } from '../../string';

export function useEditUsernameScreen({ navigation }: Pick<EditUsernameScreenProps, 'navigation'>) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const { profile } = useProfile(user?.id);

  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const updateProfileMutation = useUpdateProfile(user?.id);

  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
  }, [profile?.username]);

  useEffect(() => {
    if (!username || username === profile?.username) {
      setIsAvailable(null);
      setStatusMessage('');
      return;
    }

    if (username.length < 3) {
      setIsAvailable(false);
      setStatusMessage(editUsernameScreenStrings.validation.minLength);
      return;
    }

    const timer = setTimeout(async () => {
      setIsChecking(true);
      try {
        const result = await getCheckUsername(username);
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
  }, [username, profile?.username]);

  const handleSave = async () => {
    if (!username || username === profile?.username) {
      showToast('fail', editUsernameScreenStrings.toast.enterNew);
      return;
    }

    if (isAvailable === false) {
      showToast('fail', editUsernameScreenStrings.toast.notAvailable);
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({ username });
      showToast('success', editUsernameScreenStrings.toast.success);

      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(user.id) });
      }

      navigation.goBack();
    } catch (error: any) {
      const msg = error?.response?.data?.message || editUsernameScreenStrings.toast.updateFailed;
      showToast('fail', msg);
    }
  };

  return {
    username,
    setUsername,
    isChecking,
    isAvailable,
    statusMessage,
    profileUsername: profile?.username,
    updateProfilePending: updateProfileMutation.isPending,
    handleSave,
    editUsernameScreenStrings,
    onBeforeBack: () => navigation.goBack(),
  };
}

export type UseEditUsernameScreenReturn = ReturnType<typeof useEditUsernameScreen>;

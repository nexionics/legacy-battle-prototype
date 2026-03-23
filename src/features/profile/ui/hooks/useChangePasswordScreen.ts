import { useState } from 'react';
import * as yup from 'yup';
import { useToast } from '@/app/providers/useToast';
import type { ChangePasswordScreenProps } from '@/shared/types';
import { useChangePassword } from '../../data/mutations/useChangePassword';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import { changePasswordScreenStrings } from '../../string';
import { changePasswordSchema } from './validations';

export function useChangePasswordScreen({ navigation }: Pick<ChangePasswordScreenProps, 'navigation'>) {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const user = useAuthStore((state) => state.user);
  const changePasswordMutation = useChangePassword(user?.id);

  const getErrorMessage = (error: unknown): string => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: unknown }).response === 'object' &&
      (error as { response?: unknown }).response !== null
    ) {
      const response = (error as { response: { data?: unknown } }).response;
      if (
        typeof response.data === 'object' &&
        response.data !== null &&
        'message' in response.data &&
        typeof (response.data as { message?: unknown }).message === 'string'
      ) {
        return (response.data as { message: string }).message;
      }
    }
    return changePasswordScreenStrings.toast.changeFailed;
  };

  const handleSave = async () => {
    try {
      await changePasswordSchema.validate(
        {
          oldPassword: currentPassword,
          newPassword,
          confirmPassword,
        },
        { abortEarly: true },
      );
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        showToast('fail', error.message);
      } else {
        showToast('fail', changePasswordScreenStrings.toast.changeFailed);
      }
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        oldPassword: currentPassword,
        newPassword,
      });
      showToast('success', changePasswordScreenStrings.toast.success);
      navigation.navigate('SecurityPrivacy');
    } catch (error: unknown) {
      showToast('fail', getErrorMessage(error));
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    changePasswordPending: changePasswordMutation.isPending,
    handleSave,
    changePasswordScreenStrings,
    onBeforeBack: () => navigation.goBack(),
  };
}

export type UseChangePasswordScreenReturn = ReturnType<typeof useChangePasswordScreen>;

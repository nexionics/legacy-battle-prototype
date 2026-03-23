import { useState, useRef } from 'react';
import { useToast } from '@/app/providers/useToast';
import type { ChangePasswordScreenProps } from '@/shared/types';
import { useChangePassword } from '../../data/mutations/useChangePassword';
import { changePasswordScreenStrings } from '../../string';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

export function useChangePasswordScreen({ navigation }: Pick<ChangePasswordScreenProps, 'navigation'>) {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const changePasswordMutation = useChangePassword();

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('fail', changePasswordScreenStrings.toast.fillAllFields);
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('fail', changePasswordScreenStrings.toast.passwordsMismatch);
      return;
    }

    if (newPassword.length < 8) {
      showToast('fail', changePasswordScreenStrings.toast.passwordTooShort);
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        oldPassword: currentPassword,
        newPassword,
      });
      requestAnimationFrame(() => {
        bottomSheetRef.current?.present();
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || changePasswordScreenStrings.toast.changeFailed;
      showToast('fail', errorMessage);
    }
  };

  const onSuccessSheetClose = () => {
    bottomSheetRef.current?.dismiss();
    navigation.goBack();
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    bottomSheetRef,
    changePasswordPending: changePasswordMutation.isPending,
    handleSave,
    onSuccessSheetClose,
    changePasswordScreenStrings,
    onBeforeBack: () => navigation.goBack(),
  };
}

export type UseChangePasswordScreenReturn = ReturnType<typeof useChangePasswordScreen>;

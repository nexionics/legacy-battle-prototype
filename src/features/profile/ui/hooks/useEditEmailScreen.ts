import { useState } from 'react';
import { useToast } from '@/app/providers/useToast';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import type { EditEmailScreenProps } from '@/shared/types';
import { editEmailScreenStrings } from '../../string';
import { requestEmailChange } from '../../data/api/profile.api';

export function useEditEmailScreen({ navigation }: Pick<EditEmailScreenProps, 'navigation'>) {
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);

  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async () => {
    if (!email || email === user?.email) {
      return;
    }

    setIsSubmitting(true);
    const response = await requestEmailChange(email);
    if (response.success) {
      navigation.navigate('VerifyEmailOTP', {
        email,
        reference: response.data.reference,
      });
    } else {
      showToast('fail', response.error.message);
    }
  };

  return {
    email,
    setEmail,
    handleVerify,
    isSubmitting,
    editEmailScreenStrings,
    user,
    onBeforeBack: () => navigation.goBack(),
  };
}

export type UseEditEmailScreenReturn = ReturnType<typeof useEditEmailScreen>;

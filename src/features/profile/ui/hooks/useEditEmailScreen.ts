import { useState } from 'react';
import { useToast } from '@/app/providers/useToast';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import type { EditEmailScreenProps } from '@/shared/types';
import { editEmailScreenStrings } from '../../string';

export function useEditEmailScreen({ navigation }: Pick<EditEmailScreenProps, 'navigation'>) {
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const [email, setEmail] = useState(user?.email || '');

  const handleVerify = () => {
    if (!email) {
      showToast('fail', editEmailScreenStrings.toast.enterEmail);
      return;
    }
    navigation.navigate('VerifyEmailOTP', { email });
  };

  return {
    email,
    setEmail,
    handleVerify,
    editEmailScreenStrings,
    onBeforeBack: () => navigation.goBack(),
  };
}

export type UseEditEmailScreenReturn = ReturnType<typeof useEditEmailScreen>;

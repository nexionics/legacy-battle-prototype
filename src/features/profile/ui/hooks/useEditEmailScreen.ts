import { useEffect, useState } from 'react';
import { useToast } from '@/app/providers/useToast';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import type { EditEmailScreenProps } from '@/shared/types';
import { editEmailScreenStrings } from '../../string';
import { requestEmailChange } from '../../data/api/profile.api';
import { getBiometricSecureItem } from '@/features/auth/data/biometricSecureStorage';

export function useEditEmailScreen({ navigation }: Pick<EditEmailScreenProps, 'navigation'>) {
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);

  const [initialEmail, setInitialEmail] = useState(user?.email || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const fallbackEmail = await getBiometricSecureItem('biometric_email');
      if (cancelled) return;
      const resolved = user?.email || fallbackEmail || '';
      setInitialEmail(resolved);
      setEmail((current) => (current.length === 0 ? resolved : current));
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const handleVerify = async () => {
    if (!email || email === initialEmail) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await requestEmailChange(email);
      if (response.success) {
        setIsSubmitting(false);
        navigation.navigate('VerifyEmailOTP', {
          email,
          reference: response.data.reference,
        });
        return;
      }
      showToast('fail', response.error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    handleVerify,
    isSubmitting,
    editEmailScreenStrings,
    user,
    initialEmail,
    onBeforeBack: () => {},
  };
}

export type UseEditEmailScreenReturn = ReturnType<typeof useEditEmailScreen>;

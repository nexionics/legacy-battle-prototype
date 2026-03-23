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

  const getErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : 'Something went wrong';

  const handleVerify = async () => {
    const nextEmail = email.trim();
    if (!nextEmail || nextEmail === initialEmail.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await requestEmailChange(nextEmail);
      if (response.success) {
        const ref = response.data.reference;
        if (typeof ref === 'string' && ref.length > 0) {
          navigation.navigate('VerifyEmailOTP', {
            email: nextEmail,
            reference: ref,
          });
          return;
        }
        showToast('fail', 'Invalid response from server');
        return;
      }
      showToast('fail', response.error.message);
    } catch (error: unknown) {
      // authenticatedHttp throws on { success: false } before a value is returned
      showToast('fail', getErrorMessage(error));
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

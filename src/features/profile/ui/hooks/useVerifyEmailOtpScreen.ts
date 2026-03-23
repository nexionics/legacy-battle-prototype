import { useState, useRef } from 'react';
import type { VerifyEmailOTPScreenProps } from '@/shared/types';
import { OTP_LENGTH, VERIFY_OTP_COOLDOWN_SEC } from '@/shared/constants';
import { verifyEmailOtpScreenStrings } from '../../string';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useToast } from '@/app/providers';
import { useAuthStore } from '@/features/auth';
import { resendEmailChangeOtp, verifyEmailChange } from '../../data/api/profile.api';
import { useCountdown } from '@/shared/hooks';

export function useVerifyEmailOtpScreen({
  navigation,
  route,
}: Pick<VerifyEmailOTPScreenProps, 'navigation' | 'route'>) {
  const { email, reference: initialReference } = route.params;
  const [reference, setReference] = useState(initialReference);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { seconds: resendTimer, canResend, reset: resetTimer } = useCountdown(VERIFY_OTP_COOLDOWN_SEC);

  const successSheetRef = useRef<BottomSheetModal>(null);
  const { showToast } = useToast();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  const getErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : 'Something went wrong';

  const handleVerify = async () => {
    if (otp.length !== OTP_LENGTH) return;

    setIsSubmitting(true);
    try {
      const response = await verifyEmailChange(otp, reference, email);
      if (response.success) {
        if (user) {
          setUser({ ...user, email });
        }
        successSheetRef.current?.present();
      } else {
        showToast('fail', response.error.message);
      }
    } catch (error: unknown) {
      showToast('fail', getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsSubmitting(true);
    try {
      const response = await resendEmailChangeOtp(email);
      if (response.success) {
        setReference(response.data.reference);
        resetTimer(VERIFY_OTP_COOLDOWN_SEC);
        showToast('success', verifyEmailOtpScreenStrings.toast.resendSuccess);
      } else {
        showToast('fail', response.error.message);
      }
    } catch (error: unknown) {
      showToast('fail', getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    successSheetRef.current?.dismiss();
    navigation.pop(2);
  };

  return {
    email,
    otp,
    setOtp,
    isSubmitting,
    successSheetRef,
    handleVerify,
    handleDone,
    handleResend,
    canResend,
    resendTimer,
    verifyEmailOtpScreenStrings,
    onBack: () => navigation.goBack(),
    otpLength: OTP_LENGTH,
  };
}

export type UseVerifyEmailOtpScreenReturn = ReturnType<typeof useVerifyEmailOtpScreen>;

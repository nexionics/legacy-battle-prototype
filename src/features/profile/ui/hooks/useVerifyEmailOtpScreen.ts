import { useState, useRef } from 'react';
import type { VerifyEmailOTPScreenProps } from '@/shared/types';
import { OTP_LENGTH } from '@/shared/constants';
import { verifyEmailOtpScreenStrings } from '../../string';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

export function useVerifyEmailOtpScreen({
  navigation,
  route,
}: Pick<VerifyEmailOTPScreenProps, 'navigation' | 'route'>) {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const successSheetRef = useRef<BottomSheetModal>(null);

  const handleVerify = async () => {
    if (otp.length !== OTP_LENGTH) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    successSheetRef.current?.present();
  };

  const handleDone = () => {
    successSheetRef.current?.dismiss();
    navigation.navigate('AccountDetails');
  };

  return {
    email,
    otp,
    setOtp,
    isSubmitting,
    successSheetRef,
    handleVerify,
    handleDone,
    verifyEmailOtpScreenStrings,
    onBack: () => navigation.goBack(),
    otpLength: OTP_LENGTH,
  };
}

export type UseVerifyEmailOtpScreenReturn = ReturnType<typeof useVerifyEmailOtpScreen>;

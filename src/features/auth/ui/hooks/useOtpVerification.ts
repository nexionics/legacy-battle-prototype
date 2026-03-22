import { useEffect, useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useToast } from '@/app/providers/useToast';
import { useAuthStore } from '../../data/store/auth.store';
import { useResendOtpMutation, useVerifyOtpMutation } from '../../data/api/authMutations';
import type { AuthStackParamList } from '@/shared/types';
import { loginScreenStrings, otpVerificationScreenStrings } from '../../strings';
import { otpSchema, type OtpFormValues } from './useOtp.validation';

/** Resend OTP allowed only after this many seconds (2 minutes). */
export const RESEND_OTP_COOLDOWN_SEC = 120;

type AuthNav = NativeStackNavigationProp<AuthStackParamList>;
type OtpRoute = RouteProp<AuthStackParamList, 'OTPVerification'>;

export function useOtpVerification() {
  const navigation = useNavigation<AuthNav>();
  const route = useRoute<OtpRoute>();
  const { showToast } = useToast();
  const setAuthTokens = useAuthStore((s) => s.setAuthTokens);
  const setNeedsUsername = useAuthStore((s) => s.setNeedsUsername);
  const verifyMutation = useVerifyOtpMutation();
  const resendMutation = useResendOtpMutation();

  const [cooldownSec, setCooldownSec] = useState(RESEND_OTP_COOLDOWN_SEC);
  const missingSessionHandled = useRef(false);

  const email = route.params?.email ?? '';
  const reference = route.params?.reference ?? '';

  const form = useForm<OtpFormValues>({
    resolver: yupResolver(otpSchema),
    mode: 'onChange',
    defaultValues: { otp: '' },
  });

  useEffect(() => {
    if (missingSessionHandled.current) return;
    if (!reference || !email) {
      missingSessionHandled.current = true;
      showToast('fail', 'Missing verification session');
      navigation.goBack();
    }
  }, [email, navigation, reference, showToast]);

  useEffect(() => {
    if (cooldownSec <= 0) return;
    const id = setInterval(() => setCooldownSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldownSec]);

  const onCodeChange = useCallback(
    (next: string) => {
      const merged = next.replace(/\D/g, '').slice(0, 5);
      form.setValue('otp', merged, { shouldValidate: true, shouldDirty: true });
    },
    [form],
  );

  const onValidSubmit = async (data: OtpFormValues) => {
    const result = await verifyMutation.mutateAsync({
      reference,
      otp: data.otp,
    });

    if (!result.success) {
      showToast('fail', result.error.message);
      return;
    }

    setAuthTokens(result.data.accessToken, result.data.refreshToken);
    setNeedsUsername(true);
    navigation.navigate('CreateUsername');
  };

  const onResend = async () => {
    if (cooldownSec > 0 || resendMutation.isPending) return;

    const result = await resendMutation.mutateAsync({ email });

    if (!result.success) {
      showToast('fail', result.error.message);
      return;
    }

    showToast('success', otpVerificationScreenStrings.resend.successToast);
    setCooldownSec(RESEND_OTP_COOLDOWN_SEC);
  };

  return {
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit: form.handleSubmit(onValidSubmit),
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting || verifyMutation.isPending,
    onResend,
    resendDisabled: cooldownSec > 0 || resendMutation.isPending,
    cooldownSec,
    displayEmail: email,
    onCodeChange,
    loginScreenStrings,
    otpVerificationScreenStrings,
  };
}

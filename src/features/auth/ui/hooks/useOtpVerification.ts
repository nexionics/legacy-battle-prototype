import { useEffect, useState, useCallback, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useToast } from '@/app/providers/useToast';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import { useResendOtpMutation, useVerifyOtpMutation } from '@/features/auth/data/api/authMutations';
import type { AuthStackParamList } from '@/shared/types';
import { loginScreenStrings, otpVerificationScreenStrings } from '@/features/auth/strings';
import { otpSchema, type OtpFormValues } from './useOtp.validation';

const RESEND_COOLDOWN_SEC = 120;

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

  const [cooldownSec, setCooldownSec] = useState(0);
  const missingSessionHandled = useRef(false);

  const email = route.params?.email ?? '';
  const reference = route.params?.reference ?? '';

  const form = useForm<OtpFormValues>({
    resolver: yupResolver(otpSchema),
    mode: 'onChange',
    defaultValues: { code: '' },
  });

  const code = useWatch({ control: form.control, name: 'code' }) ?? '';

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

  const onDigitChange = useCallback(
    (index: number, value: string) => {
      const cur = form.getValues('code') ?? '';
      const digits = cur.replace(/\D/g, '').padEnd(6, ' ').split('').slice(0, 6);
      const nextChar = value.replace(/\D/g, '').slice(-1) ?? '';
      digits[index] = nextChar;
      const merged = digits.join('').replace(/\s/g, '').slice(0, 6);
      form.setValue('code', merged, { shouldValidate: true, shouldDirty: true });
    },
    [form],
  );

  const digitAt = (index: number) => code.replace(/\D/g, '')[index] ?? '';

  const onValidSubmit = async (data: OtpFormValues) => {
    const result = await verifyMutation.mutateAsync({
      reference,
      code: data.code,
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

    const result = await resendMutation.mutateAsync({ reference });

    if (!result.success) {
      showToast('fail', result.error.message);
      return;
    }

    showToast('success', otpVerificationScreenStrings.resend.successToast);
    setCooldownSec(RESEND_COOLDOWN_SEC);
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
    onDigitChange,
    digitAt,
    loginScreenStrings,
    otpVerificationScreenStrings,
  };
}

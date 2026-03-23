import { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useToast } from '@/app/providers/useToast';
import { OTP_LENGTH } from '@/shared/constants';
import { useResendResetOtpMutation, useVerifyResetOtpMutation } from '../../data/api/authMutations';
import { useCountdown } from '@/shared/hooks/useCountdown';
import type { AuthStackParamList } from '@/shared/types';
import { forgotPasswordFlowStrings, loginScreenStrings } from '../../string';
import { otpSchema, type OtpFormValues } from './validations';
import { VERIFY_OTP_COOLDOWN_SEC } from '@/shared/constants';

type AuthNav = NativeStackNavigationProp<AuthStackParamList>;
type VerifyResetRoute = RouteProp<AuthStackParamList, 'VerifyResetOTP'>;

export function useVerifyResetOtp() {
  const navigation = useNavigation<AuthNav>();
  const route = useRoute<VerifyResetRoute>();
  const { showToast } = useToast();
  const verifyMutation = useVerifyResetOtpMutation();
  const resendMutation = useResendResetOtpMutation();

  const {
    seconds: cooldownSec,
    canResend: isCooldownDone,
    reset: resetCooldown,
  } = useCountdown(VERIFY_OTP_COOLDOWN_SEC);
  const missingSessionHandled = useRef(false);

  const email = route.params?.email ?? '';
  const reference = route.params?.reference ?? '';

  if (!missingSessionHandled.current) {
    missingSessionHandled.current = true;
    if (!reference || !email) {
      showToast('fail', 'Missing reset session');
      navigation.goBack();
    }
  }

  const form = useForm<OtpFormValues>({
    resolver: yupResolver(otpSchema),
    mode: 'onChange',
    defaultValues: { otp: '' },
  });

  const onCodeChange = useCallback(
    (next: string) => {
      const merged = next.replace(/\D/g, '').slice(0, OTP_LENGTH);
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

    navigation.navigate('ResetPassword', {
      reference: result.data.reference,
    });
  };

  const onResend = async () => {
    if (cooldownSec > 0 || resendMutation.isPending) return;

    const result = await resendMutation.mutateAsync({ email });

    if (!result.success) {
      showToast('fail', result.error.message);
      return;
    }

    showToast('success', forgotPasswordFlowStrings.verifyResetOtp.resendSuccessToast);
    resetCooldown(VERIFY_OTP_COOLDOWN_SEC);
  };

  return {
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit: form.handleSubmit(onValidSubmit),
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting || verifyMutation.isPending,
    onResend,
    resendDisabled: !isCooldownDone || resendMutation.isPending,
    cooldownSec,
    displayEmail: email,
    onCodeChange,
    forgotPasswordFlowStrings,
    loginScreenStrings,
  };
}

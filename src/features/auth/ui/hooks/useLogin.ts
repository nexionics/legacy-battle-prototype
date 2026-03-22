import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useToast } from '@/app/providers/useToast';
import { getBiometricsRequested, setBiometricsRequested } from '../../data/biometricSecureStorage';
import { useAuthStore } from '../../data/store/auth.store';
import { useGoogleSocialAuthMutation, useLoginMutation } from '../../data/api/authMutations';
import { enrollBiometrics } from '../../lib/biometrics';
import { requestGoogleIdToken } from '../../lib/googleSignIn';
import type { AuthStackParamList } from '@/shared/types';
import { loginScreenStrings, signUpScreenStrings } from '../../string';
import { loginSchema, type LoginFormValues } from './validations';

type AuthNav = NativeStackNavigationProp<AuthStackParamList>;

export function useLogin() {
  const navigation = useNavigation<AuthNav>();
  const { showToast } = useToast();
  const setAuthTokens = useAuthStore((s) => s.setAuthTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const setNeedsUsername = useAuthStore((s) => s.setNeedsUsername);
  const deviceId = useAuthStore((s) => s.deviceId);
  const loginMutation = useLoginMutation();
  const googleSocialMutation = useGoogleSocialAuthMutation();
  const [wantBiometrics, setWantBiometrics] = useState(false);
  const [googleFlowLoading, setGoogleFlowLoading] = useState(false);
  const biometricsTouchedByUser = useRef(false);

  useEffect(() => {
    void (async () => {
      const requested = await getBiometricsRequested();
      if (biometricsTouchedByUser.current) return;
      setWantBiometrics(requested);
    })();
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const onValidSubmit = async (data: LoginFormValues) => {
    const result = await loginMutation.mutateAsync({
      ...data,
      deviceId: deviceId ?? undefined,
    });

    if (!result.success) {
      showToast('fail', result.error.message);
      return;
    }

    if (result.data.outcome === 'PENDING_VERIFICATION') {
      navigation.navigate('OTPVerification', {
        email: result.data.email,
        reference: result.data.reference,
      });
      return;
    }

    if (result.data.outcome === 'AUTHENTICATED') {
      setAuthTokens(result.data.accessToken, result.data.refreshToken);
      setUser({ id: result.data.userId, email: data.email });

      if (result.data.isBiometricEnrolled) {
        await setBiometricsRequested(true);
        setWantBiometrics(true);
      }

      const wantBiometrics = await getBiometricsRequested();
      if (wantBiometrics && !result.data.isBiometricEnrolled && deviceId) {
        const enroll = await enrollBiometrics(result.data.accessToken, data.email, deviceId);
        if (!enroll.ok) {
          showToast('fail', loginScreenStrings.emailLoginForm.biometricsEnrollCancelledToast);
        }
      }

      if (!result.data.hasUsername) {
        setNeedsUsername(true);
        navigation.navigate('CreateUsername');
        return;
      }
      setNeedsUsername(false);
    }
  };

  const onBeforeBack = () => {
    form.reset();
  };

  const onGooglePress = async () => {
    setGoogleFlowLoading(true);
    try {
      const tokenResult = await requestGoogleIdToken();
      if (!tokenResult.ok) {
        if (tokenResult.cancelled) return;
        showToast('fail', tokenResult.message);
        return;
      }

      const result = await googleSocialMutation.mutateAsync({ idToken: tokenResult.idToken });
      if (!result.success) {
        showToast('fail', result.error.message);
        return;
      }

      setAuthTokens(result.data.accessToken, result.data.refreshToken);
      setUser({ id: result.data.userId });

      if (!result.data.hasUsername) {
        setNeedsUsername(true);
        navigation.navigate('CreateUsername');
        return;
      }
      setNeedsUsername(false);
    } finally {
      setGoogleFlowLoading(false);
    }
  };

  const onFooterLinkPress = () => {
    navigation.navigate('SignUp');
  };

  const onForgotPasswordPress = () => {
    navigation.navigate('ForgotPassword');
  };

  const onWantBiometricsToggle = (enabled: boolean) => {
    biometricsTouchedByUser.current = true;
    setWantBiometrics(enabled);
    void setBiometricsRequested(enabled);
  };

  const isSubmitting = form.formState.isSubmitting || loginMutation.isPending;
  const isGoogleLoading = googleFlowLoading || googleSocialMutation.isPending;

  return {
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit: form.handleSubmit(onValidSubmit),
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting,
    isGoogleLoading,
    onBeforeBack,
    onGooglePress,
    onFooterLinkPress,
    onForgotPasswordPress,
    wantBiometrics,
    onWantBiometricsToggle,
    loginScreenStrings,
    signUpScreenStrings,
  };
}

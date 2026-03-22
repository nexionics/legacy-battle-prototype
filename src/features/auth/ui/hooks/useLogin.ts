import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
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
import { registerForPushNotificationsAsync } from '@/shared/lib/pushNotifications';
import { postRegisterDevice } from '../../data/api/devicesApi';

type AuthNav = NativeStackNavigationProp<AuthStackParamList>;

export function useLogin() {
  const navigation = useNavigation<AuthNav>();
  const { showToast } = useToast();
  const setAuthTokens = useAuthStore((s) => s.setAuthTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const setNeedsUsername = useAuthStore((s) => s.setNeedsUsername);
  const deviceId = useAuthStore((s) => s.deviceId);
  const setDeviceId = useAuthStore((s) => s.setDeviceId);
  const setExpoPushToken = useAuthStore((s) => s.setExpoPushToken);
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
      await handlePostLogin(result.data, data.email);
    }
  };

  const handlePostLogin = async (
    authData: {
      accessToken: string;
      refreshToken: string;
      userId: string;
      hasUsername?: boolean;
      isBiometricEnrolled?: boolean;
    },
    email?: string,
  ) => {
    setAuthTokens(authData.accessToken, authData.refreshToken);
    setUser({ id: authData.userId, email });

    let currentDeviceId = deviceId;
    if (!currentDeviceId) {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        const name = Device.modelName ?? Device.deviceName ?? 'Unknown Device';
        const regResult = await postRegisterDevice({
          token,
          type: Platform.OS,
          name,
        });
        if (regResult.success) {
          currentDeviceId = regResult.data.id;
          setDeviceId(currentDeviceId);
          setExpoPushToken(token);
        } else {
          console.error('[Auth] Device registration failed:', regResult.error);
        }
      } else {
        console.log('[Auth] No push token available, skipping device registration');
      }
    }

    if (authData.isBiometricEnrolled) {
      await setBiometricsRequested(true);
      setWantBiometrics(true);
    }

    const wantBiometricsPref = await getBiometricsRequested();

    if (wantBiometricsPref && !authData.isBiometricEnrolled && currentDeviceId && email) {
      const enroll = await enrollBiometrics(authData.accessToken, email, currentDeviceId);
      if (enroll.ok) {
        showToast('success', 'Biometrics enrolled successfully!');
      } else {
        showToast('fail', loginScreenStrings.emailLoginForm.biometricsEnrollCancelledToast);
      }
    }

    if (!authData.hasUsername) {
      setNeedsUsername(true);
      navigation.navigate('CreateUsername');
      return;
    }
    setNeedsUsername(false);
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

      const result = await googleSocialMutation.mutateAsync({
        idToken: tokenResult.idToken,
        deviceId: deviceId ?? undefined,
      });
      if (!result.success) {
        showToast('fail', result.error.message);
        return;
      }

      await handlePostLogin(result.data);
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

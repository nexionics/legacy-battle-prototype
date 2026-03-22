import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useToast } from '@/app/providers/useToast';
import { useAuthStore } from '../../data/store/auth.store';
import { useLoginMutation } from '../../data/api/authMutations';
import type { AuthStackParamList } from '@/shared/types';
import { authStrings, loginScreenStrings, signUpScreenStrings } from '../../string';
import { loginSchema, type LoginFormValues } from './validations';

type AuthNav = NativeStackNavigationProp<AuthStackParamList>;

const BIOMETRICS_PREF_KEY = '@legacy-battle/auth-biometrics-enabled';

export function useLogin() {
  const navigation = useNavigation<AuthNav>();
  const { showToast } = useToast();
  const setAuthTokens = useAuthStore((s) => s.setAuthTokens);
  const setNeedsUsername = useAuthStore((s) => s.setNeedsUsername);
  const loginMutation = useLoginMutation();
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  useEffect(() => {
    void (async () => {
      const stored = await AsyncStorage.getItem(BIOMETRICS_PREF_KEY);
      setBiometricsEnabled(stored === 'true');
    })();
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const onValidSubmit = async (data: LoginFormValues) => {
    const result = await loginMutation.mutateAsync(data);

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

  const onGooglePress = () => {
    Alert.alert(authStrings.comingSoon.alertTitle, authStrings.comingSoon.loginMessage('Google'));
  };

  const onFooterLinkPress = () => {
    navigation.navigate('SignUp');
  };

  const onForgotPasswordPress = () => {
    navigation.navigate('ForgotPassword');
  };

  const onBiometricsToggle = async (enabled: boolean) => {
    if (!enabled) {
      await AsyncStorage.setItem(BIOMETRICS_PREF_KEY, 'false');
      setBiometricsEnabled(false);
      return;
    }

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      showToast('fail', loginScreenStrings.emailLoginForm.biometricsUnavailable);
      return;
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      showToast('fail', loginScreenStrings.emailLoginForm.biometricsNotEnrolled);
      return;
    }

    const authResult = await LocalAuthentication.authenticateAsync({
      promptMessage: loginScreenStrings.emailLoginForm.biometricsPrompt,
    });

    if (!authResult.success) {
      return;
    }

    await AsyncStorage.setItem(BIOMETRICS_PREF_KEY, 'true');
    setBiometricsEnabled(true);
  };

  return {
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit: form.handleSubmit(onValidSubmit),
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting || loginMutation.isPending,
    onBeforeBack,
    onGooglePress,
    onFooterLinkPress,
    onForgotPasswordPress,
    biometricsEnabled,
    onBiometricsToggle,
    loginScreenStrings,
    signUpScreenStrings,
  };
}

import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TextInput } from 'react-native';
import { useToast } from '@/app/providers/useToast';
import { getBiometricSecureItem } from '../../data/biometricSecureStorage';
import { useAuthStore } from '../../data/store/auth.store';
import { useLoginMutation } from '../../data/api/authMutations';
import { rnBiometrics, signInWithBiometrics } from '../../lib/biometrics';
import type { AuthStackParamList } from '@/shared/types';
import { loginScreenStrings } from '../../string';
import { useProfileStore } from '@/features/profile/data/store/profile.store';
import { biometricPasswordLoginSchema, type BiometricPasswordLoginFormValues } from './validations';
import { formatDisplayNameFromEmail } from '@/shared/utils/helpers';

type AuthNav = NativeStackNavigationProp<AuthStackParamList>;

export function useLoginWithBiometrics() {
  const passwordRef = useRef<TextInput>(null);
  const navigation = useNavigation<AuthNav>();
  const { showToast } = useToast();
  const setAuthTokens = useAuthStore((s) => s.setAuthTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const setNeedsUsername = useAuthStore((s) => s.setNeedsUsername);
  const loginMutation = useLoginMutation();

  const [displayName, setDisplayName] = useState('');
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [biometricBusy, setBiometricBusy] = useState(false);
  const biometricInFlight = useRef(false);

  const form = useForm<BiometricPasswordLoginFormValues>({
    resolver: yupResolver(biometricPasswordLoginSchema),
    mode: 'onChange',
    defaultValues: { password: '' },
  });

  const applyAuthSuccess = useCallback(
    (accessToken: string, refreshToken: string, userId: string, hasUsername: boolean) => {
      setAuthTokens(accessToken, refreshToken);
      setUser({ id: userId });
      useAuthStore.getState().setLocallyUnlocked(true);
      if (!hasUsername) {
        setNeedsUsername(true);
        navigation.navigate('CreateUsername');
        return;
      }
      setNeedsUsername(false);
    },
    [navigation, setAuthTokens, setUser, setNeedsUsername],
  );

  const runBiometricSignIn = useCallback(async () => {
    if (biometricInFlight.current || loginMutation.isPending) return;
    biometricInFlight.current = true;
    setBiometricBusy(true);
    try {
      if (useAuthStore.getState().isAuthenticated && useAuthStore.getState().isBiometricEnabled) {
        const { success } = await rnBiometrics.simplePrompt({
          promptMessage: 'Unlock Legacy Battle',
        });
        if (success) {
          useAuthStore.getState().setLocallyUnlocked(true);
          return;
        }
      }

      const outcome = await signInWithBiometrics();
      if (!outcome.ok) {
        if (outcome.reason === 'error') {
          showToast('fail', loginScreenStrings.loginWithBiometricsScreen.biometricSignInFailed);
        }
        return;
      }
      applyAuthSuccess(
        outcome.accessToken,
        outcome.refreshToken,
        outcome.userId,
        outcome.hasUsername,
      );
    } finally {
      biometricInFlight.current = false;
      setBiometricBusy(false);
    }
  }, [applyAuthSuccess, loginMutation.isPending, showToast]);

  const initializedRef = useRef(false);

  if (!initializedRef.current) {
    initializedRef.current = true;
    (async () => {
      if (useAuthStore.getState().isAuthenticated && useAuthStore.getState().user) {
        const currentUser = useAuthStore.getState().user;
        const profileName = useProfileStore.getState().displayName;
        const email = currentUser?.email || (await getBiometricSecureItem('biometric_email')) || null;
        setAccountEmail(email);
        setDisplayName(profileName || (email ? formatDisplayNameFromEmail(email) : 'User'));
        if (email) runBiometricSignIn();
        return;
      }
      const email = await getBiometricSecureItem('biometric_email');
      if (!email) {
        navigation.replace('EmailLogin');
        return;
      }
      setAccountEmail(email);
      setDisplayName(formatDisplayNameFromEmail(email));
      runBiometricSignIn();
    })();
  }

  const onPasswordSubmit = async (values: BiometricPasswordLoginFormValues) => {
    if (!accountEmail) return;
    const result = await loginMutation.mutateAsync({
      email: accountEmail,
      password: values.password,
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
      applyAuthSuccess(
        result.data.accessToken,
        result.data.refreshToken,
        result.data.userId,
        result.data.hasUsername,
      );
    }
  };

  const onUsePasswordInstead = () => {
    passwordRef.current?.focus();
  };

  const onForgotPasswordPress = () => {
    navigation.navigate('ForgotPassword');
  };

  const onNotYouPress = () => {
    navigation.navigate('EmailLogin');
  };

  return {
    passwordRef,
    displayName,
    accountEmail,
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit: form.handleSubmit(onPasswordSubmit),
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting || loginMutation.isPending,
    biometricBusy,
    onBiometricLoginPress: runBiometricSignIn,
    onUsePasswordInstead,
    onForgotPasswordPress,
    onNotYouPress,
    loginScreenStrings,
  };
}

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useToast } from '@/app/providers/useToast';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import { useLoginMutation } from '@/features/auth/data/api/authMutations';
import type { AuthStackParamList } from '@/shared/types';
import { authStrings, loginScreenStrings, signUpScreenStrings } from '@/features/auth/strings';
import { loginSchema, type LoginFormValues } from './useLogin.validation';

type AuthNav = NativeStackNavigationProp<AuthStackParamList>;

export function useLogin() {
  const navigation = useNavigation<AuthNav>();
  const { showToast } = useToast();
  const setAuthTokens = useAuthStore((s) => s.setAuthTokens);
  const setNeedsUsername = useAuthStore((s) => s.setNeedsUsername);
  const loginMutation = useLoginMutation();

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
    loginScreenStrings,
    signUpScreenStrings,
  };
}

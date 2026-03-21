import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useToast } from '@/app/providers/useToast';
import { useSignupMutation } from '@/features/auth/data/api/authMutations';
import type { AuthStackParamList } from '@/shared/types';
import { authStrings, loginScreenStrings, signUpScreenStrings } from '@/features/auth/strings';
import { signUpSchema, type SignUpFormValues } from './useSignup.validation';

type AuthNav = NativeStackNavigationProp<AuthStackParamList>;

export function useSignup() {
  const navigation = useNavigation<AuthNav>();
  const { showToast } = useToast();
  const signupMutation = useSignupMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onValidSubmit = async (data: SignUpFormValues) => {
    const result = await signupMutation.mutateAsync({
      email: data.email,
      password: data.password,
    });

    if (!result.success) {
      showToast('fail', result.error.message);
      return;
    }

    navigation.navigate('OTPVerification', {
      email: result.data.email,
      reference: result.data.reference,
    });
  };

  const onGooglePress = () => {
    Alert.alert(authStrings.comingSoon.alertTitle, authStrings.comingSoon.signUpMessage('Google'));
  };

  const onFooterLinkPress = () => {
    navigation.navigate('EmailLogin');
  };

  return {
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit: form.handleSubmit(onValidSubmit),
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting || signupMutation.isPending,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    onGooglePress,
    onFooterLinkPress,
    loginScreenStrings,
    signUpScreenStrings,
  };
}

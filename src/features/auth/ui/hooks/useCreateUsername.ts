import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import type { AuthStackParamList } from '@/shared/types';
import { getCheckUsername } from '@/features/auth/data/api/authApi';
import { createUsernameScreenStrings, loginScreenStrings } from '@/features/auth/strings';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { createUsernameSchema, type CreateUsernameFormValues } from './useCreateUsername.validation';

export function useCreateUsername() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const setUser = useAuthStore((s) => s.setUser);
  const setNeedsUsername = useAuthStore((s) => s.setNeedsUsername);
  const logout = useAuthStore((s) => s.logout);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [usernameStatusMessage, setUsernameStatusMessage] = useState('');

  const form = useForm<CreateUsernameFormValues>({
    resolver: yupResolver(createUsernameSchema),
    mode: 'onChange',
    defaultValues: { username: '' },
  });
  const username = useWatch({ control: form.control, name: 'username' }) ?? '';
  const debouncedUsername = useDebounce(username.trim(), 500);

  useEffect(() => {
    const value = debouncedUsername;
    let cancelled = false;

    if (value.length < 3) {
      setIsCheckingUsername(false);
      setIsUsernameAvailable(false);
      setUsernameStatusMessage('');
      return;
    }

    const run = async () => {
      setIsCheckingUsername(true);
      const result = await getCheckUsername(value);
      if (cancelled) return;

      if (!result.success) {
        setIsUsernameAvailable(false);
        setUsernameStatusMessage(result.error.message);
        setIsCheckingUsername(false);
        return;
      }

      setIsUsernameAvailable(result.data.available);
      setUsernameStatusMessage(result.data.message);
      setIsCheckingUsername(false);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [debouncedUsername]);

  const onValidSubmit = (data: CreateUsernameFormValues) => {
    if (!isUsernameAvailable) {
      form.setError('username', {
        type: 'manual',
        message: usernameStatusMessage || 'Username is not available',
      });
      return;
    }
    setUser({ id: data.username, email: undefined });
    setNeedsUsername(false);
  };

  const onBackPress = () => {
    Alert.alert(
      'Log out?',
      'Going back now will log you out. Are you sure you want to log out?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ],
    );
  };

  return {
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit: form.handleSubmit(onValidSubmit),
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
    isCheckingUsername,
    isUsernameAvailable,
    usernameStatusMessage,
    onBackPress,
    createUsernameScreenStrings,
    loginScreenStrings,
  };
}

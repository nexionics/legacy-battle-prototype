import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import { createUsernameScreenStrings, loginScreenStrings } from '@/features/auth/strings';
import { createUsernameSchema, type CreateUsernameFormValues } from './useCreateUsername.validation';

export function useCreateUsername() {
  const setUser = useAuthStore((s) => s.setUser);
  const setNeedsUsername = useAuthStore((s) => s.setNeedsUsername);

  const form = useForm<CreateUsernameFormValues>({
    resolver: yupResolver(createUsernameSchema),
    mode: 'onChange',
    defaultValues: { username: '' },
  });

  const onValidSubmit = (data: CreateUsernameFormValues) => {
    setUser({ id: data.username, email: undefined });
    setNeedsUsername(false);
  };

  return {
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit: form.handleSubmit(onValidSubmit),
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
    createUsernameScreenStrings,
    loginScreenStrings,
  };
}

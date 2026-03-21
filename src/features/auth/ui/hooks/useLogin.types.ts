import type { Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { loginScreenStrings, signUpScreenStrings } from '@/features/auth/strings';
import type { LoginFormValues } from './useLogin.validation';

export type UseLoginReturn = {
  control: Control<LoginFormValues>;
  handleSubmit: UseFormHandleSubmit<LoginFormValues>;
  onSubmit: ReturnType<UseFormHandleSubmit<LoginFormValues>>;
  errors: FieldErrors<LoginFormValues>;
  isValid: boolean;
  isSubmitting: boolean;
  onBeforeBack: () => void;
  onGooglePress: () => void;
  onFooterLinkPress: () => void;
  loginScreenStrings: typeof loginScreenStrings;
  signUpScreenStrings: typeof signUpScreenStrings;
};

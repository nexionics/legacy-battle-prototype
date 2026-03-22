import type { Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { loginScreenStrings, signUpScreenStrings } from '../../strings';
import type { SignUpFormValues } from './useSignup.validation';

export type UseSignupReturn = {
  control: Control<SignUpFormValues>;
  handleSubmit: UseFormHandleSubmit<SignUpFormValues>;
  onSubmit: ReturnType<UseFormHandleSubmit<SignUpFormValues>>;
  errors: FieldErrors<SignUpFormValues>;
  isValid: boolean;
  isSubmitting: boolean;
  onGooglePress: () => void;
  onFooterLinkPress: () => void;
  loginScreenStrings: typeof loginScreenStrings;
  signUpScreenStrings: typeof signUpScreenStrings;
};

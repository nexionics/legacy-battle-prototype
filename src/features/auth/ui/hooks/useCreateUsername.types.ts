import type { Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { createUsernameScreenStrings, loginScreenStrings } from '../../strings';
import type { CreateUsernameFormValues } from './useCreateUsername.validation';

export type UseCreateUsernameReturn = {
  control: Control<CreateUsernameFormValues>;
  handleSubmit: UseFormHandleSubmit<CreateUsernameFormValues>;
  onSubmit: ReturnType<UseFormHandleSubmit<CreateUsernameFormValues>>;
  errors: FieldErrors<CreateUsernameFormValues>;
  isValid: boolean;
  isSubmitting: boolean;
  isCheckingUsername: boolean;
  isUsernameAvailable: boolean;
  usernameStatusMessage: string;
  onBackPress: () => void;
  createUsernameScreenStrings: typeof createUsernameScreenStrings;
  loginScreenStrings: typeof loginScreenStrings;
};

import type { Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { loginScreenStrings, otpVerificationScreenStrings } from '../../strings';
import type { OtpFormValues } from './useOtp.validation';

export type UseOtpVerificationReturn = {
  control: Control<OtpFormValues>;
  handleSubmit: UseFormHandleSubmit<OtpFormValues>;
  onSubmit: ReturnType<UseFormHandleSubmit<OtpFormValues>>;
  errors: FieldErrors<OtpFormValues>;
  isValid: boolean;
  isSubmitting: boolean;
  onResend: () => Promise<void>;
  resendDisabled: boolean;
  cooldownSec: number;
  displayEmail: string;
  onCodeChange: (code: string) => void;
  loginScreenStrings: typeof loginScreenStrings;
  otpVerificationScreenStrings: typeof otpVerificationScreenStrings;
};

import * as yup from 'yup';

export const otpSchema = yup.object({
  otp: yup
    .string()
    .required('Code is required')
    .length(5, 'Enter the 5-digit code'),
});

export type OtpFormValues = yup.InferType<typeof otpSchema>;

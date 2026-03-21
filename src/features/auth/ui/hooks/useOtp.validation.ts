import * as yup from 'yup';

export const otpSchema = yup.object({
  code: yup
    .string()
    .required('Code is required')
    .length(6, 'Enter the 6-digit code'),
});

export type OtpFormValues = yup.InferType<typeof otpSchema>;

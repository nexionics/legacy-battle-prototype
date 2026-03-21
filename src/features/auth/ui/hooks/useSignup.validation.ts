import * as yup from 'yup';

const passwordRules = yup
  .string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .matches(/[A-Za-z]/, 'Password must contain at least one letter')
  .matches(/\d/, 'Password must contain at least one number');

export const signUpSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: passwordRules,
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export type SignUpFormValues = yup.InferType<typeof signUpSchema>;

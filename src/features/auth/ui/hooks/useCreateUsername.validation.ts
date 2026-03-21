import * as yup from 'yup';

export const createUsernameSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .transform((val) => (typeof val === 'string' ? val.trim() : val))
    .min(3, 'Username must be at least 3 characters'),
});

export type CreateUsernameFormValues = yup.InferType<typeof createUsernameSchema>;

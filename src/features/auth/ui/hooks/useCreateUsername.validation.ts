import * as yup from 'yup';

export const createUsernameSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
});

export type CreateUsernameFormValues = yup.InferType<typeof createUsernameSchema>;

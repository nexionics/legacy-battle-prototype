import * as yup from 'yup';
import { changePasswordScreenStrings } from '../../string';

export const changePasswordSchema = yup.object({
  oldPassword: yup.string().required(changePasswordScreenStrings.toast.fillAllFields),
  newPassword: yup
    .string()
    .required(changePasswordScreenStrings.toast.fillAllFields)
    .min(8, changePasswordScreenStrings.toast.passwordTooShort)
    .matches(/[A-Za-z]/, changePasswordScreenStrings.toast.passwordComplexity)
    .matches(/\d/, changePasswordScreenStrings.toast.passwordComplexity),
  confirmPassword: yup
    .string()
    .required(changePasswordScreenStrings.toast.fillAllFields)
    .oneOf([yup.ref('newPassword')], changePasswordScreenStrings.toast.passwordsMismatch),
});

export type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>;

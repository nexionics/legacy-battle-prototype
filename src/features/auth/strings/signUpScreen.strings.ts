export const signUpScreenStrings = {
  authHeader: {
    welcomeTitle: 'Welcome, Legend-In-The-Making!',
    createAccountSubtitle: 'Create An Account To Start Battling',
  },
  form: {
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter Email',
    passwordLabel: 'Enter Password',
    passwordPlaceholder: 'Enter Password',
    confirmPasswordLabel: 'Confirm Password',
  },
  legal: {
    termsLeadIn: 'By Continuing You Agree To Our',
    termsWord: 'Terms',
    termsConnector: 'And',
    conditionsWord: 'Conditions',
  },
  primaryCta: {
    signUp: 'Sign Up',
  },
  divider: {
    or: 'Or',
  },
  social: {
    continueWithGoogle: 'Continue With Google',
  },
  footer: {
    hasAccountPrompt: 'Already have an account?',
    logInCta: 'Log in',
  },
  alerts: {
    missingFieldsTitle: 'Missing Info',
    missingFieldsMessage: 'Please fill in all fields',
    passwordMismatchTitle: 'Password Mismatch',
    passwordMismatchMessage: 'Passwords do not match',
    weakPasswordTitle: 'Weak Password',
    weakPasswordMessage: 'Password must be at least 6 characters',
    signUpFailedTitle: 'Sign Up Failed',
    accountCreatedTitle: 'Account Created',
    accountCreatedMessage:
      'Please check your email to confirm your account, then log in.',
  },
} as const;

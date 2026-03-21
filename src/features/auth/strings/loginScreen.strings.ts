export const loginScreenStrings = {
  backgroundPattern: {
    watermarkText: 'LB',
  },
  authHeader: {
    titleLeadingWord: 'Legacy',
    titleAccentWord: 'Battle',
    subtitleTagline: 'Create Battle And Win Challenges',
  },
  social: {
    continueWithApple: 'Continue With Apple',
    continueWithFacebook: 'Continue With Facebook',
    continueWithGoogle: 'Continue With Google',
    continueWithEmail: 'Continue With Email',
  },
  primaryCta: {
    createAccount: 'Create Account',
  },
  emailLoginScreen: {
    title: 'Login legend',
    subtitle: 'login to your account',
  },
  emailLoginForm: {
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    submitLogIn: 'Log In',
    /** Shown before the Sign Up link on email login (includes trailing space). */
    footerLeadNoAccount: "Don't have an account? ",
    navigateToSignUp: 'Sign Up',
  },
  alerts: {
    missingCredentialsTitle: 'Missing Info',
    missingCredentialsMessage: 'Please enter email and password',
    loginFailedTitle: 'Login Failed',
  },
} as const;

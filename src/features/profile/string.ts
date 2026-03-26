export const logoutAlertStrings = {
  title: 'Log Out',
  message: 'Are you sure you want to log out?',
  cancel: 'Cancel',
  confirm: 'Log Out',
} as const;

export const profileScreenStrings = {
  loadingMessage: 'Loading profile...',
  errorTitle: 'Could not load profile',
} as const;

export const profileMenuComingSoonStrings = {
  title: 'Coming Soon',
  achievements: 'Achievements will be available in a future update.',
  statistics: 'Detailed statistics will be available in a future update.',
  wallet: 'Wallet management will be available in a future update.',
  notifications: 'Notification settings will be available in a future update.',
} as const;

export const profileMenuStrings = {
  achievements: 'Achievements',
  statistics: 'Statistics',
  crew: 'Crew',
  wallet: 'Wallet',
  notifications: 'Notifications',
  helpAndSupport: 'Help & Support',
  darkMode: 'Dark Mode',
  lightMode: 'Light Mode',
  logOut: 'Log Out',
} as const;

export const settingsScreenStrings = {
  headerTitle: 'Settings',
  sectionAccount: 'ACCOUNT',
  accountDetails: { title: 'Account Details', subtitle: "Personal Information's" },
  securityPrivacy: { title: 'Security & Privacy', subtitle: 'Private Details' },
  sectionNotifications: {
    title: 'Notifications',
    subtitle: 'Manage Your Notification Preferences',
  },
  challengeDetails: { title: 'Challenge Details', subtitle: "Personal Information's" },
  bcUpdates: { title: 'Bc Updates', subtitle: "Personal Information's" },
  systemUpdates: { title: 'System Updates', subtitle: "Personal Information's" },
  sectionLegal: {
    title: 'Legal & Support',
    subtitle: 'Manage Your Notification Preferences',
  },
  termsOfService: { title: 'Terms Of Service', subtitle: "Personal Information's" },
  privacyPolicy: { title: 'Privacy & Policy', subtitle: "Personal Information's" },
  contactUs: { title: 'Contact Us', subtitle: "Personal Information's" },
  version: 'Version 1.0.0',
  logOut: 'Log Out',
  logoutFailedToast: 'Failed to log out. Please try again.',
} as const;

export const accountDetailsScreenStrings = {
  headerTitle: 'Account Details',
  defaultDisplayName: 'Legacy Battles',
  defaultEmail: 'legend@legacybattles.com',
  usernameLabel: 'Username',
  emailLabel: 'Email',
  avatarUpdatedToast: 'Avatar updated successfully.',
  avatarUpdateFailedToast: 'Failed to update avatar. Please try again.',
} as const;

export const changePasswordScreenStrings = {
  authHeader: {
    title: 'Edit Password',
    subtitle: 'Enter Old And New Password To Edit.',
  },
  fields: {
    oldPasswordLabel: 'Enter Old Password',
    newPasswordLabel: 'Enter New Password',
    confirmPasswordLabel: 'Confirm New Password',
    placeholder: 'Enter Password',
  },
  saveButton: 'Save Password',
  toast: {
    fillAllFields: 'Please fill in all fields',
    passwordsMismatch: 'New passwords do not match',
    passwordTooShort: 'Password must be at least 8 characters long',
    passwordComplexity: 'Password must contain at least one letter and one number',
    success: 'Password updated successfully',
    changeFailed: 'Failed to change password. Please try again.',
  },
} as const;

export const editUsernameScreenStrings = {
  authHeader: {
    title: 'Edit Username',
    subtitle: 'Enter A Username To Start Creating Legacies',
  },
  fieldLabel: 'Enter Username',
  placeholder: 'Username',
  changeButton: 'Change Username',
  validation: {
    minLength: 'Username must be at least 3 characters',
    checkError: 'Error checking availability',
  },
  toast: {
    enterNew: 'Please enter a new username',
    notAvailable: 'Please choose an available username',
    success: 'Username updated successfully',
    updateFailed: 'Failed to update username',
  },
} as const;

export const editEmailScreenStrings = {
  authHeader: {
    title: 'Edit Email Address',
    subtitle: 'Edit Your Email Address',
  },
  fieldLabel: 'Email Address',
  placeholder: 'example@email.com',
  verifyButton: 'Verify Email',
  toast: {
    enterEmail: 'Please enter an email address',
  },
} as const;

export const verifyEmailOtpScreenStrings = {
  title: 'Verify Email',
  subtitleLead: 'We Sent A Verification Code To Your Email',
  resendPrompt: "Didn't receive the email?",
  resendCta: 'Click To Resend',
  resendInPrefix: 'Resend in',
  verifyButton: 'Verify Email',
  successSheet: {
    title: 'Email Verified',
    subtitle: 'Your Email Address Have Been Verified Successfully',
  },
  toast: {
    resendSuccess: 'Verification code resent',
    verifySuccess: 'Email verified successfully',
  },
} as const;

export const securityPrivacyScreenStrings = {
  headerTitle: 'Security & Privacy',
  changePassword: {
    title: 'Change Password',
    subtitle: 'Update your account password',
  },
  biometric: {
    title: 'Biometric Authentication',
    subtitleUnavailable: 'Not available on this device',
    subtitleEnabled: 'Enabled',
    subtitleDisabled: 'Disabled',
  },
  toast: {
    unavailable: 'Biometric authentication is not available on this device',
    enableMissingSession: 'Unable to enable biometrics. Please try logging in again.',
    enableSuccess: 'Biometric authentication enabled successfully!',
    enableFailed: 'Failed to enable biometric authentication',
    enabled: 'Biometric authentication enabled',
    disabled: 'Biometric authentication disabled',
    genericError: 'An error occurred. Please try again.',
  },
  infoAvailable:
    'Enable biometric authentication to quickly and securely log in to your account using your fingerprint or face.',
  infoUnavailable:
    'Biometric authentication is not available on this device. You may need to set up biometrics in your device settings first.',
} as const;

export const termsOfServiceScreenStrings = {
  title: 'Terms Of Service',
  lastUpdated: 'Last Updated: October 29, 2025',
  sections: [
    {
      title: '1. Acceptance of Terms',
      body:
        'By accessing or using the Legacy Battle mobile application and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
    },
    {
      title: '2. Eligibility',
      body:
        'You must be at least 18 years of age (or 21 where required by law) to use our services. By using Legacy Battle, you represent and warrant that you meet these age requirements.',
    },
    {
      title: '3. User Accounts',
      body:
        'You are responsible for maintaining the confidentiality of your account information, including your password. You agree to notify us immediately of any unauthorized use of your account.',
    },
    {
      title: '4. Prohibited Conduct',
      body:
        'Users are prohibited from using the services for any unlawful purpose, engaging in fraudulent activity, or interfering with the operation of the platform.',
    },
    {
      title: '5. Intellectual Property',
      body:
        'All content on the Legacy Battle platform, including logos, text, and graphics, is the property of Legacy Battle LLC and is protected by intellectual property laws.',
    },
    {
      title: '6. Limitation of Liability',
      body:
        'Legacy Battle LLC shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the services.',
    },
  ],
} as const;

export const privacyPolicyScreenStrings = {
  title: 'Privacy And Policy',
  effectiveDate: 'Effective Date: October 29, 2025',
  entityLine: 'Entity: Legacy Battle LLC ("Legacy Battle," "We," "Us," "Our")',
  contactLabel: 'Contact:',
  contactEmail: 'Legal@Legacybattle.Com',
  contactPhone: '702-835-9300',
  addressLine: 'Address: 5940 S. Rainbow Boulevard, Las Vegas, NV 89118',
  businessHours: 'Business Hours: Mon–Fri, 9:00am–5:00pm PT',
  introParagraph1:
    'Legacy Battle Operates A Competitive Skill Platform Where Users Issue, Accept, And Spectate Battles; Manage Battle Coins (BC) As Virtual, Non-Monetary Credits; And Share Outcomes And Highlights (The "Services"). By Using The Services You Agree To This Privacy Policy And Our Terms.',
  introParagraph2:
    'We Currently Target Adults 18+ (And 21+ Where Required For Gated Features). We Do Not Sell Or Share Personal Information For Cross-Context Behavioral Advertising And We Honor Global Privacy Control (GPC) Signals.',
  section1Title: '1) Notice At Collection (What We Collect & Why)',
  section1P1:
    'We Collect The Categories Below For The Listed Purposes. We Maintain Role-Based Access, Log Access, And Apply Least-Privilege.',
  section1P2:
    'Sensitive Data & Permissions. With Your Permission, The App May Access Camera, Microphone, And Photo Library To Capture Verification Evidence. You Can Revoke Permissions In Device Settings. We Do Not Collect Precise GPS Or Biometric Identifiers For Identity; If That Changes, We Will Update This Policy And Obtain Any Required Consent.',
} as const;

export const contactUsScreenStrings = {
  title: 'Contact Us',
  contactLabel: 'Contact:',
  contactEmail: 'Legal@Legacybattle.Com',
  contactPhone: '702-835-9300',
  addressLine: 'Address: 5940 S. Rainbow Boulevard, Las Vegas, NV 89118',
  businessHours: 'Business Hours: Mon–Fri, 9:00am–5:00pm PT',
} as const;

export const devDebugScreenStrings = {
  title: 'Supabase Connection Test',
  statusLabel: 'Status',
  errorLabel: 'Error',
  detailsLabel: 'Details',
  retryTesting: 'Testing...',
  retryConnection: 'Retry Connection',
  backToApp: 'Back to App',
  environmentLabel: 'Environment',
  urlSet: 'Set',
  urlMissing: 'Missing',
  keySet: 'Set',
  keyMissing: 'Missing',
  urlCaption: 'URL:',
  keyCaption: 'Key:',
} as const;

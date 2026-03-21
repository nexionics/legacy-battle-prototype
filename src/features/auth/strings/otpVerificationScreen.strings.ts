export const otpVerificationScreenStrings = {
  headings: {
    verifyEmail: 'Verify Email',
  },
  body: {
    codeSentLeadIn: 'We Sent A Verification Code To Your Email',
    mockRecipientEmail: 'Mike.Design@mail.com',
  },
  resend: {
    prompt: "Didn't receive the email?",
    /** Shown while countdown is active; timer (MM:SS) is rendered next to this. */
    availableIn: 'Resend available in',
    cta: 'Resend code',
    successToast: 'A new code has been sent',
  },
  primaryCta: {
    verifyEmail: 'Verify Email',
  },
} as const;

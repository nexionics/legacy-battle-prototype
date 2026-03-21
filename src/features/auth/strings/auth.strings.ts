/**
 * Strings reused across multiple auth screens.
 * Screen-specific copy lives next to each screen (`*Screen.strings.ts`).
 */

export const authStrings = {
  comingSoon: {
    alertTitle: 'Coming Soon',
    loginMessage: (providerName: string) =>
      `${providerName} login will be available in a future update.`,
    signUpMessage: (providerName: string) =>
      `${providerName} sign up will be available in a future update.`,
  },
  alerts: {
    actionConfirmOk: 'OK',
  },
} as const;

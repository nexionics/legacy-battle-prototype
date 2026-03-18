import { create } from 'zustand';

interface AuthFormState {
  showEmailLogin: boolean;
  loginEmail: string;
  loginPassword: string;
  loginLoading: boolean;

  signUpEmail: string;
  signUpPassword: string;
  signUpConfirmPassword: string;
  showSignUpPassword: boolean;
  showSignUpConfirmPassword: boolean;
  signUpLoading: boolean;

  otp: string[];
  username: string;
}

interface AuthFormActions {
  setShowEmailLogin: (v: boolean) => void;
  setLoginEmail: (v: string) => void;
  setLoginPassword: (v: string) => void;
  setLoginLoading: (v: boolean) => void;
  resetLoginForm: () => void;

  setSignUpEmail: (v: string) => void;
  setSignUpPassword: (v: string) => void;
  setSignUpConfirmPassword: (v: string) => void;
  setShowSignUpPassword: (v: boolean) => void;
  setShowSignUpConfirmPassword: (v: boolean) => void;
  setSignUpLoading: (v: boolean) => void;
  resetSignUpForm: () => void;

  setOtp: (otp: string[]) => void;
  setOtpDigit: (index: number, value: string) => void;
  resetOtpForm: () => void;

  setUsername: (v: string) => void;
  resetCreateUsernameForm: () => void;

  resetAll: () => void;
}

const INITIAL: AuthFormState = {
  showEmailLogin: false,
  loginEmail: '',
  loginPassword: '',
  loginLoading: false,
  signUpEmail: '',
  signUpPassword: '',
  signUpConfirmPassword: '',
  showSignUpPassword: false,
  showSignUpConfirmPassword: false,
  signUpLoading: false,
  otp: ['', '', '', '', '', ''],
  username: 'Nazasmart',
};

export const useAuthFormStore = create<AuthFormState & AuthFormActions>((set) => ({
  ...INITIAL,

  setShowEmailLogin: (showEmailLogin) => set({ showEmailLogin }),
  setLoginEmail: (loginEmail) => set({ loginEmail }),
  setLoginPassword: (loginPassword) => set({ loginPassword }),
  setLoginLoading: (loginLoading) => set({ loginLoading }),
  resetLoginForm: () =>
    set({
      showEmailLogin: false,
      loginEmail: '',
      loginPassword: '',
      loginLoading: false,
    }),

  setSignUpEmail: (signUpEmail) => set({ signUpEmail }),
  setSignUpPassword: (signUpPassword) => set({ signUpPassword }),
  setSignUpConfirmPassword: (signUpConfirmPassword) => set({ signUpConfirmPassword }),
  setShowSignUpPassword: (showSignUpPassword) => set({ showSignUpPassword }),
  setShowSignUpConfirmPassword: (showSignUpConfirmPassword) => set({ showSignUpConfirmPassword }),
  setSignUpLoading: (signUpLoading) => set({ signUpLoading }),
  resetSignUpForm: () =>
    set({
      signUpEmail: '',
      signUpPassword: '',
      signUpConfirmPassword: '',
      showSignUpPassword: false,
      showSignUpConfirmPassword: false,
      signUpLoading: false,
    }),

  setOtp: (otp) => set({ otp }),
  setOtpDigit: (index, value) =>
    set((s) => {
      const next = [...s.otp];
      next[index] = value;
      return { otp: next };
    }),
  resetOtpForm: () => set({ otp: ['', '', '', '', '', ''] }),

  setUsername: (username) => set({ username }),
  resetCreateUsernameForm: () => set({ username: '' }),

  resetAll: () => set(INITIAL),
}));

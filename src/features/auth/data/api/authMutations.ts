import { useMutation } from '@tanstack/react-query';
import { postLogin, postRefreshToken, postResendOtp, postSignup, postVerifyOtp } from './authApi';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponseData,
  RefreshTokenRequest,
  RefreshTokenResponseData,
  ResendOtpRequest,
  ResendOtpResponseData,
  SignupRequest,
  SignupResponseData,
  VerifyOtpRequest,
  VerifyOtpResponseData,
} from './types';

export function useLoginMutation() {
  return useMutation<ApiResponse<LoginResponseData>, Error, LoginRequest>({
    mutationFn: (payload: LoginRequest) => postLogin(payload),
  });
}

export function useSignupMutation() {
  return useMutation<ApiResponse<SignupResponseData>, Error, SignupRequest>({
    mutationFn: (payload: SignupRequest) => postSignup(payload),
  });
}

export function useVerifyOtpMutation() {
  return useMutation<ApiResponse<VerifyOtpResponseData>, Error, VerifyOtpRequest>({
    mutationFn: (payload: VerifyOtpRequest) => postVerifyOtp(payload),
  });
}

export function useResendOtpMutation() {
  return useMutation<ApiResponse<ResendOtpResponseData>, Error, ResendOtpRequest>({
    mutationFn: (payload: ResendOtpRequest) => postResendOtp(payload),
  });
}

export function useRefreshTokenMutation() {
  return useMutation<ApiResponse<RefreshTokenResponseData>, Error, RefreshTokenRequest>({
    mutationFn: (payload: RefreshTokenRequest) => postRefreshToken(payload),
  });
}

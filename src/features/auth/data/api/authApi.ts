import { authHttp } from '@/shared/lib/httpClient';
import type {
  ApiError,
  ApiResponse,
  LoginRequest,
  LoginResponseData,
  ResendOtpRequest,
  ResendOtpResponseData,
  SignupRequest,
  SignupResponseData,
  VerifyOtpRequest,
  VerifyOtpResponseData,
} from './types';

function parseApiResponse<T>(path: string, status: number, body: object | null | undefined): ApiResponse<T> {
  if (body !== null && body !== undefined && typeof body === 'object' && 'success' in body) {
    const r = body as ApiResponse<T>;
    if (r.success === true) {
      return r;
    }
    if (r.success === false && 'error' in r) {
      return r;
    }
  }
  return {
    success: false,
    error: {
      statusCode: status,
      message: 'Invalid response from server',
      timestamp: new Date().toISOString(),
      path,
    },
  };
}

function networkFailure(path: string, message: string): ApiError {
  return {
    success: false,
    error: {
      statusCode: 0,
      message,
      timestamp: new Date().toISOString(),
      path,
    },
  };
}

export async function postLogin(body: LoginRequest): Promise<ApiResponse<LoginResponseData>> {
  const path = '/auth/login';
  try {
    const res = await authHttp.post(path, body);
    return parseApiResponse<LoginResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function postSignup(body: SignupRequest): Promise<ApiResponse<SignupResponseData>> {
  const path = '/auth/signup';
  try {
    const res = await authHttp.post(path, body);
    return parseApiResponse<SignupResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function postVerifyOtp(body: VerifyOtpRequest): Promise<ApiResponse<VerifyOtpResponseData>> {
  const path = '/auth/verify-otp';
  try {
    const res = await authHttp.post(path, body);
    return parseApiResponse<VerifyOtpResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function postResendOtp(body: ResendOtpRequest): Promise<ApiResponse<ResendOtpResponseData>> {
  const path = '/auth/resend-otp';
  try {
    const res = await authHttp.post(path, body);
    return parseApiResponse<ResendOtpResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

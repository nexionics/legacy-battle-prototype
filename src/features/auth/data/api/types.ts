/** Standard API envelope (success). */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

/** Standard API envelope (failure). */
export interface ApiErrorBody {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface ApiError {
  success: false;
  error: ApiErrorBody;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface LoginRequest {
  email: string;
  password: string;
}

/** Normalized login success payload (see `normalizeLoginResponse` in authApi). */
export type LoginResponseData =
  | { outcome: 'AUTHENTICATED'; accessToken: string; refreshToken: string }
  | { outcome: 'PENDING_VERIFICATION'; reference: string; email: string };

export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponseData {
  reference: string;
  email: string;
}

export interface VerifyOtpRequest {
  reference: string;
  otp: string;
}

export interface VerifyOtpResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponseData {
  sent: boolean;
}

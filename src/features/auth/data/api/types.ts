export type {
  ApiSuccess,
  ApiErrorBody,
  ApiError,
  ApiResponse,
} from '@/shared/types/apiEnvelope';
export type { LoginRequest, LoginResponseData } from '@/shared/types/authLoginApi';

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

export interface CheckUsernameResponseData {
  message: string;
  available: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface SetUsernameRequest {
  username: string;
  displayName: string;
}

/** Backend may extend this; we only require success envelope handling. */
export type SetUsernameResponseData = Record<string, unknown>;

/** POST /auth/logout — no request body. */
export type LogoutResponseData = Record<string, unknown>;

/** POST /devices — register Expo push token for the current user. */
export interface RegisterDeviceRequest {
  token: string;
  /** Typically `ios` | `android` from `Platform.OS`. */
  type: string;
  /** Human-readable device label (e.g. model name). */
  name: string;
}

export type RegisterDeviceResponseData = Record<string, unknown>;

export type ListDevicesResponseData = unknown[];

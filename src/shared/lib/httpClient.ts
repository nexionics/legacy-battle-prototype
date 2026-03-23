import axios, { AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import { baseURL } from '../constants';

/** Fresh config per client so `headers` objects are never shared between instances. */
function createClientConfig() {
  return {
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30_000,
    validateStatus: () => true,
  } as const;
}

/** Public auth routes (sign-in, sign-up, OTP) — no Bearer token. */
export const authHttp = axios.create(createClientConfig());

/**
 * Routes that require `Authorization: Bearer <accessToken>`.
 * Token is read from the auth store on each request.
 */
export const authenticatedHttp = axios.create(createClientConfig());

authenticatedHttp.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const raw = useAuthStore.getState().accessToken;
  const token = raw?.trim();
  if (token) {
    const headers = AxiosHeaders.from(config.headers ?? {});
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

// Response interceptor to handle backend error structure
const handleResponseError = (response: AxiosResponse): AxiosResponse => {
  const data: unknown = response.data;
  if (!data || typeof data !== 'object') return response;

  const record = data as Record<string, unknown>;
  if (record.success === false) {
    const errorData: unknown = 'error' in record && record.error !== undefined ? record.error : record;
    const errorRecord =
      errorData && typeof errorData === 'object' ? (errorData as Record<string, unknown>) : {};

    const message = typeof errorRecord.message === 'string' ? errorRecord.message : 'Unknown error';
    const error = new Error(message);
    Object.assign(error, errorRecord);
    throw error;
  }

  return response;
};

authHttp.interceptors.response.use(handleResponseError);
authenticatedHttp.interceptors.response.use(handleResponseError);
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

/**
 * Ensures `response.data` is a parsed object when the server returned JSON as a string (e.g.
 * `text/plain` or missing `Content-Type`). Call sites that read `.data` directly then still see the
 * same shape as `parseApiResponse`.
 */
function parseJsonResponseBody(response: AxiosResponse): AxiosResponse {
  const data = response.data;
  if (typeof data === 'string') {
    const t = data.trim();
    if (!t.length) {
      response.data = null;
      return response;
    }
    const c = t[0];
    if (c === '{' || c === '[') {
      try {
        response.data = JSON.parse(t);
      } catch {
        /* leave as string */
      }
    }
  }
  return response;
}

authHttp.interceptors.response.use(parseJsonResponseBody);
authenticatedHttp.interceptors.response.use(parseJsonResponseBody);
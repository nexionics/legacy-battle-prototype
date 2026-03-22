import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { logoutSession } from '../logoutSession';
import { postRefreshToken } from './authApi';
import { useAuthStore } from '../store/auth.store';
import { authenticatedHttp } from '@/shared/lib/httpClient';

type RequestWithRetry = InternalAxiosRequestConfig & { _retry?: boolean };

function isAuthRefreshRequest(config: InternalAxiosRequestConfig): boolean {
  const url = config.url ?? '';
  return url.includes('/auth/refresh');
}

function isAuthLogoutRequest(config: InternalAxiosRequestConfig): boolean {
  const url = config.url ?? '';
  return url.includes('/auth/logout');
}

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    const rt = useAuthStore.getState().refreshToken?.trim();
    if (!rt) {
      await logoutSession();
      return null;
    }

    const result = await postRefreshToken({ refreshToken: rt });
    if (!result.success) {
      await logoutSession();
      return null;
    }

    useAuthStore.getState().setAuthTokens(result.data.accessToken, result.data.refreshToken);
    return result.data.accessToken;
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

authenticatedHttp.interceptors.response.use(async (response) => {
  const config = response.config as RequestWithRetry;

  if (response.status !== 401 || config._retry) {
    return response;
  }

  if (isAuthRefreshRequest(config) || isAuthLogoutRequest(config)) {
    return response;
  }

  config._retry = true;
  const accessToken = await refreshAccessToken();
  if (!accessToken) {
    return response;
  }

  const headers = AxiosHeaders.from(config.headers ?? {});
  headers.set('Authorization', `Bearer ${accessToken}`);
  config.headers = headers;

  return authenticatedHttp.request(config);
});

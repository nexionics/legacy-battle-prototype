import type { ApiError, ApiResponse } from '@/shared/types/apiEnvelope';
import type { LoginRequest, LoginResponseData } from '@/shared/types/authLoginApi';
import { NormalizedCheckUsername } from '../types/ui';

/**
 * Extracts up to `maxDigits` numeric characters from an arbitrary string.
 */
export const extractOTPDigits = (value: string, maxDigits: number): string[] =>
  (value.match(/\d/g) ?? []).slice(0, maxDigits);

/**
 * Returns true only when every slot is filled with a single digit.
 */
export const isOTPComplete = (slots: string[]): boolean => slots.every((s) => s.length === 1);

/**
 * Reads numeric digits from the clipboard.
 * Returns an empty array if clipboard is empty, inaccessible, or contains no digits.
 */
export const getOTPFromClipboard = async (length: number): Promise<string[]> => {
  try {
    const { hasStringAsync, getStringAsync } = await import('expo-clipboard');

    const hasContent = await hasStringAsync();
    if (!hasContent) return [];

    const content = await getStringAsync();
    return extractOTPDigits(content, length);
  } catch {
    return [];
  }
};

/**
 * Canonical username for API checks and set-username: lowercase, runs of whitespace → single `_`, trimmed.
 *
 * @example "The Legend Killer" → "the_legend_killer"
 */
export function formatUsernameForApi(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

/**
 * Converts the local-part of an email into a readable display name.
 *
 * Normalization rules:
 * - Uses the text before `@`.
 * - Treats `.`, `_`, and `-` as word separators.
 * - Title-cases each word.
 *
 * @example
 * formatDisplayNameFromEmail('john_doe-99@example.com') // "John Doe 99"
 */
export function formatDisplayNameFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim() ?? email;
  if (!local) return email;
  const words = local.replace(/[._-]+/g, ' ').split(' ');
  return words
    .map((w) => (w.length ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
}

/** Formats seconds as `M:SS` (e.g. countdown timers). */
export function formatMmSs(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Maps the inner `data` object from a successful check-username API response into a stable
 * `{ available, message }` shape for screens and hooks.
 *
 * Supported input shapes include:
 * - `{ available: boolean }` (no `message`) — common success payload.
 * - `{ available: boolean, message: string }` — when the backend sends a custom message.
 * - Legacy: `isAvailable: true` if `available` is not a boolean.
 *
 * When `message` is missing or empty, a short default English string is used based on `available`.
 *
 * @param data - Raw `data` field from the API envelope (`{ success: true, data: { ... } }`).
 * @returns Normalized availability flag and user-facing message.
 */
export function normalizeCheckUsernameData(data: Record<string, unknown>): NormalizedCheckUsername {
  const available =
    typeof data.available === 'boolean' ? data.available : data.isAvailable === true;

  const fromApi = data.message;
  if (typeof fromApi === 'string' && fromApi.length > 0) {
    return { available, message: fromApi };
  }

  return {
    available,
    message: available ? 'Username is available' : 'Username is not available',
  };
}

/**
 * Turns axios `response.data` into a plain object when the server sent JSON as a string (wrong
 * `Content-Type`, proxies, or RN quirks). Without this, `parseApiResponse` sees a string and
 * returns "Invalid response from server", and callers often mislabel failures as "Network error".
 */
export function normalizeApiResponseBody(body: unknown): object | null {
  if (body === null || body === undefined) {
    return null;
  }
  if (typeof body === 'object' && !Array.isArray(body)) {
    return body as object;
  }
  if (typeof body === 'string') {
    const t = body.trim();
    if (!t.length) {
      return null;
    }
    const c = t[0];
    if (c !== '{' && c !== '[') {
      return null;
    }
    try {
      const parsed: unknown = JSON.parse(t);
      if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as object;
      }
    } catch {
      return null;
    }
  }
  return null;
}

function isEnvelopeSuccess(value: unknown): boolean {
  return value === true || value === 1 || value === 'true';
}

function isEnvelopeFailure(value: unknown): boolean {
  return value === false || value === 0 || value === 'false';
}

/**
 * Parses a JSON body from an HTTP response into the app's standard `{ success, data | error }` envelope.
 * When the body is missing or not a valid envelope, returns a synthetic failure with HTTP `status`.
 *
 * @param path - Request path (stored on the error object for debugging).
 * @param status - HTTP status code from the transport layer.
 * @param body - `response.data` from axios (object or JSON string).
 */
export function parseApiResponse<T>(path: string, status: number, body: unknown): ApiResponse<T> {
  const obj = normalizeApiResponseBody(body);
  if (obj !== null && 'success' in obj) {
    const r = obj as ApiResponse<T>;
    if (isEnvelopeSuccess(r.success)) {
      const raw = r as { success: unknown; data: T };
      return { success: true, data: raw.data };
    }
    if (isEnvelopeFailure(r.success) && 'error' in r) {
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

/**
 * Builds a failure envelope when the request fails before a normal HTTP envelope is returned
 * (e.g. network error, timeout, thrown exception).
 *
 * @param path - Request path (stored on the error object).
 * @param message - Human-readable error message (often `error.message`).
 */
export function networkFailure(path: string, message: string): ApiError {
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

const LOGIN_ROOT_KEYS = [
  'accessToken',
  'refreshToken',
  'userId',
  'hasUsername',
  'isBiometricEnrolled',
  'outcome',
  'status',
  'reference',
  'email',
  'access_token',
  'refresh_token',
  'user_id',
] as const;

/**
 * Merges `data` and root-level fields from a sign-in envelope. Some backends put tokens next to
 * `success` instead of inside `data`, or nest `data.data`.
 */
function coalesceLoginSuccessPayload(
  parsed: ApiResponse<LoginResponseData>,
): Record<string, unknown> {
  const root = parsed as unknown as Record<string, unknown>;
  const rawData = root.data;
  const fromData =
    rawData != null && typeof rawData === 'object' && !Array.isArray(rawData)
      ? { ...(rawData as Record<string, unknown>) }
      : {};

  const d: Record<string, unknown> = { ...fromData };

  for (const key of LOGIN_ROOT_KEYS) {
    const v = root[key];
    if (v !== undefined) {
      d[key] = v;
    }
  }

  const nested = fromData.data;
  if (nested != null && typeof nested === 'object' && !Array.isArray(nested)) {
    const innerObj = nested as Record<string, unknown>;
    for (const key of LOGIN_ROOT_KEYS) {
      if (d[key] === undefined && innerObj[key] !== undefined) {
        d[key] = innerObj[key];
      }
    }
  }

  if (typeof d.accessToken !== 'string' && typeof d.access_token === 'string') {
    d.accessToken = d.access_token;
  }
  if (typeof d.refreshToken !== 'string' && typeof d.refresh_token === 'string') {
    d.refreshToken = d.refresh_token;
  }
  if (typeof d.userId !== 'string' && typeof d.user_id === 'string') {
    d.userId = d.user_id;
  }

  return d;
}

function buildAuthenticatedPayload(
  d: Record<string, unknown>,
): Extract<LoginResponseData, { outcome: 'AUTHENTICATED' }> {
  const hasUsername = typeof d.hasUsername === 'boolean' ? d.hasUsername : true;
  const userId = typeof d.userId === 'string' ? d.userId : '';
  const accessToken = d.accessToken as string;
  const refreshToken = d.refreshToken as string;
  if (typeof d.isBiometricEnrolled === 'boolean') {
    return {
      outcome: 'AUTHENTICATED',
      accessToken,
      refreshToken,
      hasUsername,
      userId,
      isBiometricEnrolled: d.isBiometricEnrolled,
    };
  }
  return {
    outcome: 'AUTHENTICATED',
    accessToken,
    refreshToken,
    hasUsername,
    userId,
  };
}

/**
 * Normalizes a successful sign-in API `data` payload into the `LoginResponseData` union used by the app.
 *
 * Handles:
 * - Pending verification: `outcome` or `status` === `PENDING_VERIFICATION`, plus `reference` / `email`.
 * - Authenticated: tokens + optional `hasUsername` (defaults to `true` if omitted).
 * - Bare `accessToken` + `refreshToken` without `outcome` (treated as authenticated).
 * - Tokens on the response root (sibling to `data`) or under `data.data`, plus snake_case aliases.
 *
 * @param body - Original login request (used for email when the API omits it on pending flows).
 * @param parsed - Result of {@link parseApiResponse} for the same response; error envelopes are returned unchanged.
 */
export function normalizeLoginResponse(
  body: LoginRequest,
  parsed: ApiResponse<LoginResponseData>,
): ApiResponse<LoginResponseData> {
  if (!parsed.success) {
    return parsed;
  }

  const d = coalesceLoginSuccessPayload(parsed);

  const pendingByOutcome = d.outcome === 'PENDING_VERIFICATION';
  const pendingByStatus = d.status === 'PENDING_VERIFICATION';

  if (pendingByOutcome || pendingByStatus) {
    const reference = typeof d.reference === 'string' ? d.reference : '';
    const emailFromApi = typeof d.email === 'string' && d.email.length > 0 ? d.email : body.email;
    return {
      success: true,
      data: {
        outcome: 'PENDING_VERIFICATION',
        reference,
        email: emailFromApi,
      },
    };
  }
  if (d.outcome === 'AUTHENTICATED') {
    if (typeof d.accessToken !== 'string' || typeof d.refreshToken !== 'string') {
      return parsed;
    }
    return {
      success: true,
      data: buildAuthenticatedPayload(d),
    };
  }

  if (typeof d.accessToken === 'string' && typeof d.refreshToken === 'string') {
    return {
      success: true,
      data: buildAuthenticatedPayload(d),
    };
  }

  return parsed;
}

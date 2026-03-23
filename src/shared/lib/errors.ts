export type AppError = {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
};

function pickString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export function toAppError(error: unknown): AppError {
  if (error === null || error === undefined) return { message: 'Unknown error' };
  if (typeof error === 'string') return { message: error };

  if (typeof error !== 'object') return { message: 'Unknown error' };
  const err = error as Record<string, unknown>;

  const success = err.success;
  if (success === false && err.error !== undefined) {
    return toAppError(err.error);
  }

  const message =
    pickString(err.message) ??
    (typeof err.error === 'string' ? err.error : undefined) ??
    (err.error && typeof err.error === 'object'
      ? pickString((err.error as Record<string, unknown>).message)
      : undefined) ??
    'Unknown error';

  return {
    message,
    code:
      pickString(err.code) ??
      (typeof err.statusCode === 'number' ? String(err.statusCode) : pickString(err.statusCode)),
    details: pickString(err.details) ?? pickString(err.path),
    hint: pickString(err.hint) ?? pickString(err.timestamp),
  };
}
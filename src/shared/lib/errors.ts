export type AppError = {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
};

export function toAppError(error: unknown): AppError {
  if (!error) return { message: 'Unknown error' };
  if (typeof error === 'string') return { message: error };
  if (error instanceof Error) return { message: error.message };

  const err = error as { message?: string; code?: string; details?: string; hint?: string };
  return {
    message: err.message || 'Unknown error',
    code: err.code,
    details: err.details,
    hint: err.hint,
  };
}

import type { AppError } from './errors';

export type Result<T> = {
  data: T | null;
  error: AppError | null;
};

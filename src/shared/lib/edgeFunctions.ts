import { supabase } from './supabaseClient';
import { toAppError } from './errors';
import type { Result } from './result';

export async function callEdgeFunction<T>(
  name: string,
  payload?: Record<string, unknown>
): Promise<Result<T>> {
  try {
    const { data, error } = await supabase.functions.invoke(name, {
      body: payload ?? {},
    });

    if (error) {
      return { data: null, error: toAppError(error) };
    }

    if (data?.error) {
      return { data: null, error: toAppError(data.error) };
    }

    return { data: data as T, error: null };
  } catch (err) {
    return { data: null, error: toAppError(err) };
  }
}

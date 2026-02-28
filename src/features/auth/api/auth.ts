import { supabase } from '@/shared/lib/supabaseClient';
import type {
  AuthUser,
  UserData,
  SessionSnapshot,
  SignUpParams,
  SignInParams,
} from '@/shared/types';

export type { SignUpParams, SignInParams };

function mapSessionUser(user: { id: string; email?: string | null } | null): AuthUser | null {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email ?? undefined,
  };
}

export async function getSession(): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn('Error getting session', error);
    return null;
  }
  return mapSessionUser(data.session?.user ?? null);
}

export async function getSessionWithToken(): Promise<SessionSnapshot> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn('Error getting session', error);
    return { user: null, accessToken: null };
  }
  const session = data.session;
  return {
    user: mapSessionUser(session?.user ?? null),
    accessToken: session?.access_token ?? null,
  };
}

export function subscribeToAuthChanges(
  onSession: (user: AuthUser | null, accessToken: string | null) => void
): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    onSession(
      mapSessionUser(session?.user ?? null),
      session?.access_token ?? null
    );
  });
  return () => subscription.unsubscribe();
}

export async function ensureProfile(userId: string): Promise<{ error?: { message: string } }> {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId }, { onConflict: 'id', ignoreDuplicates: true })
    .select('id')
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error ensuring profile', error);
    return { error: { message: error.message } };
  }
  return {};
}

export async function signUp(params: SignUpParams): Promise<{ error?: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
    });

    if (error) {
      console.error('signUp error', error);
      return { error: error.message };
    }

    if (data.session?.user?.id) {
      await ensureProfile(data.session.user.id);
    }

    return {};
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('signUp exception', e);
    return { error: message };
  }
}

export async function signIn(params: SignInParams): Promise<{ error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });

    if (error) {
      console.error('signIn error', error);
      return { error: error.message };
    }

    if (data.user?.id) {
      await ensureProfile(data.user.id);
    }

    return {};
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('signIn exception', e);
    return { error: message };
  }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

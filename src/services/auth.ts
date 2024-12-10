import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';

const SUPABASE_CALLBACK_URL = 'https://ppywzrizeqvtxhbfscki.supabase.co/auth/v1/callback';

export class AuthService {
  static async signInWithEmail(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  }

  static async signInWithGoogle() {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: SUPABASE_CALLBACK_URL,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  }

  static async signInWithApple() {
    return supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: SUPABASE_CALLBACK_URL,
      },
    });
  }

  static async signUp(email: string, password: string) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: SUPABASE_CALLBACK_URL,
      },
    });
  }

  static async signOut() {
    return supabase.auth.signOut();
  }

  static async getSession() {
    return supabase.auth.getSession();
  }

  static onAuthStateChange(callback: (event: any, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
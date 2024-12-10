import { supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';

const SUPABASE_CALLBACK_URL = 'http://localhost:8080/auth/callback';

export class AuthService {
  static async signInWithEmail(email: string, password: string) {
    console.log('AuthService: Signing in with email:', email);
    return supabase.auth.signInWithPassword({ email, password });
  }

  static async signInWithGoogle() {
    console.log('AuthService: Signing in with Google');
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
    console.log('AuthService: Signing in with Apple');
    return supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: SUPABASE_CALLBACK_URL,
      },
    });
  }

  static async signUp(email: string, password: string) {
    console.log('AuthService: Signing up with email:', email);
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: SUPABASE_CALLBACK_URL,
        data: {
          email: email,
        }
      },
    });
  }

  static async signOut() {
    console.log('AuthService: Signing out');
    return supabase.auth.signOut();
  }

  static async getSession() {
    console.log('AuthService: Getting session');
    return supabase.auth.getSession();
  }

  static onAuthStateChange(callback: (event: any, session: any) => void) {
    console.log('AuthService: Setting up auth state change listener');
    return supabase.auth.onAuthStateChange(callback);
  }
}
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { AuthService } from '@/services/auth';
import { useAuthToast } from '@/hooks/useAuthToast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showSuccessToast, showErrorToast } = useAuthToast();

  useEffect(() => {
    console.log('AuthProvider: Checking session...');
    
    AuthService.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Initial session:', session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = AuthService.onAuthStateChange((_event, session) => {
      console.log('AuthProvider: Auth state changed:', _event, session);
      setUser(session?.user ?? null);
    });

    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Attempting sign in with email:', email);
      const { error } = await AuthService.signInWithEmail(email, password);
      
      if (error) throw error;
      
      showSuccessToast("Welcome back!", "You have successfully signed in.");
    } catch (error: any) {
      console.error('AuthProvider: Sign in error:', error);
      showErrorToast(error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('AuthProvider: Attempting Google sign in...');
      const { error } = await AuthService.signInWithGoogle();
      
      if (error) throw error;
    } catch (error: any) {
      console.error('AuthProvider: Google sign in error:', error);
      showErrorToast(error);
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      console.log('AuthProvider: Attempting Apple sign in...');
      const { error } = await AuthService.signInWithApple();
      
      if (error) throw error;
    } catch (error: any) {
      console.error('AuthProvider: Apple sign in error:', error);
      showErrorToast(error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Attempting sign up with email:', email);
      const { error } = await AuthService.signUp(email, password);
      
      if (error) throw error;
      
      showSuccessToast("Success!", "Please check your email for verification.");
    } catch (error: any) {
      console.error('AuthProvider: Sign up error:', error);
      showErrorToast(error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthProvider: Attempting sign out...');
      const { error } = await AuthService.signOut();
      
      if (error) throw error;
      
      showSuccessToast("Signed out", "You have been successfully signed out.");
    } catch (error: any) {
      console.error('AuthProvider: Sign out error:', error);
      showErrorToast(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      signInWithGoogle,
      signInWithApple 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
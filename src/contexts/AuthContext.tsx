import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
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

// Mock user for development
const mockUser: User = {
  id: 'mock-user-id',
  email: 'mock@example.com',
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  role: 'authenticated',
  updated_at: new Date().toISOString(),
  app_metadata: {
    provider: 'email',
    providers: ['email'],
  },
  user_metadata: {},
  identities: [],
  phone: '',
  confirmed_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  banned_until: null,
  confirmation_sent_at: new Date().toISOString(),
  recovery_sent_at: null,
  email_change_sent_at: null,
  new_email: null,
  invited_at: null,
  action_link: null,
  email_change: null,
  phone_change: null,
  phone_confirmed_at: null,
  factors: [],
  last_sign_in_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { showSuccessToast } = useAuthToast();

  // Mock authentication methods
  const signIn = async () => {
    console.log('Mock sign in');
    showSuccessToast("Welcome back!", "You have successfully signed in.");
  };

  const signInWithGoogle = async () => {
    console.log('Mock Google sign in');
  };

  const signInWithApple = async () => {
    console.log('Mock Apple sign in');
  };

  const signUp = async () => {
    console.log('Mock sign up');
    showSuccessToast("Success!", "Account created successfully.");
  };

  const signOut = async () => {
    console.log('Mock sign out');
    showSuccessToast("Signed out", "You have been successfully signed out.");
  };

  return (
    <AuthContext.Provider value={{ 
      user: mockUser, 
      loading: false, 
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
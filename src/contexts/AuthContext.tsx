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
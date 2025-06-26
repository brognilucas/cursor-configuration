import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthApi, AuthResponse } from '../types/Auth';

interface AuthContextValue {
  user: AuthResponse | null;
  signin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  authApi: AuthApi;
  children: React.ReactNode;
}

const LOCAL_STORAGE_KEY = 'auth-user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ authApi, children }) => {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [user]);

  const signin = useCallback(async (email: string, password: string) => {
    const result = await authApi.signin(email, password);
    setUser(result);
  }, [authApi]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const result = await authApi.signup(name, email, password);
    setUser(result);
  }, [authApi]);

  const signout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
} 
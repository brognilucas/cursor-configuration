import React, { createContext, useContext } from 'react';
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

function useAuthLogic(authApi: AuthApi) {
  const [user, setUser] = React.useState<AuthResponse | null>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  React.useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [user]);

  const signin = React.useCallback(async (email: string, password: string) => {
    const result = await authApi.signin(email, password);
    setUser(result);
  }, [authApi]);

  const signup = React.useCallback(async (name: string, email: string, password: string) => {
    const result = await authApi.signup(name, email, password);
    setUser(result);
  }, [authApi]);

  const signout = React.useCallback(() => {
    setUser(null);
  }, []);

  return { user, signin, signup, signout };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ authApi, children }) => {
  const value = useAuthLogic(authApi);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { useAuthLogic }; 
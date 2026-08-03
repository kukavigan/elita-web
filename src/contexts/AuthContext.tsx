import { createContext, useCallback, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authApi, ApiUser } from '@/services/api';
import {
  AUTH_INVALIDATED_EVENT,
  TOKEN_STORAGE_KEY,
  getToken,
  setToken,
  clearToken,
} from '@/lib/apiClient';

interface AuthContextValue {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSessionState = useCallback(() => {
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  // Hydrate from stored token on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .getMe()
      .then(currentUser => {
        if (getToken()) setUser(currentUser);
      })
      .catch(() => {
        clearToken();
        clearSessionState();
      })
      .finally(() => setIsLoading(false));
  }, [clearSessionState]);

  useEffect(() => {
    const handleInvalidatedSession = () => clearSessionState();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === TOKEN_STORAGE_KEY && !event.newValue) clearSessionState();
    };

    window.addEventListener(AUTH_INVALIDATED_EVENT, handleInvalidatedSession);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(AUTH_INVALIDATED_EVENT, handleInvalidatedSession);
      window.removeEventListener('storage', handleStorage);
    };
  }, [clearSessionState]);

  const login = async (email: string, password: string) => {
    const { user: u, token } = await authApi.login(email, password);
    setToken(token);
    setUser(u);
  };

  const register = async (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => {
    const { user: u, token } = await authApi.register(data);
    setToken(token);
    setUser(u);
  };

  const logout = () => {
    clearToken();
    clearSessionState();
  };

  const refreshUser = async () => {
    const u = await authApi.getMe();
    setUser(u);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

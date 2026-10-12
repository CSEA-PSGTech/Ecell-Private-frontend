import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';
import { authService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpired: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password: string, department?: string, accountType?: 'student' | 'company') => Promise<void>;
  logout: () => Promise<void>;
  switchPersona: (userId: string) => void;
  clearSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }, [user]);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    setSessionExpired(false);
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.refreshToken);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const signup = async (name: string, email: string, password: string, department?: string, accountType: 'student' | 'company' = 'student') => {
    setIsLoading(true);
    setSessionExpired(false);
    try {
      const res = await authService.signup(name, email, password, department, accountType);
      setUser(res.user);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.refreshToken);
    } finally {
      setIsLoading(false);
    }
  };

  const switchPersona = (userId: string) => {
    console.warn(`Persona switching is unavailable with the backend API (${userId}).`);
  };

  const clearSessionExpired = () => {
    setSessionExpired(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        sessionExpired,
        login,
        signup,
        logout,
        switchPersona,
        clearSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

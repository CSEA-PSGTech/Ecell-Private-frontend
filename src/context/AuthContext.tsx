import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';
import { SEED_USERS } from '@/utils/seedData';
import { authService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpired: boolean;
  login: (email: string, password?: string) => Promise<void>;
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
    // Default logged in user for instant preview: Alex Mercer (student)
    return SEED_USERS[0];
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

  const switchPersona = (userId: string) => {
    const target = SEED_USERS.find((u) => u.id === userId);
    if (target) {
      setUser(target);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, `mock-token-${target.id}`);
    }
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

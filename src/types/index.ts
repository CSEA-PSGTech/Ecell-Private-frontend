export type ThemeMode = 'dark' | 'light';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'lead';
  avatarUrl?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  badge?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface StatMetric {
  id: string;
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

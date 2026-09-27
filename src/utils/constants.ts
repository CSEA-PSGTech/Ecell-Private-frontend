import type { NavItem } from '@/types';

export const APP_CONFIG = {
  NAME: 'E-Cell Portal',
  ORGANIZATION: 'Entrepreneurship Cell',
  VERSION: '1.0.0',
  DEFAULT_THEME: 'dark' as const,
};

export const NAV_LINKS: NavItem[] = [
  { label: 'Home', path: '/' },

];

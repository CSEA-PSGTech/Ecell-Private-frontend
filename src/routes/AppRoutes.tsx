import React from 'react';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

interface AppRoutesProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ currentPath, onNavigate }) => {
  switch (currentPath) {
    case '/':
      return <HomePage onNavigate={onNavigate} />;
    default:
      return <NotFoundPage onNavigate={onNavigate} />;
  }
};

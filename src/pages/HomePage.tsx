import React, { useEffect } from 'react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  useEffect(() => {
    onNavigate('/discover');
  }, [onNavigate]);

  return null;
};

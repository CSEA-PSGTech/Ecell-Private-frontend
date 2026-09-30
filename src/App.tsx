import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ProjectDataProvider } from '@/context/ProjectDataContext';
import { AppRoutes } from '@/routes/AppRoutes';
import '@/styles/global.css';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectDataProvider>
          <AppRoutes />
        </ProjectDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

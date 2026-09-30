import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DiscoverProjectsPage } from '@/pages/DiscoverProjectsPage';
import { ApplicationsPage } from '@/pages/ApplicationsPage';
import { WorkspacePage } from '@/pages/WorkspacePage';
import { AdminPage } from '@/pages/AdminPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // Internal path state supporting browser history
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname;
    if (p && p !== '/') return p;
    // Default route based on authentication
    return user ? (user.role === 'admin' ? '/admin' : '/discover') : '/login';
  });

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState(null, '', path);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update default route when user logs in/out or switches persona
  useEffect(() => {
    if (!isAuthenticated) {
      if (currentPath !== '/login') {
        navigate('/login');
      }
    } else {
      if (currentPath === '/login' || currentPath === '/') {
        navigate(user?.role === 'admin' ? '/admin' : '/discover');
      }
    }
  }, [isAuthenticated, user?.role]);

  // Auth Guard
  if (!isAuthenticated) {
    return (
      <LoginPage
        onSuccess={(role) => {
          navigate(role === 'admin' ? '/admin' : '/discover');
        }}
      />
    );
  }

  const isAdmin = user?.role === 'admin';

  // Role Guard: Student cannot access Admin URLs, Admin routes to Admin suite
  if (currentPath.startsWith('/admin') && !isAdmin) {
    return (
      <AppLayout currentPath="/discover" onNavigate={navigate}>
        <DiscoverProjectsPage onOpenWorkspace={(id) => navigate(`/workspace/${id}`)} />
      </AppLayout>
    );
  }

  if ((currentPath === '/applications' || currentPath.startsWith('/workspace')) && isAdmin) {
    return (
      <AppLayout currentPath="/admin" onNavigate={navigate}>
        <AdminPage
          currentTab="projects"
          onTabChange={(tab) => navigate(`/admin/${tab}`)}
        />
      </AppLayout>
    );
  }

  // Routing View Resolution
  const renderContent = () => {
    if (currentPath === '/discover') {
      return <DiscoverProjectsPage onOpenWorkspace={(id) => navigate(`/workspace/${id}`)} />;
    }

    if (currentPath === '/applications') {
      return (
        <ApplicationsPage
          onNavigateToDiscover={() => navigate('/discover')}
          onOpenWorkspace={(id) => navigate(`/workspace/${id}`)}
        />
      );
    }

    if (currentPath.startsWith('/workspace')) {
      const parts = currentPath.split('/');
      const projectId = parts[2];
      return (
        <WorkspacePage
          initialProjectId={projectId}
          onNavigateToDiscover={() => navigate('/discover')}
        />
      );
    }

    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      let tab: 'projects' | 'applications' | 'roles' | 'analytics' = 'projects';
      if (currentPath.includes('/applications')) tab = 'applications';
      else if (currentPath.includes('/roles')) tab = 'roles';
      else if (currentPath.includes('/analytics')) tab = 'analytics';

      return (
        <AdminPage
          currentTab={tab}
          onTabChange={(newTab) => navigate(`/admin/${newTab}`)}
        />
      );
    }

    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <AppLayout currentPath={currentPath} onNavigate={navigate}>
      {renderContent()}
    </AppLayout>
  );
};

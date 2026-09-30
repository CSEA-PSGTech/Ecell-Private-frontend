import React from 'react';
import { useProjectData } from '@/context/ProjectDataContext';
import { AdminProjectsView } from '@/features/admin/AdminProjectsView';
import { AdminApplicationsView } from '@/features/admin/AdminApplicationsView';
import { AdminRolesView } from '@/features/admin/AdminRolesView';
import { AdminAnalyticsView } from '@/features/admin/AdminAnalyticsView';
import { Tabs } from '@/components/common/Tabs';

interface AdminPageProps {
  currentTab?: 'projects' | 'applications' | 'roles' | 'analytics';
  onTabChange: (tab: 'projects' | 'applications' | 'roles' | 'analytics') => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  currentTab = 'projects',
  onTabChange,
}) => {
  const {
    projects,
    applications,
    memberships,
    analytics,
    createProject,
    updateProjectStatus,
    updateApplicationStatus,
    updateMemberRole,
  } = useProjectData();

  const pendingAppsCount = applications.filter((a) => a.status === 'Under Review').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Admin Suite Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Administrative Suite
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(168, 85, 247, 0.12)',
                color: '#a855f7',
                border: '1px solid rgba(168, 85, 247, 0.25)',
              }}
            >
              Board Oversight
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Configure innovation projects, review student admission queues, and allocate leadership roles.
          </p>
        </div>

        {/* Tab Navigation */}
        <Tabs
          tabs={[
            { id: 'projects', label: 'Projects', count: projects.length },
            { id: 'applications', label: 'Review Queue', count: pendingAppsCount },
            { id: 'roles', label: 'Roles' },
            { id: 'analytics', label: 'Analytics' },
          ]}
          activeTab={currentTab}
          onChange={(tab) => onTabChange(tab as any)}
        />
      </div>

      {/* Render Active View */}
      {currentTab === 'projects' && (
        <AdminProjectsView
          projects={projects}
          onCreateProject={createProject}
          onUpdateStatus={updateProjectStatus}
        />
      )}

      {currentTab === 'applications' && (
        <AdminApplicationsView
          applications={applications}
          onReviewApplication={updateApplicationStatus}
        />
      )}

      {currentTab === 'roles' && (
        <AdminRolesView
          projects={projects}
          memberships={memberships}
          onUpdateRole={updateMemberRole}
        />
      )}

      {currentTab === 'analytics' && (
        <AdminAnalyticsView analytics={analytics} />
      )}
    </div>
  );
};

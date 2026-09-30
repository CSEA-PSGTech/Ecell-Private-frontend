import React, { useState } from 'react';
import { FileCheck2, Clock, CheckCircle2 } from 'lucide-react';
import type { Application } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useProjectData } from '@/context/ProjectDataContext';
import { ApplicationsTable } from '@/features/applications/ApplicationsTable';
import { ApplicationDetailModal } from '@/features/applications/ApplicationDetailModal';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { calculateCompletionPercentage } from '@/utils/formatters';

interface ApplicationsPageProps {
  onNavigateToDiscover: () => void;
  onOpenWorkspace: (projectId: string) => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  onNavigateToDiscover,
  onOpenWorkspace,
}) => {
  const { user } = useAuth();
  const { applications } = useProjectData();

  const [activeModalApp, setActiveModalApp] = useState<Application | null>(null);

  // Student's own applications
  const myApps = applications.filter((a) => a.studentId === user?.id);
  const underReviewCount = myApps.filter((a) => a.status === 'Under Review').length;
  const acceptedCount = myApps.filter((a) => a.status === 'Accepted').length;
  const acceptedRatio = myApps.length > 0 ? calculateCompletionPercentage(acceptedCount, myApps.length) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          My Applications
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Track the status of your submitted project proposals and cohort applications.
        </p>
      </div>

      {/* Top Stat Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Submissions</span>
            <FileCheck2 size={16} color="var(--brand-primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {myApps.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Active applications in cycle
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Under Review</span>
            <Clock size={16} color="var(--status-warning)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--status-warning)' }}>
            {underReviewCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Awaiting committee review
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accepted Ratio</span>
            <CheckCircle2 size={16} color="var(--status-success)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--status-success)' }}>
            {acceptedRatio}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {acceptedCount} approved of {myApps.length}
          </div>
        </Card>
      </div>

      {/* Applications Table or Empty State */}
      {myApps.length === 0 ? (
        <EmptyState
          icon={<FileCheck2 size={32} />}
          message="You have not submitted any project applications for this cycle yet."
          actionLabel="Discover Projects"
          onAction={onNavigateToDiscover}
        />
      ) : (
        <ApplicationsTable
          applications={myApps}
          onViewDetails={(app) => setActiveModalApp(app)}
          onOpenProjectWorkspace={onOpenWorkspace}
        />
      )}

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        application={activeModalApp}
        isOpen={!!activeModalApp}
        onClose={() => setActiveModalApp(null)}
      />
    </div>
  );
};

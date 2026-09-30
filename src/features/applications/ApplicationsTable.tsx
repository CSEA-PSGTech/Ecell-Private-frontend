import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import type { Application } from '@/types';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { formatDate } from '@/utils/formatters';

interface ApplicationsTableProps {
  applications: Application[];
  onViewDetails: (app: Application) => void;
  onOpenProjectWorkspace?: (projectId: string) => void;
}

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  onViewDetails,
  onOpenProjectWorkspace,
}) => {
  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
        <thead>
          <tr
            style={{
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-muted)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <th style={{ padding: '0.75rem 1.25rem' }}>Project</th>
            <th style={{ padding: '0.75rem 1rem' }}>Submitted Date</th>
            <th style={{ padding: '0.75rem 1rem' }}>Status</th>
            <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app.id}
              style={{
                borderBottom: '1px solid var(--border-subtle)',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <td style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{app.projectTitle}</span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        padding: '0.1rem 0.35rem',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--brand-primary-light)',
                        color: 'var(--brand-primary)',
                      }}
                    >
                      {app.projectCode}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Department: {app.studentDepartment}
                  </span>
                </div>
              </td>

              <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                {formatDate(app.submittedDate)}
              </td>

              <td style={{ padding: '1rem' }}>
                <Badge
                  variant={
                    app.status === 'Accepted'
                      ? 'success'
                      : app.status === 'Rejected'
                      ? 'error'
                      : 'warning'
                  }
                  dot
                >
                  {app.status}
                </Badge>
              </td>

              <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(app)}
                    icon={<Eye size={13} />}
                  >
                    View Details
                  </Button>

                  {app.status === 'Accepted' && onOpenProjectWorkspace && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onOpenProjectWorkspace(app.projectId)}
                      icon={<ArrowRight size={13} />}
                    >
                      Open Workspace
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

import React, { useState } from 'react';
import { Check, X, ExternalLink, CheckCircle2 } from 'lucide-react';
import type { Application } from '@/types';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Tabs } from '@/components/common/Tabs';
import { formatDate } from '@/utils/formatters';

interface AdminApplicationsViewProps {
  applications: Application[];
  onReviewApplication: (id: string, status: 'Accepted' | 'Rejected') => Promise<void>;
}

export const AdminApplicationsView: React.FC<AdminApplicationsViewProps> = ({
  applications,
  onReviewApplication,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const pendingApps = applications.filter((a) => a.status === 'Under Review');
  const reviewedApps = applications.filter((a) => a.status === 'Accepted' || a.status === 'Rejected');

  const handleReview = async (id: string, status: 'Accepted' | 'Rejected', studentName: string) => {
    setProcessingId(id);
    try {
      await onReviewApplication(id, status);
      if (status === 'Accepted') {
        setSuccessToast(`Accepted ${studentName}. Enrolled automatically as project member.`);
      } else {
        setSuccessToast(`Application for ${studentName} rejected.`);
      }
      setTimeout(() => setSuccessToast(null), 4000);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Success alert message for 1-step acceptance */}
      {successToast && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success)',
            border: '1px solid var(--status-success-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            animation: 'fadeIn 150ms ease',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Tabs
          tabs={[
            { id: 'pending', label: 'Review Queue', count: pendingApps.length },
            { id: 'reviewed', label: 'Reviewed History', count: reviewedApps.length },
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as 'pending' | 'reviewed')}
        />

        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {activeTab === 'pending'
            ? 'Accepting auto-enrolls the student as a project member'
            : 'Audit log of past decisions'}
        </span>
      </div>

      {/* Table view */}
      {activeTab === 'pending' ? (
        pendingApps.length === 0 ? (
          <div
            style={{
              padding: '3.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
            }}
          >
            Review queue is clear. No applications are currently awaiting review.
          </div>
        ) : (
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
                  <th style={{ padding: '0.75rem 1.25rem' }}>Candidate</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Project</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Dept</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Submitted</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Statement / Portfolio</th>
                  <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Decision</th>
                </tr>
              </thead>
              <tbody>
                {pendingApps.map((app) => {
                  const isProcessing = processingId === app.id;

                  return (
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
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{app.studentName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {app.studentRollNumber || app.studentEmail}
                        </div>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{app.projectTitle}</span>
                          <span
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              padding: '0.1rem 0.35rem',
                              borderRadius: 'var(--radius-xs)',
                              backgroundColor: 'var(--brand-primary-light)',
                              color: 'var(--brand-primary)',
                            }}
                          >
                            {app.projectCode}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: 'var(--radius-xs)',
                            backgroundColor: 'var(--bg-elevated)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {app.studentDepartment}
                        </span>
                      </td>

                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        {formatDate(app.submittedDate)}
                      </td>

                      <td style={{ padding: '1rem', maxWidth: '240px' }}>
                        {app.statement && (
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-secondary)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={app.statement}
                          >
                            {app.statement}
                          </div>
                        )}
                        {app.portfolioUrl && (
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.7rem',
                              color: 'var(--brand-primary)',
                              marginTop: '0.2rem',
                            }}
                          >
                            <span>Portfolio Link</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </td>

                      {/* Single action for acceptance + membership creation */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={isProcessing}
                            onClick={() => handleReview(app.id, 'Rejected', app.studentName)}
                            icon={<X size={13} />}
                            style={{ color: 'var(--status-danger)' }}
                          >
                            Reject
                          </Button>

                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isProcessing}
                            isLoading={isProcessing}
                            onClick={() => handleReview(app.id, 'Accepted', app.studentName)}
                            icon={<Check size={13} />}
                          >
                            Accept & Enroll
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : (
        /* Reviewed tab (History) */
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
                <th style={{ padding: '0.75rem 1.25rem' }}>Candidate</th>
                <th style={{ padding: '0.75rem 1rem' }}>Project</th>
                <th style={{ padding: '0.75rem 1rem' }}>Dept</th>
                <th style={{ padding: '0.75rem 1rem' }}>Reviewed Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Outcome</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Reviewed By</th>
              </tr>
            </thead>
            <tbody>
              {reviewedApps.map((app) => (
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
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{app.studentName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {app.studentRollNumber || app.studentEmail}
                    </div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{app.projectTitle}</span>
                  </td>

                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {app.studentDepartment}
                  </td>

                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {formatDate(app.reviewedAt || app.submittedDate)}
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <Badge variant={app.status === 'Accepted' ? 'success' : 'error'} dot>
                      {app.status}
                    </Badge>
                  </td>

                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                    {app.reviewedBy || 'Admin Board'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

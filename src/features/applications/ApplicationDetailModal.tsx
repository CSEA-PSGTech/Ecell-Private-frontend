import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Application } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { formatDate } from '@/utils/formatters';

interface ApplicationDetailModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  isOpen,
  onClose,
}) => {
  if (!application) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{application.projectTitle}</span>
          <Badge size="sm" variant="primary">
            {application.projectCode}
          </Badge>
        </div>
      }
      subtitle={`Submitted on ${formatDate(application.submittedDate)}`}
      maxWidth="500px"
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Status card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Review Status</span>
            <div style={{ marginTop: '0.2rem' }}>
              <Badge
                variant={
                  application.status === 'Accepted'
                    ? 'success'
                    : application.status === 'Rejected'
                    ? 'error'
                    : 'warning'
                }
                dot
              >
                {application.status}
              </Badge>
            </div>
          </div>

          {application.reviewedAt && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reviewed on</span>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {formatDate(application.reviewedAt)}
              </div>
            </div>
          )}
        </div>

        {/* Applicant details */}
        <div>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Applicant Information
          </h4>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 500 }}>
            {application.studentName} ({application.studentRollNumber || 'N/A'})
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {application.studentEmail} • Dept: {application.studentDepartment}
          </div>
        </div>

        {/* Statement */}
        {application.statement && (
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Statement of Technical Intent
            </h4>
            <div
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                padding: '0.75rem',
                backgroundColor: 'var(--bg-input)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {application.statement}
            </div>
          </div>
        )}

        {/* Portfolio */}
        {application.portfolioUrl && (
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Code Portfolio
            </h4>
            <a
              href={application.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8125rem',
                color: 'var(--brand-primary)',
              }}
            >
              <span>{application.portfolioUrl}</span>
              <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
};

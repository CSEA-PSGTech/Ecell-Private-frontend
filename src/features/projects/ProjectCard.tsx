import React from 'react';
import { Clock, ArrowRight, User } from 'lucide-react';
import type { Project } from '@/types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { getDaysRemaining } from '@/utils/formatters';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  applicationStatus?: string;
  isMember?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
  applicationStatus,
  isMember,
}) => {
  const { text: deadlineText, days } = getDaysRemaining(project.deadline);
  const isUrgent = days <= 3;

  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--brand-primary)',
                backgroundColor: 'var(--brand-primary-light)',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              {project.code}
            </span>
            {isMember ? (
              <Badge size="sm" variant="success">
                Enrolled
              </Badge>
            ) : applicationStatus ? (
              <Badge size="sm" variant={applicationStatus === 'Accepted' ? 'success' : applicationStatus === 'Rejected' ? 'error' : 'warning'}>
                {applicationStatus}
              </Badge>
            ) : null}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              color: isUrgent ? 'var(--status-warning)' : 'var(--text-muted)',
              fontWeight: isUrgent ? 600 : 500,
            }}
          >
            <Clock size={13} />
            <span>{deadlineText}</span>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.0625rem',
            fontWeight: 600,
            color: 'var(--text-main)',
            marginBottom: '0.4rem',
            lineHeight: 1.3,
          }}
        >
          {project.title}
        </h3>

        {/* Short Description */}
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </p>

        {/* Department Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
          {project.departments.map((dept) => (
            <span
              key={dept}
              style={{
                fontSize: '0.7rem',
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontWeight: 500,
              }}
            >
              {dept}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Details & Action */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <User size={13} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {project.mentorName}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(project)}
          icon={<ArrowRight size={13} />}
          style={{ flexDirection: 'row-reverse' }}
        >
          View details
        </Button>
      </div>
    </Card>
  );
};

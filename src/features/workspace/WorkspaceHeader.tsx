import React from 'react';
import { ChevronDown, Kanban, Eye, Users } from 'lucide-react';
import type { Project, ProjectRole } from '@/types';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';

interface WorkspaceHeaderProps {
  project: Project;
  userRole: ProjectRole;
  completionPercentage: number;
  totalTasks: number;
  completedTasks: number;
  availableProjects: { project: Project; role: ProjectRole }[];
  onSelectProject: (projectId: string) => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  project,
  userRole,
  completionPercentage,
  totalTasks,
  completedTasks,
  availableProjects,
  onSelectProject,
}) => {
  const roleConfig = {
    REPRESENTATIVE: { badgeVariant: 'primary' as const, icon: <Kanban size={14} /> },
    MEMBER: { badgeVariant: 'neutral' as const, icon: <Users size={14} /> },
    OWNER: { badgeVariant: 'purple' as const, icon: <Eye size={14} /> },
  }[userRole];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '1.75rem',
        backgroundColor: 'var(--bg-card)',
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Top Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Project selector / title */}
          {availableProjects.length > 1 ? (
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <select
                value={project.id}
                onChange={(e) => onSelectProject(e.target.value)}
                style={{
                  appearance: 'none',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.4rem 2.25rem 0.4rem 0.75rem',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  outline: 'none',
                  maxWidth: '340px',
                }}
              >
                {availableProjects.map(({ project: p, role: r }) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({r})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                style={{ position: 'absolute', right: '0.65rem', pointerEvents: 'none', color: 'var(--text-muted)' }}
              />
            </div>
          ) : (
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {project.title}
            </h1>
          )}

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--brand-primary)',
              backgroundColor: 'var(--brand-primary-light)',
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            {project.code}
          </span>

          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {project.departments.join(' · ')} &nbsp;·&nbsp; {project.mentorName}
          </span>
        </div>

        {/* Role badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {roleConfig.icon}
          <Badge variant={roleConfig.badgeVariant} dot>
            {userRole}
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.4rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            Progress — {completedTasks} of {totalTasks} tasks done
          </span>
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{completionPercentage}%</span>
        </div>
        <ProgressBar percentage={completionPercentage} showLabel={false} size="md" />
      </div>
    </div>
  );
};

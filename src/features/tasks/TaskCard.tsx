import React from 'react';
import { Clock, CheckCircle2, Circle, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import type { Task, ProjectRole } from '@/types';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { formatDate } from '@/utils/formatters';

interface TaskCardProps {
  task: Task;
  currentUserId: string;
  userRole: ProjectRole;
  onStatusChange: (taskId: string, newStatus: 'To do' | 'In progress' | 'Completed') => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  currentUserId,
  userRole,
  onStatusChange,
  onEditTask,
  onDeleteTask,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const isAssignedToMe = task.assigneeId === currentUserId;
  const isRepresentative = userRole === 'REPRESENTATIVE';
  const isMember = userRole === 'MEMBER';

  // Permission rule per spec:
  // - Representative can edit/delete and change any status
  // - Member can only mark THEIR OWN assigned tasks complete/incomplete
  // - Owner is strictly non-interactive
  const canToggleStatus = isRepresentative || (isMember && isAssignedToMe);
  const canManageTask = isRepresentative;

  const handleToggleCompleted = () => {
    if (!canToggleStatus) return;
    if (task.status === 'Completed') {
      onStatusChange(task.id, 'In progress');
    } else {
      onStatusChange(task.id, 'Completed');
    }
  };

  const priorityVariant =
    task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'info' : 'neutral';

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-fast)',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-strong)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        setMenuOpen(false);
      }}
    >
      {/* Top: Priority & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Badge size="sm" variant={priorityVariant}>
            {task.priority}
          </Badge>
          {isAssignedToMe && (
            <span
              style={{
                fontSize: '0.6875rem',
                color: 'var(--brand-primary)',
                fontWeight: 600,
                backgroundColor: 'var(--brand-primary-light)',
                padding: '0.1rem 0.35rem',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              My Task
            </span>
          )}
        </div>

        {canManageTask && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                color: 'var(--text-muted)',
                padding: '0.2rem',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
              }}
              title="Task options"
            >
              <MoreVertical size={14} />
            </button>

            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '0.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  zIndex: 20,
                  minWidth: '110px',
                }}
              >
                {onEditTask && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEditTask(task);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.35rem 0.5rem',
                      fontSize: '0.75rem',
                      color: 'var(--text-main)',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                )}
                {onDeleteTask && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDeleteTask(task.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.35rem 0.5rem',
                      fontSize: '0.75rem',
                      color: 'var(--status-danger)',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Title & Status Toggle */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        <button
          onClick={handleToggleCompleted}
          disabled={!canToggleStatus}
          style={{
            marginTop: '2px',
            color:
              task.status === 'Completed'
                ? 'var(--status-success)'
                : canToggleStatus
                ? 'var(--text-muted)'
                : 'var(--border-strong)',
            cursor: canToggleStatus ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
          }}
          title={
            canToggleStatus
              ? task.status === 'Completed'
                ? 'Mark incomplete'
                : 'Mark completed'
              : 'Read-only: can only change tasks assigned to you'
          }
        >
          {task.status === 'Completed' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
        </button>

        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: task.status === 'Completed' ? 'var(--text-muted)' : 'var(--text-main)',
            textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
            lineHeight: 1.35,
          }}
        >
          {task.title}
        </span>
      </div>

      {task.description && (
        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.4,
            margin: '0',
            paddingLeft: '1.5rem',
          }}
        >
          {task.description}
        </p>
      )}

      {/* Footer: Assignee & Due Date */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.5rem',
          marginTop: '0.2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Avatar name={task.assigneeName || 'Unassigned'} size="xs" />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {task.assigneeName || 'Unassigned'}
          </span>
        </div>

        {task.dueDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <Clock size={12} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

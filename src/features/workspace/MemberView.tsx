import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import type { Task } from '@/types';
import { KanbanBoard } from '@/features/tasks/KanbanBoard';

interface MemberViewProps {
  tasks: Task[];
  currentUserId: string;
  onUpdateTaskStatus: (taskId: string, status: 'To do' | 'In progress' | 'Completed') => Promise<void>;
}

export const MemberView: React.FC<MemberViewProps> = ({
  tasks,
  currentUserId,
  onUpdateTaskStatus,
}) => {
  const [onlyMyTasks, setOnlyMyTasks] = useState(false);

  const displayedTasks = onlyMyTasks
    ? tasks.filter((t) => t.assigneeId === currentUserId)
    : tasks;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & 'My Tasks' Filter Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Sprint Board
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Collaborate on sprint objectives. You can update the status of tasks assigned to you.
          </p>
        </div>

        {/* My Tasks toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            backgroundColor: 'var(--bg-elevated)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <Filter size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-main)', fontWeight: 500 }}>
            My Tasks Only
          </span>
          <button
            type="button"
            onClick={() => setOnlyMyTasks(!onlyMyTasks)}
            style={{
              width: '36px',
              height: '20px',
              backgroundColor: onlyMyTasks ? 'var(--brand-primary)' : 'var(--border-strong)',
              borderRadius: 'var(--radius-full)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background var(--transition-fast)',
              border: 'none',
              padding: 0,
            }}
            title={onlyMyTasks ? 'Show all tasks' : 'Show only my tasks'}
          >
            <span
              style={{
                position: 'absolute',
                top: '2px',
                left: onlyMyTasks ? '18px' : '2px',
                width: '16px',
                height: '16px',
                backgroundColor: '#ffffff',
                borderRadius: '50%',
                transition: 'left var(--transition-fast)',
              }}
            />
          </button>
        </div>
      </div>

      {/* Kanban Board with Member Role Restrictions */}
      <KanbanBoard
        tasks={displayedTasks}
        currentUserId={currentUserId}
        userRole="MEMBER"
        onStatusChange={(taskId, status) => onUpdateTaskStatus(taskId, status)}
      />
    </div>
  );
};

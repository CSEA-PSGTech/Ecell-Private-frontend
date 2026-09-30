import React from 'react';
import { Plus } from 'lucide-react';
import type { Task, ProjectRole } from '@/types';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/common/Button';

interface KanbanBoardProps {
  tasks: Task[];
  currentUserId: string;
  userRole: ProjectRole;
  onStatusChange: (taskId: string, newStatus: 'To do' | 'In progress' | 'Completed') => void;
  onOpenCreateTask?: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  currentUserId,
  userRole,
  onStatusChange,
  onOpenCreateTask,
  onEditTask,
  onDeleteTask,
}) => {
  const columns: { id: 'To do' | 'In progress' | 'Completed'; label: string; dotColor: string }[] = [
    { id: 'To do', label: 'To do', dotColor: 'var(--text-muted)' },
    { id: 'In progress', label: 'In progress', dotColor: 'var(--status-warning)' },
    { id: 'Completed', label: 'Completed', dotColor: 'var(--status-success)' },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        alignItems: 'start',
      }}
    >
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              minHeight: '420px',
            }}
          >
            {/* Column Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: col.dotColor,
                  }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {col.label}
                </span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    padding: '0.1rem 0.4rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {colTasks.length}
                </span>
              </div>

              {col.id === 'To do' && userRole === 'REPRESENTATIVE' && onOpenCreateTask && (
                <button
                  onClick={onOpenCreateTask}
                  style={{
                    color: 'var(--text-muted)',
                    padding: '0.2rem',
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Add new task"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>

            {/* Task Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              {colTasks.length === 0 ? (
                <div
                  style={{
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  No tasks in {col.label.toLowerCase()}
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    currentUserId={currentUserId}
                    userRole={userRole}
                    onStatusChange={onStatusChange}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                  />
                ))
              )}
            </div>

            {col.id === 'To do' && userRole === 'REPRESENTATIVE' && onOpenCreateTask && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenCreateTask}
                icon={<Plus size={14} />}
                style={{
                  width: '100%',
                  border: '1px dashed var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  marginTop: '0.25rem',
                }}
              >
                Add Task
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

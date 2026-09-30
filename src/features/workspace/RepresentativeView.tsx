import React, { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import type { Task, ProjectMembership, TaskPriority } from '@/types';
import { KanbanBoard } from '@/features/tasks/KanbanBoard';
import { TaskModal } from '@/features/tasks/TaskModal';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { calculateCompletionPercentage } from '@/utils/formatters';

interface RepresentativeViewProps {
  tasks: Task[];
  members: ProjectMembership[];
  currentUserId: string;
  onCreateTask: (data: { title: string; description?: string; priority: TaskPriority; assigneeId: string; dueDate?: string }) => Promise<void>;
  onUpdateTaskStatus: (taskId: string, status: 'To do' | 'In progress' | 'Completed') => Promise<void>;
  onUpdateTaskDetails: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export const RepresentativeView: React.FC<RepresentativeViewProps> = ({
  tasks,
  members,
  currentUserId,
  onCreateTask,
  onUpdateTaskStatus,
  onUpdateTaskDetails,
  onDeleteTask,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: {
    title: string;
    description?: string;
    priority: TaskPriority;
    assigneeId: string;
    dueDate?: string;
  }) => {
    if (editingTask) {
      await onUpdateTaskDetails(editingTask.id, data);
    } else {
      await onCreateTask(data);
    }
  };

  // Compute per-member statistics for roster panel
  const rosterData = members.map((mem) => {
    const memberTasks = tasks.filter((t) => t.assigneeId === mem.userId);
    const doneTasks = memberTasks.filter((t) => t.status === 'Completed').length;
    const rate = calculateCompletionPercentage(doneTasks, memberTasks.length);
    return {
      membership: mem,
      totalAssigned: memberTasks.length,
      doneCount: doneTasks,
      completionRate: rate,
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Sprint Board
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Assign tasks, track progress, and manage sprint deliverables.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenCreate} icon={<Plus size={15} />}>
          New Task
        </Button>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        tasks={tasks}
        currentUserId={currentUserId}
        userRole="REPRESENTATIVE"
        onStatusChange={(taskId, status) => onUpdateTaskStatus(taskId, status)}
        onOpenCreateTask={handleOpenCreate}
        onEditTask={handleOpenEdit}
        onDeleteTask={onDeleteTask}
      />

      {/* Member Roster Panel */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Users size={17} color="var(--brand-primary)" />
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Project Member Roster
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ({members.length} active students)
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                <th style={{ padding: '0.6rem 0.75rem' }}>Student</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Project Role</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Assigned Tasks</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Tasks Done</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {rosterData.map(({ membership: m, totalAssigned, doneCount, completionRate }) => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Avatar name={m.user?.name || m.userId} size="xs" />
                      <div>
                        <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                          {m.user?.name || m.userId}
                        </span>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {m.user?.email || m.userId}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '0.75rem' }}>
                    <Badge
                      size="sm"
                      variant={
                        m.role === 'REPRESENTATIVE'
                          ? 'primary'
                          : m.role === 'OWNER'
                          ? 'purple'
                          : 'neutral'
                      }
                    >
                      {m.role}
                    </Badge>
                  </td>

                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                    {totalAssigned} tasks
                  </td>

                  <td style={{ padding: '0.75rem', color: 'var(--text-main)', fontWeight: 500 }}>
                    {doneCount}
                  </td>

                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          width: '80px',
                          height: '6px',
                          backgroundColor: 'var(--bg-elevated)',
                          borderRadius: 'var(--radius-full)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${completionRate}%`,
                            height: '100%',
                            backgroundColor:
                              completionRate >= 100
                                ? 'var(--status-success)'
                                : 'var(--brand-primary)',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{completionRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        members={members}
        initialTask={editingTask}
      />
    </div>
  );
};

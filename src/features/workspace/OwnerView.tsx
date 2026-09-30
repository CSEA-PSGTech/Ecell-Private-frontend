import React from 'react';
import { BarChart2, Users } from 'lucide-react';
import type { Task, ProjectMembership } from '@/types';
import { Card } from '@/components/common/Card';
import { Avatar } from '@/components/common/Avatar';
import { ProgressBar } from '@/components/common/ProgressBar';
import { calculateCompletionPercentage } from '@/utils/formatters';

interface OwnerViewProps {
  tasks: Task[];
  members: ProjectMembership[];
  completionPercentage: number;
}

export const OwnerView: React.FC<OwnerViewProps> = ({
  tasks,
  members,
  completionPercentage,
}) => {
  const todoTasks = tasks.filter((t) => t.status === 'To do');
  const inProgressTasks = tasks.filter((t) => t.status === 'In progress');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');
  const highPriorityActive = tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed');

  // Compute per-member statistics strictly read-only
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Oversight Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <Card>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Overall Completion</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {completionPercentage}%
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <ProgressBar percentage={completionPercentage} showLabel={false} size="sm" />
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Completed</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--status-success)' }}>
            {completedTasks.length} <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/ {tasks.length}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Tasks</div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>In Progress</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--status-warning)' }}>
            {inProgressTasks.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Active tasks</div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>High Priority Open</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: highPriorityActive.length > 0 ? 'var(--status-danger)' : 'var(--status-success)' }}>
            {highPriorityActive.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Unresolved</div>
        </Card>
      </div>

      {/* Task Breakdown by Status */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <BarChart2 size={17} color="var(--brand-primary)" />
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)' }}>Task Status</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Completed</span>
              <span style={{ fontWeight: 600 }}>{completedTasks.length} tasks ({calculateCompletionPercentage(completedTasks.length, tasks.length)}%)</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${calculateCompletionPercentage(completedTasks.length, tasks.length)}%`, height: '100%', backgroundColor: 'var(--status-success)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>In Progress</span>
              <span style={{ fontWeight: 600 }}>{inProgressTasks.length} tasks ({calculateCompletionPercentage(inProgressTasks.length, tasks.length)}%)</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${calculateCompletionPercentage(inProgressTasks.length, tasks.length)}%`, height: '100%', backgroundColor: 'var(--status-warning)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>To Do / Backlog</span>
              <span style={{ fontWeight: 600 }}>{todoTasks.length} tasks ({calculateCompletionPercentage(todoTasks.length, tasks.length)}%)</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${calculateCompletionPercentage(todoTasks.length, tasks.length)}%`, height: '100%', backgroundColor: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Per-Member Completion Table (strictly non-interactive) */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <Users size={17} color="#a855f7" />
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)' }}>Member Performance</h3>
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
                <th style={{ padding: '0.6rem 0.75rem' }}>Member & Role</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Tasks Assigned</th>
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
                        <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                          {m.user?.name || m.userId}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Role: {m.role}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                    {totalAssigned}
                  </td>

                  <td style={{ padding: '0.75rem', color: 'var(--text-main)', fontWeight: 500 }}>
                    {doneCount}
                  </td>

                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          width: '90px',
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
                                : '#a855f7',
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
    </div>
  );
};

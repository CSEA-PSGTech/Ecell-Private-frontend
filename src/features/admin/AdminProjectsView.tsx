import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Project, ProjectStatus } from '@/types';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { DEPARTMENTS, PROJECT_STATUSES } from '@/utils/constants';
import { formatDate, getDaysRemaining } from '@/utils/formatters';

interface AdminProjectsViewProps {
  projects: Project[];
  onCreateProject: (data: Omit<Project, 'id' | 'createdAt'>) => Promise<Project>;
  onUpdateStatus: (id: string, status: ProjectStatus) => Promise<Project>;
}

export const AdminProjectsView: React.FC<AdminProjectsViewProps> = ({
  projects,
  onCreateProject,
  onUpdateStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Project Form State
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDepts, setSelectedDepts] = useState<string[]>(['CSE']);
  const [status, setStatus] = useState<ProjectStatus>('OPEN');
  const [deadline, setDeadline] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const filteredProjects = projects.filter((p) => {
    if (filterStatus === 'ALL') return true;
    return p.status === filterStatus;
  });

  const handleToggleDept = (dept: string) => {
    if (selectedDepts.includes(dept)) {
      if (selectedDepts.length > 1) {
        setSelectedDepts(selectedDepts.filter((d) => d !== dept));
      }
    } else {
      setSelectedDepts([...selectedDepts, dept]);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim() || !deadline) {
      setError('Title, code, and deadline are required');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onCreateProject({
        title: title.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim(),
        fullDescription: description.trim(),
        departments: selectedDepts,
        status,
        deadline: new Date(deadline).toISOString(),
        mentorName: mentorName.trim() || 'Faculty Advisory Lead',
        mentorRole: 'Innovation Lab',
        prerequisites: ['Foundations in domain tools', 'Team collaboration spirit'],
        guidelines: ['Commit milestones weekly', 'Submit reports for cycle review'],
      });
      setIsModalOpen(false);
      setTitle('');
      setCode('');
      setDescription('');
      setDeadline('');
      setMentorName('');
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top action row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Status filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['ALL', ...PROJECT_STATUSES].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                fontWeight: filterStatus === st ? 600 : 500,
                backgroundColor: filterStatus === st ? 'var(--brand-primary-light)' : 'var(--bg-elevated)',
                color: filterStatus === st ? 'var(--brand-primary)' : 'var(--text-secondary)',
                border: filterStatus === st ? '1px solid var(--brand-primary-border)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={<Plus size={15} />}>
          New Project
        </Button>
      </div>

      {/* Projects Table */}
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
              <th style={{ padding: '0.75rem 1.25rem' }}>Project Name & Code</th>
              <th style={{ padding: '0.75rem 1rem' }}>Departments</th>
              <th style={{ padding: '0.75rem 1rem' }}>Lead / Mentor</th>
              <th style={{ padding: '0.75rem 1rem' }}>Deadline</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>Status Control</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((p) => {
              const { text: deadlineText, isPast } = getDaysRemaining(p.deadline);

              return (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.4rem',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--brand-primary-light)',
                          color: 'var(--brand-primary)',
                        }}
                      >
                        {p.code}
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.title}</span>
                    </div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {p.departments.map((dept) => (
                        <span
                          key={dept}
                          style={{
                            fontSize: '0.6875rem',
                            padding: '0.1rem 0.35rem',
                            borderRadius: 'var(--radius-xs)',
                            backgroundColor: 'var(--bg-elevated)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {p.mentorName}
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span style={{ color: 'var(--text-main)', fontSize: '0.8125rem' }}>
                        {formatDate(p.deadline)}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: isPast ? 'var(--status-danger)' : 'var(--text-muted)' }}>
                        {deadlineText}
                      </span>
                    </div>
                  </td>

                  {/* Explicit status transition control per prompt */}
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <select
                      value={p.status}
                      onChange={(e) => onUpdateStatus(p.id, e.target.value as ProjectStatus)}
                      style={{
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color:
                          p.status === 'OPEN'
                            ? 'var(--status-success)'
                            : p.status === 'DRAFT'
                            ? 'var(--status-warning)'
                            : 'var(--text-muted)',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      {PROJECT_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        subtitle="Initialize an innovation sprint scope and specify eligible departments"
        maxWidth="520px"
      >
        <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && <div style={{ color: 'var(--status-danger)', fontSize: '0.8125rem' }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
            <Input
              label="Project Title"
              placeholder="e.g. Autonomous Campus Delivery Rover"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              label="Project Code"
              placeholder="e.g. CSE-510"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Project Summary
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of the challenge, technology stack, and deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.5rem 0.75rem',
                fontSize: '0.8125rem',
                color: 'var(--text-main)',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Department Multi-Select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Eligible Departments (Multi-Select)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {DEPARTMENTS.map((dept) => {
                const isSelected = selectedDepts.includes(dept);
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => handleToggleDept(dept)}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'var(--brand-primary-light)' : 'var(--bg-input)',
                      color: isSelected ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      border: `1px solid ${isSelected ? 'var(--brand-primary-border)' : 'var(--border-subtle)'}`,
                      fontWeight: isSelected ? 600 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Input
              label="Application Deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />

            <Select
              label="Initial Status Transition"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              options={PROJECT_STATUSES.map((st) => ({ label: st, value: st }))}
            />
          </div>

          <Input
            label="Faculty Lead / Mentor"
            placeholder="e.g. Dr. Aris Thorne"
            value={mentorName}
            onChange={(e) => setMentorName(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

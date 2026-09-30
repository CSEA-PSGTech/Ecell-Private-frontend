import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, Send, ArrowRight } from 'lucide-react';
import type { Project, Application } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/context/AuthContext';
import { useProjectData } from '@/context/ProjectDataContext';
import { formatDate, getDaysRemaining } from '@/utils/formatters';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenWorkspace?: (projectId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onOpenWorkspace,
}) => {
  const { user } = useAuth();
  const { applyToProject, applications, getUserProjectRole } = useProjectData();

  const [statement, setStatement] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!project) return null;

  const userRole = user ? getUserProjectRole(project.id, user.id) : null;
  const isEnrolled = !!userRole;

  const existingApp: Application | undefined = applications.find(
    (a) => a.projectId === project.id && a.studentId === user?.id
  );

  const { text: deadlineText } = getDaysRemaining(project.deadline);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await applyToProject(project.id, user, statement, portfolioUrl);
      setSuccessMsg('Application submitted. You can track status under My Applications.');
      setStatement('');
      setPortfolioUrl('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{project.title}</span>
          <Badge size="sm" variant="primary">
            {project.code}
          </Badge>
        </div>
      }
      subtitle={`Mentored by ${project.mentorName} • ${project.mentorRole || 'Faculty Lead'}`}
      maxWidth="620px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Meta Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Departments:</span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {project.departments.map((dept) => (
                <Badge key={dept} size="sm" variant="neutral">
                  {dept}
                </Badge>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <Clock size={13} color="var(--brand-primary)" />
            <span>Deadline: {formatDate(project.deadline)} ({deadlineText})</span>
          </div>
        </div>

        {/* Full Overview */}
        <div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Project Overview
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {project.fullDescription || project.description}
          </p>
        </div>

        {/* Prerequisites */}
        {project.prerequisites && project.prerequisites.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Prerequisites & Skills
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {project.prerequisites.map((req, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} color="var(--status-success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guidelines */}
        {project.guidelines && project.guidelines.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Incubator Guidelines
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {project.guidelines.map((guide, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>•</span>
                  <span>{guide}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application State / Form */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.25rem',
          }}
        >
          {isEnrolled ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--brand-primary-light)',
                border: '1px solid var(--brand-primary-border)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  You are enrolled on this project
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                  Role: <strong>{userRole}</strong>
                </p>
              </div>
              {onOpenWorkspace && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onOpenWorkspace(project.id);
                  }}
                  icon={<ArrowRight size={13} />}
                >
                  Open Workspace
                </Button>
              )}
            </div>
          ) : existingApp ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Application Status
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                  Submitted on {formatDate(existingApp.submittedDate)}
                </p>
              </div>
              <Badge
                variant={
                  existingApp.status === 'Accepted'
                    ? 'success'
                    : existingApp.status === 'Rejected'
                    ? 'error'
                    : 'warning'
                }
              >
                {existingApp.status}
              </Badge>
            </div>
          ) : (
            <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Apply for this Project
              </h4>

              {errorMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--status-danger)', fontSize: '0.8125rem' }}>
                  <AlertCircle size={15} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--status-success)', fontSize: '0.8125rem' }}>
                  <CheckCircle2 size={15} />
                  <span>{successMsg}</span>
                </div>
              )}

              <Input
                label="Portfolio / GitHub Repository URL"
                placeholder="https://github.com/your-username/repo"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Statement of Interest (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your technical background and what you want to build..."
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting} icon={<Send size={13} />}>
                  Submit Application
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};

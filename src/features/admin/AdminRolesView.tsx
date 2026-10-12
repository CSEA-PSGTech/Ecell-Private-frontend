import React, { useEffect, useState } from 'react';
import { UserCheck, Shield, Kanban, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import type { Project, ProjectMembership, ProjectRole } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { Avatar } from '@/components/common/Avatar';
import { projectService } from '@/services/api';
import type { AdminStudent } from '@/services/api';

interface AdminRolesViewProps {
  projects: Project[];
  memberships: ProjectMembership[];
  onUpdateRole: (projectId: string, userId: string, role: ProjectRole) => Promise<void>;
}

export const AdminRolesView: React.FC<AdminRolesViewProps> = ({
  projects,
  memberships,
  onUpdateRole,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [targetStudentSearch, setTargetStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(null);
  const [roleToGrant, setRoleToGrant] = useState<'REPRESENTATIVE' | 'OWNER'>('REPRESENTATIVE');
  const [isGranting, setIsGranting] = useState(false);
  const [grantSuccess, setGrantSuccess] = useState<string | null>(null);
  const [grantError, setGrantError] = useState<string | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const projectMembers = memberships.filter((m) => m.projectId === selectedProjectId);

  const currentRep = projectMembers.find((m) => m.role === 'REPRESENTATIVE');
  const currentOwner = projectMembers.find((m) => m.role === 'OWNER');

  const [studentResults, setStudentResults] = useState<AdminStudent[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (projects.length === 0) {
      setSelectedProjectId('');
    } else if (!projects.some((project) => project.id === selectedProjectId)) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    const query = targetStudentSearch.trim();
    if (query.length < 2) {
      setStudentResults([]);
      return;
    }
    let cancelled = false;
    setIsSearching(true);
    const timer = window.setTimeout(async () => {
      try {
        const results = await projectService.searchStudents(query);
        if (!cancelled) setStudentResults(results);
      } catch {
        if (!cancelled) setStudentResults([]);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [targetStudentSearch]);

  const handleGrantRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !selectedStudent) return;

    setIsGranting(true);
    setGrantError(null);
    try {
      await onUpdateRole(selectedProjectId, selectedStudent.id, roleToGrant);
      setGrantSuccess(`Granted ${roleToGrant} role to ${selectedStudent.name}.`);
      setSelectedStudent(null);
      setTargetStudentSearch('');
      setStudentResults([]);
      window.setTimeout(() => setGrantSuccess(null), 4000);
    } catch (error) {
      setGrantError(error instanceof Error ? error.message : 'Unable to allocate this role.');
    } finally {
      setIsGranting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {grantSuccess && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success)',
            border: '1px solid var(--status-success-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={16} />
          <span>{grantSuccess}</span>
        </div>
      )}

      {/* Project Selector Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <UserCheck size={18} color="var(--brand-primary)" />
          <div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Configuring Leadership For:</span>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)' }}>
              {selectedProject?.title} ({selectedProject?.code})
            </div>
          </div>
        </div>

        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.4rem 0.85rem',
            fontSize: '0.8125rem',
            color: 'var(--text-main)',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.code} - {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Leadership Status Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Representative Card */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Kanban size={16} color="var(--brand-primary)" />
              <span>Project Representative</span>
            </div>
          }
          subtitle="Sprint master responsible for task creation and delegation"
        >
          {currentRep ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Avatar name={currentRep.user?.name || currentRep.userId} size="md" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                  {currentRep.user?.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {currentRep.user?.email} • {currentRep.user?.rollNumber}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.8125rem', color: 'var(--status-warning)', marginTop: '0.5rem' }}>
              No representative currently assigned
            </div>
          )}
        </Card>

        {/* Owner Card */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Shield size={16} color="#a855f7" />
              <span>Executive Owner</span>
            </div>
          }
          subtitle="Project sponsor with read-only performance oversight"
        >
          {currentOwner ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Avatar name={currentOwner.user?.name || currentOwner.userId} size="md" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                  {currentOwner.user?.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {currentOwner.user?.email} • {currentOwner.user?.rollNumber}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              No executive owner currently assigned
            </div>
          )}
        </Card>
      </div>

      {/* Grant / Change Leadership Form */}
      <Card
        title="Assign or Reallocate Leadership"
        subtitle="Lookup a student or company account by email, name, or roll number to designate them as Owner or Representative"
      >
        <form onSubmit={handleGrantRole} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {/* Student Search & Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Search Candidate (Email, Name, or Roll No)
              </label>
              <div style={{ position: 'relative' }}>
                <Search
                  size={14}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search students and company accounts..."
                  value={targetStudentSearch}
                  onChange={(e) => {
                    setTargetStudentSearch(e.target.value);
                    setSelectedStudent(null);
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                    fontSize: '0.8125rem',
                    color: 'var(--text-main)',
                    outline: 'none',
                    marginBottom: '0.35rem',
                  }}
                />
                {studentResults.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    zIndex: 5,
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-md)',
                  }}>
                    {studentResults.map((student) => (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => {
                          setSelectedStudent(student);
                          setTargetStudentSearch(student.rollNumber || student.email);
                          setStudentResults([]);
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '0.55rem 0.7rem',
                          textAlign: 'left',
                          color: 'var(--text-main)',
                          background: 'transparent',
                          cursor: 'pointer',
                        }}
                      >
                        <strong>{student.name}</strong>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {student.accountType === 'company' ? 'Company account' : (student.rollNumber || 'No roll number')} · {student.email} · {student.department || 'No department'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ minHeight: '1.1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isSearching ? 'Searching database...' : selectedStudent
                  ? `Selected: ${selectedStudent.name} (${selectedStudent.rollNumber || selectedStudent.email})`
                  : targetStudentSearch.length >= 2 ? 'Choose a matching candidate.' : 'Enter at least 2 characters.'}
              </div>
            </div>

            {/* Leadership Role */}
            <Select
              label="Designated Privilege"
              value={roleToGrant}
              onChange={(e) => setRoleToGrant(e.target.value as 'REPRESENTATIVE' | 'OWNER')}
              options={[
                { label: 'Representative (Full Sprint Board Delegation)', value: 'REPRESENTATIVE' },
                { label: 'Owner (Executive Oversight & Completion Audit)', value: 'OWNER' },
              ]}
            />
          </div>

          {grantError && (
            <div style={{ color: 'var(--status-danger)', fontSize: '0.8125rem' }}>{grantError}</div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!selectedStudent || isGranting}
              isLoading={isGranting}
              icon={<ArrowRight size={14} />}
            >
              Confirm Role Allocation
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

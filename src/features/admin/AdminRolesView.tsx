import React, { useState } from 'react';
import { UserCheck, Shield, Kanban, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import type { Project, ProjectMembership, ProjectRole } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { Avatar } from '@/components/common/Avatar';
import { SEED_USERS } from '@/utils/seedData';

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
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [roleToGrant, setRoleToGrant] = useState<'REPRESENTATIVE' | 'OWNER'>('REPRESENTATIVE');
  const [isGranting, setIsGranting] = useState(false);
  const [grantSuccess, setGrantSuccess] = useState<string | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const projectMembers = memberships.filter((m) => m.projectId === selectedProjectId);

  const currentRep = projectMembers.find((m) => m.role === 'REPRESENTATIVE');
  const currentOwner = projectMembers.find((m) => m.role === 'OWNER');

  // Search filter for students
  const filteredStudents = SEED_USERS.filter((u) => {
    if (u.role === 'admin') return false;
    const term = targetStudentSearch.trim().toLowerCase();
    if (!term) return true;
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.rollNumber && u.rollNumber.toLowerCase().includes(term))
    );
  });

  const handleGrantRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !selectedStudentId) return;

    setIsGranting(true);
    try {
      await onUpdateRole(selectedProjectId, selectedStudentId, roleToGrant);
      const student = SEED_USERS.find((u) => u.id === selectedStudentId);
      setGrantSuccess(`Granted ${roleToGrant} role to ${student?.name || 'student'}.`);
      setSelectedStudentId('');
      setTargetStudentSearch('');
      setTimeout(() => setGrantSuccess(null), 4000);
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
        subtitle="Lookup a student by email or roll number to designate them as Owner or Representative"
      >
        <form onSubmit={handleGrantRole} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {/* Student Search & Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Search Student (Email or Roll No)
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
                  placeholder="Filter student list..."
                  value={targetStudentSearch}
                  onChange={(e) => setTargetStudentSearch(e.target.value)}
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
              </div>

              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.8125rem',
                  color: 'var(--text-main)',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                required
              >
                <option value="">-- Choose Candidate --</option>
                {filteredStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNumber || s.email}) • Dept: {s.department}
                  </option>
                ))}
              </select>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!selectedStudentId || isGranting}
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

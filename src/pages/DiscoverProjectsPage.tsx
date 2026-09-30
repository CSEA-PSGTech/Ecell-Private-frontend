import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import type { Project } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useProjectData } from '@/context/ProjectDataContext';
import { ProjectCard } from '@/features/projects/ProjectCard';
import { ProjectFilters } from '@/features/projects/ProjectFilters';
import { ProjectDetailModal } from '@/features/projects/ProjectDetailModal';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeleton } from '@/components/common/Skeleton';
import { isDeadlinePassed } from '@/utils/formatters';

interface DiscoverProjectsPageProps {
  onOpenWorkspace: (projectId: string) => void;
}

export const DiscoverProjectsPage: React.FC<DiscoverProjectsPageProps> = ({ onOpenWorkspace }) => {
  const { user } = useAuth();
  const { projects, applications, getUserProjectRole, isLoading } = useProjectData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'deadline' | 'newest'>('deadline');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Per spec:
  // 1. OPEN projects only
  // 2. Deadline has not passed (no expired ghost cards)
  // 3. Filtered to departments (multi-select)
  // 4. Matches search query
  const eligibleProjects = projects.filter((p) => {
    // Show ALL open, non-expired projects — any student can apply to any project
    if (p.status !== 'OPEN') return false;
    if (isDeadlinePassed(p.deadline)) return false;

    // Filter by selected departments (user-driven UI filter, not account-based restriction)
    if (selectedDepartments.length > 0) {
      const hasMatch = p.departments.some((d) => selectedDepartments.includes(d));
      if (!hasMatch) return false;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchMentor = p.mentorName.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchDesc && !matchMentor) return false;
    }

    return true;
  });

  // Sort
  const sortedProjects = [...eligibleProjects].sort((a, b) => {
    if (sortBy === 'deadline') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleDepartmentToggle = (dept: string) => {
    if (selectedDepartments.includes(dept)) {
      setSelectedDepartments(selectedDepartments.filter((d) => d !== dept));
    } else {
      setSelectedDepartments([...selectedDepartments, dept]);
    }
  };

  const handleResetDepartments = () => {
    setSelectedDepartments([]);
    setSearchQuery('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Discover Projects
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
              }}
            >
              {eligibleProjects.length} Open
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Browse open innovation projects and apply to join.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <ProjectFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDepartments={selectedDepartments}
        onDepartmentToggle={handleDepartmentToggle}
        onResetDepartments={handleResetDepartments}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Projects Grid or Skeletons or Empty State */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : sortedProjects.length === 0 ? (
        <EmptyState
          icon={<Compass size={32} />}
          message="No active projects matched your search criteria or department filter."
          actionLabel="Clear Filters"
          onAction={handleResetDepartments}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
            alignItems: 'stretch',
          }}
        >
          {sortedProjects.map((project) => {
            const userRole = user ? getUserProjectRole(project.id, user.id) : null;
            const app = applications.find(
              (a) => a.projectId === project.id && a.studentId === user?.id
            );

            return (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={(p) => setActiveModalProject(p)}
                applicationStatus={app ? app.status : undefined}
                isMember={!!userRole}
              />
            );
          })}
        </div>
      )}

      {/* Project Detail & Apply Modal */}
      <ProjectDetailModal
        project={activeModalProject}
        isOpen={!!activeModalProject}
        onClose={() => setActiveModalProject(null)}
        onOpenWorkspace={onOpenWorkspace}
      />
    </div>
  );
};

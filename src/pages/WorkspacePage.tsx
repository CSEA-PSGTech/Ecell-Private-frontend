import React, { useState, useEffect } from 'react';
import { Kanban } from 'lucide-react';
import type { ProjectRole } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useProjectData } from '@/context/ProjectDataContext';
import { WorkspaceHeader } from '@/features/workspace/WorkspaceHeader';
import { RepresentativeView } from '@/features/workspace/RepresentativeView';
import { MemberView } from '@/features/workspace/MemberView';
import { OwnerView } from '@/features/workspace/OwnerView';
import { EmptyState } from '@/components/common/EmptyState';
import { calculateCompletionPercentage } from '@/utils/formatters';

interface WorkspacePageProps {
  initialProjectId?: string;
  onNavigateToDiscover: () => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  initialProjectId,
  onNavigateToDiscover,
}) => {
  const { user } = useAuth();
  const {
    getUserProjects,
    getProjectTasks,
    getProjectMembers,
    createTask,
    updateTaskStatus,
    updateTaskDetails,
    deleteTask,
  } = useProjectData();

  if (!user) return null;

  const myProjects = getUserProjects(user.id);

  // Determine active project
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    if (initialProjectId && myProjects.some((m) => m.project.id === initialProjectId)) {
      return initialProjectId;
    }
    return myProjects[0]?.project.id || '';
  });

  useEffect(() => {
    if (initialProjectId && myProjects.some((m) => m.project.id === initialProjectId)) {
      setSelectedProjectId(initialProjectId);
    } else if (!selectedProjectId && myProjects.length > 0) {
      setSelectedProjectId(myProjects[0].project.id);
    }
  }, [initialProjectId, myProjects, selectedProjectId]);

  if (myProjects.length === 0) {
    return (
      <EmptyState
        icon={<Kanban size={36} />}
        message="You are not currently enrolled in any project workspace."
        actionLabel="Discover Projects"
        onAction={onNavigateToDiscover}
      />
    );
  }

  const currentMembership = myProjects.find((m) => m.project.id === selectedProjectId) || myProjects[0];
  const activeProject = currentMembership.project;
  const userRoleOnThisProject: ProjectRole = currentMembership.role;

  const tasks = getProjectTasks(activeProject.id);
  const members = getProjectMembers(activeProject.id);

  // Derived progress: completed tasks / total active tasks
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const completionPercentage = calculateCompletionPercentage(completedTasks, tasks.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Workspace Header with Project Switcher & Derived Completion % */}
      <WorkspaceHeader
        project={activeProject}
        userRole={userRoleOnThisProject}
        completionPercentage={completionPercentage}
        totalTasks={tasks.length}
        completedTasks={completedTasks}
        availableProjects={myProjects}
        onSelectProject={(id) => setSelectedProjectId(id)}
      />

      {/* Renders ONE of three views based on role on THIS project */}
      {userRoleOnThisProject === 'REPRESENTATIVE' && (
        <RepresentativeView
          tasks={tasks}
          members={members}
          currentUserId={user.id}
          onCreateTask={(data) => createTask(activeProject.id, data).then(() => {})}
          onUpdateTaskStatus={(taskId, status) => updateTaskStatus(taskId, status).then(() => {})}
          onUpdateTaskDetails={(taskId, updates) => updateTaskDetails(taskId, updates).then(() => {})}
          onDeleteTask={(taskId) => deleteTask(taskId)}
        />
      )}

      {userRoleOnThisProject === 'MEMBER' && (
        <MemberView
          tasks={tasks}
          currentUserId={user.id}
          onUpdateTaskStatus={(taskId, status) => updateTaskStatus(taskId, status).then(() => {})}
        />
      )}

      {userRoleOnThisProject === 'OWNER' && (
        <OwnerView
          tasks={tasks}
          members={members}
          completionPercentage={completionPercentage}
        />
      )}
    </div>
  );
};

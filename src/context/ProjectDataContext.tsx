import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Project,
  Application,
  Task,
  ProjectMembership,
  AnalyticsOverview,
  ProjectRole,
  ProjectStatus,
  TaskPriority,
  TaskStatus,
  User,
} from '@/types';
import {
  projectService,
  applicationService,
  membershipService,
  taskService,
  analyticsService,
  resetMockDataToSeed,
} from '@/services/api';
import { calculateCompletionPercentage } from '@/utils/formatters';

interface ProjectDataContextType {
  projects: Project[];
  applications: Application[];
  memberships: ProjectMembership[];
  tasks: Task[];
  analytics: AnalyticsOverview | null;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  resetToDefault: () => Promise<void>;

  // Project actions
  createProject: (data: Omit<Project, 'id' | 'createdAt'>) => Promise<Project>;
  updateProjectStatus: (id: string, status: ProjectStatus) => Promise<Project>;

  // Application actions
  applyToProject: (projectId: string, student: User, statement?: string, portfolioUrl?: string) => Promise<Application>;
  updateApplicationStatus: (id: string, status: 'Accepted' | 'Rejected', reviewerName?: string) => Promise<void>;

  // Task actions
  createTask: (projectId: string, data: { title: string; description?: string; priority: TaskPriority; assigneeId: string; dueDate?: string }) => Promise<Task>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<Task>;
  updateTaskDetails: (taskId: string, updates: Partial<Task>) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;

  // Role actions
  updateMemberRole: (projectId: string, userId: string, newRole: ProjectRole) => Promise<void>;

  // Helper getters
  getUserProjectRole: (projectId: string, userId: string) => ProjectRole | null;
  getUserProjects: (userId: string) => { project: Project; role: ProjectRole }[];
  getProjectTasks: (projectId: string) => Task[];
  getProjectProgress: (projectId: string) => number;
  getProjectMembers: (projectId: string) => ProjectMembership[];
}

const ProjectDataContext = createContext<ProjectDataContextType | undefined>(undefined);

export const ProjectDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [memberships, setMemberships] = useState<ProjectMembership[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [allProjects, allApps, , allAnalytics] = await Promise.all([
        projectService.getAllProjects(),
        applicationService.getAdminApplications('ALL'),
        membershipService.getProjectMembers('all-internal-cache'),
        analyticsService.getOverview(),
      ]);

      // Also gather all tasks across projects
      const taskPromises = allProjects.map((p) => taskService.getProjectTasks(p.id));
      const nestedTasks = await Promise.all(taskPromises);
      const flatTasks = nestedTasks.flat();

      setProjects(allProjects);
      setApplications(allApps);
      setTasks(flatTasks);
      setAnalytics(allAnalytics);

      // Fetch all memberships
      const memberPromises = allProjects.map((p) => membershipService.getProjectMembers(p.id));
      const nestedMembers = await Promise.all(memberPromises);
      setMemberships(nestedMembers.flat());
    } catch (err) {
      console.error('Error refreshing project data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const resetToDefault = async () => {
    resetMockDataToSeed();
    await refreshData();
  };

  const createProject = async (data: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
    const created = await projectService.createProject(data);
    await refreshData();
    return created;
  };

  const updateProjectStatus = async (id: string, status: ProjectStatus): Promise<Project> => {
    const updated = await projectService.patchProject(id, { status });
    await refreshData();
    return updated;
  };

  const applyToProject = async (projectId: string, student: User, statement?: string, portfolioUrl?: string): Promise<Application> => {
    const app = await applicationService.applyToProject(projectId, student, statement, portfolioUrl);
    await refreshData();
    return app;
  };

  const updateApplicationStatus = async (id: string, status: 'Accepted' | 'Rejected', reviewerName?: string): Promise<void> => {
    await applicationService.patchApplicationStatus(id, status, reviewerName);
    await refreshData();
  };

  const createTask = async (
    projectId: string,
    data: { title: string; description?: string; priority: TaskPriority; assigneeId: string; dueDate?: string }
  ): Promise<Task> => {
    const task = await taskService.createTask(projectId, data);
    await refreshData();
    return task;
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus): Promise<Task> => {
    const updated = await taskService.updateTask(taskId, { status });
    await refreshData();
    return updated;
  };

  const updateTaskDetails = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    const updated = await taskService.updateTask(taskId, updates);
    await refreshData();
    return updated;
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    await taskService.deleteTask(taskId);
    await refreshData();
  };

  const updateMemberRole = async (projectId: string, userId: string, newRole: ProjectRole): Promise<void> => {
    await membershipService.patchMemberRole(projectId, userId, newRole);
    await refreshData();
  };

  const getUserProjectRole = (projectId: string, userId: string): ProjectRole | null => {
    const mem = memberships.find((m) => m.projectId === projectId && m.userId === userId);
    return mem ? mem.role : null;
  };

  const getUserProjects = (userId: string): { project: Project; role: ProjectRole }[] => {
    const userMems = memberships.filter((m) => m.userId === userId);
    const result: { project: Project; role: ProjectRole }[] = [];
    userMems.forEach((m) => {
      const p = projects.find((proj) => proj.id === m.projectId);
      if (p) {
        result.push({ project: p, role: m.role });
      }
    });
    return result;
  };

  const getProjectTasks = (projectId: string): Task[] => {
    return tasks.filter((t) => t.projectId === projectId);
  };

  const getProjectProgress = (projectId: string): number => {
    const pTasks = getProjectTasks(projectId);
    const completed = pTasks.filter((t) => t.status === 'Completed').length;
    return calculateCompletionPercentage(completed, pTasks.length);
  };

  const getProjectMembers = (projectId: string): ProjectMembership[] => {
    return memberships.filter((m) => m.projectId === projectId);
  };

  return (
    <ProjectDataContext.Provider
      value={{
        projects,
        applications,
        memberships,
        tasks,
        analytics,
        isLoading,
        refreshData,
        resetToDefault,
        createProject,
        updateProjectStatus,
        applyToProject,
        updateApplicationStatus,
        createTask,
        updateTaskStatus,
        updateTaskDetails,
        deleteTask,
        updateMemberRole,
        getUserProjectRole,
        getUserProjects,
        getProjectTasks,
        getProjectProgress,
        getProjectMembers,
      }}
    >
      {children}
    </ProjectDataContext.Provider>
  );
};

export const useProjectData = (): ProjectDataContextType => {
  const context = useContext(ProjectDataContext);
  if (!context) {
    throw new Error('useProjectData must be used within a ProjectDataProvider');
  }
  return context;
};

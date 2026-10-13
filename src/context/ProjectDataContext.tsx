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
} from '@/services/api';
import type { ProjectAssignment } from '@/services/api';
import { calculateCompletionPercentage } from '@/utils/formatters';
import { STORAGE_KEYS } from '@/utils/constants';
import { useAuth } from '@/context/AuthContext';

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
  createProject: (data: Omit<Project, 'id' | 'createdAt'> & { assignments?: ProjectAssignment[] }) => Promise<Project>;
  updateProjectStatus: (id: string, status: ProjectStatus) => Promise<Project>;

  // Application actions
  applyToProject: (projectId: string, student: User, statement?: string, portfolioUrl?: string) => Promise<Application>;
  updateApplicationStatus: (id: string, status: 'Accepted' | 'Rejected') => Promise<void>;

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
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [memberships, setMemberships] = useState<ProjectMembership[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH_USER) || 'null') as User | null;
      const isAdmin = currentUser?.role === 'admin';
      const enrolledProjects = await projectService.getAllProjects();
      const discoverProjects = isAdmin ? [] : await projectService.getDiscoverProjects();
      const projectsById = new Map(
        [...enrolledProjects, ...discoverProjects].map((project) => [project.id, project]),
      );
      const allProjects = Array.from(projectsById.values());
      const allApps = isAdmin
        ? await applicationService.getAdminApplications('ALL')
        : currentUser
          ? await applicationService.getMyApplications(currentUser.id)
          : [];
      const allAnalytics = isAdmin ? await analyticsService.getOverview() : null;

      // Workspace details are available only for projects the student belongs to.
      const taskPromises = enrolledProjects.map((p) => taskService.getProjectTasks(p.id).catch(() => []));
      const nestedTasks = await Promise.all(taskPromises);
      const flatTasks = nestedTasks.flat();

      setProjects(allProjects);
      setApplications(allApps);
      setTasks(flatTasks);
      setAnalytics(allAnalytics);

      // Fetch all memberships
      const memberPromises = enrolledProjects.map((p) => membershipService.getProjectMembers(p.id).catch(() => []));
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
  }, [refreshData, user?.id, user?.role]);

  const resetToDefault = async () => {
    throw new Error('Resetting seed data is unavailable when using the backend API.');
  };

  const createProject = async (data: Omit<Project, 'id' | 'createdAt'> & { assignments?: ProjectAssignment[] }): Promise<Project> => {
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

  const updateApplicationStatus = async (id: string, status: 'Accepted' | 'Rejected'): Promise<void> => {
    const application = applications.find((item) => item.id === id);
    if (!application?.projectId) throw new Error('Application is missing its project ID.');
    await applicationService.patchApplicationStatus(id, application.projectId, status);
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
    setTasks((currentTasks) => currentTasks.map((task) => task.id === taskId ? updated : task));
    await refreshData();
    return updated;
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    await taskService.deleteTask(taskId);
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
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

import type {
  User,
  Project,
  ProjectMembership,
  Application,
  Task,
  AnalyticsOverview,
  ProjectRole,
  TaskPriority,
} from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';
import {
  SEED_USERS,
  SEED_PROJECTS,
  SEED_MEMBERSHIPS,
  SEED_APPLICATIONS,
  SEED_TASKS,
} from '@/utils/seedData';
import { isDeadlinePassed } from '@/utils/formatters';

// Initialize mock storage from seeds if not yet populated
function initializeLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SEED_PROJECTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEMBERSHIPS)) {
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(SEED_MEMBERSHIPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEED_APPLICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_TASKS));
  }
}

initializeLocalStorage();

// Helper readers and writers
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to store key: ${key}`, e);
  }
}

// -------------------------------------------------------------
// AUTH SERVICE
// -------------------------------------------------------------
export const authService = {
  async login(email: string, _password?: string): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    await new Promise((r) => setTimeout(r, 200)); // slight natural delay
    const targetUser = SEED_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!targetUser) {
      // If not exact email, fallback to student or admin based on keyword or default to Alex
      if (email.includes('admin')) {
        const adminUser = SEED_USERS.find((u) => u.role === 'admin')!;
        return {
          accessToken: 'mock-access-token-admin',
          refreshToken: 'mock-refresh-token-admin',
          user: adminUser,
        };
      }
      throw new Error('Invalid email or password');
    }

    return {
      accessToken: `mock-access-token-${targetUser.id}`,
      refreshToken: `mock-refresh-token-${targetUser.id}`,
      user: targetUser,
    };
  },

  async refresh(): Promise<{ accessToken: string }> {
    return { accessToken: `mock-refreshed-token-${Date.now()}` };
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
};

// -------------------------------------------------------------
// PROJECTS SERVICE
// -------------------------------------------------------------
export const projectService = {
  async getDiscoverProjects(): Promise<Project[]> {
    await new Promise((r) => setTimeout(r, 150));
    const all = getStored<Project[]>(STORAGE_KEYS.PROJECTS, SEED_PROJECTS);

    // Show ALL open, non-expired projects to every user regardless of department
    return all.filter((proj) => {
      if (proj.status !== 'OPEN') return false;
      if (isDeadlinePassed(proj.deadline)) return false;
      return true;
    });
  },

  async getAllProjects(): Promise<Project[]> {
    await new Promise((r) => setTimeout(r, 150));
    return getStored<Project[]>(STORAGE_KEYS.PROJECTS, SEED_PROJECTS);
  },

  async getProjectById(id: string): Promise<Project | null> {
    const all = getStored<Project[]>(STORAGE_KEYS.PROJECTS, SEED_PROJECTS);
    return all.find((p) => p.id === id) || null;
  },

  async createProject(projectData: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const all = getStored<Project[]>(STORAGE_KEYS.PROJECTS, SEED_PROJECTS);
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newProject, ...all];
    setStored(STORAGE_KEYS.PROJECTS, updated);
    return newProject;
  },

  async patchProject(id: string, updates: Partial<Project>): Promise<Project> {
    const all = getStored<Project[]>(STORAGE_KEYS.PROJECTS, SEED_PROJECTS);
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project not found');
    const updatedProject = { ...all[index], ...updates };
    all[index] = updatedProject;
    setStored(STORAGE_KEYS.PROJECTS, all);
    return updatedProject;
  },
};

// -------------------------------------------------------------
// APPLICATIONS SERVICE
// -------------------------------------------------------------
export const applicationService = {
  async applyToProject(projectId: string, student: User, statement?: string, portfolioUrl?: string): Promise<Application> {
    const all = getStored<Application[]>(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
    const project = await projectService.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    // Check if already applied
    const existing = all.find((a) => a.projectId === projectId && a.studentId === student.id);
    if (existing) {
      throw new Error('You have already applied to this project');
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      projectId,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentDepartment: student.department,
      studentRollNumber: student.rollNumber,
      projectTitle: project.title,
      projectCode: project.code,
      statement: statement || 'Eager to contribute technical skills to this innovation track.',
      portfolioUrl: portfolioUrl || 'https://github.com',
      submittedDate: new Date().toISOString(),
      status: 'Under Review',
    };

    const updated = [newApp, ...all];
    setStored(STORAGE_KEYS.APPLICATIONS, updated);
    return newApp;
  },

  async getMyApplications(studentId: string): Promise<Application[]> {
    await new Promise((r) => setTimeout(r, 120));
    const all = getStored<Application[]>(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
    return all.filter((a) => a.studentId === studentId);
  },

  async getAdminApplications(statusFilter?: 'PENDING' | 'REVIEWED' | 'ALL'): Promise<Application[]> {
    await new Promise((r) => setTimeout(r, 150));
    const all = getStored<Application[]>(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
    if (statusFilter === 'PENDING') {
      return all.filter((a) => a.status === 'Under Review');
    }
    if (statusFilter === 'REVIEWED') {
      return all.filter((a) => a.status === 'Accepted' || a.status === 'Rejected');
    }
    return all;
  },

  async patchApplicationStatus(id: string, status: 'Accepted' | 'Rejected', reviewerName = 'Dr. Aris Thorne'): Promise<Application> {
    const all = getStored<Application[]>(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
    const index = all.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Application not found');

    const app = all[index];
    const updatedApp: Application = {
      ...app,
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy: reviewerName,
    };
    all[index] = updatedApp;
    setStored(STORAGE_KEYS.APPLICATIONS, all);

    // CRITICAL: Accepting creates the ProjectMembership as MEMBER automatically in one step
    if (status === 'Accepted') {
      await membershipService.ensureMembership(app.projectId, app.studentId, 'MEMBER');
    }

    return updatedApp;
  },
};

// -------------------------------------------------------------
// MEMBERSHIPS & ROLES SERVICE
// -------------------------------------------------------------
export const membershipService = {
  async getProjectMembers(projectId: string): Promise<ProjectMembership[]> {
    await new Promise((r) => setTimeout(r, 100));
    const all = getStored<ProjectMembership[]>(STORAGE_KEYS.MEMBERSHIPS, SEED_MEMBERSHIPS);
    const users = SEED_USERS;
    return all
      .filter((m) => m.projectId === projectId)
      .map((m) => ({
        ...m,
        user: users.find((u) => u.id === m.userId) || m.user,
      }));
  },

  async getUserMemberships(userId: string): Promise<ProjectMembership[]> {
    const all = getStored<ProjectMembership[]>(STORAGE_KEYS.MEMBERSHIPS, SEED_MEMBERSHIPS);
    return all.filter((m) => m.userId === userId);
  },

  async ensureMembership(projectId: string, userId: string, role: ProjectRole = 'MEMBER'): Promise<ProjectMembership> {
    const all = getStored<ProjectMembership[]>(STORAGE_KEYS.MEMBERSHIPS, SEED_MEMBERSHIPS);
    const existingIndex = all.findIndex((m) => m.projectId === projectId && m.userId === userId);
    const targetUser = SEED_USERS.find((u) => u.id === userId);

    if (existingIndex >= 0) {
      all[existingIndex].role = role;
      setStored(STORAGE_KEYS.MEMBERSHIPS, all);
      return all[existingIndex];
    }

    const newMembership: ProjectMembership = {
      id: `mem-${Date.now()}`,
      projectId,
      userId,
      role,
      joinedAt: new Date().toISOString(),
      user: targetUser,
    };

    all.push(newMembership);
    setStored(STORAGE_KEYS.MEMBERSHIPS, all);
    return newMembership;
  },

  async patchMemberRole(projectId: string, userId: string, newRole: ProjectRole): Promise<ProjectMembership> {
    return this.ensureMembership(projectId, userId, newRole);
  },
};

// -------------------------------------------------------------
// TASKS SERVICE
// -------------------------------------------------------------
export const taskService = {
  async getProjectTasks(projectId: string): Promise<Task[]> {
    await new Promise((r) => setTimeout(r, 120));
    const all = getStored<Task[]>(STORAGE_KEYS.TASKS, SEED_TASKS);
    return all.filter((t) => t.projectId === projectId);
  },

  async createTask(projectId: string, taskData: { title: string; description?: string; priority: TaskPriority; assigneeId: string; dueDate?: string }): Promise<Task> {
    const all = getStored<Task[]>(STORAGE_KEYS.TASKS, SEED_TASKS);
    const assignee = SEED_USERS.find((u) => u.id === taskData.assigneeId);

    const newTask: Task = {
      id: `task-${Date.now()}`,
      projectId,
      title: taskData.title,
      description: taskData.description || '',
      status: 'To do',
      priority: taskData.priority,
      assigneeId: taskData.assigneeId,
      assigneeName: assignee ? assignee.name : 'Unassigned',
      dueDate: taskData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newTask, ...all];
    setStored(STORAGE_KEYS.TASKS, updated);
    return newTask;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const all = getStored<Task[]>(STORAGE_KEYS.TASKS, SEED_TASKS);
    const index = all.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Task not found');

    let assigneeName = all[index].assigneeName;
    if (updates.assigneeId && updates.assigneeId !== all[index].assigneeId) {
      const u = SEED_USERS.find((user) => user.id === updates.assigneeId);
      if (u) assigneeName = u.name;
    }

    const updatedTask: Task = {
      ...all[index],
      ...updates,
      assigneeName: assigneeName || all[index].assigneeName,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updatedTask;
    setStored(STORAGE_KEYS.TASKS, all);
    return updatedTask;
  },

  async deleteTask(id: string): Promise<void> {
    const all = getStored<Task[]>(STORAGE_KEYS.TASKS, SEED_TASKS);
    const filtered = all.filter((t) => t.id !== id);
    setStored(STORAGE_KEYS.TASKS, filtered);
  },
};

// -------------------------------------------------------------
// ANALYTICS SERVICE
// -------------------------------------------------------------
export const analyticsService = {
  async getOverview(): Promise<AnalyticsOverview> {
    await new Promise((r) => setTimeout(r, 150));
    const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, SEED_PROJECTS);
    const applications = getStored<Application[]>(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
    const tasks = getStored<Task[]>(STORAGE_KEYS.TASKS, SEED_TASKS);

    const activeProjects = projects.filter((p) => p.status === 'OPEN').length;
    const totalApplicants = applications.length;

    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const overallCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    const deptCounts: Record<string, number> = {};
    projects.forEach((p) => {
      p.departments.forEach((dept) => {
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
      });
    });

    const totalDeptOccurrences = Object.values(deptCounts).reduce((a, b) => a + b, 0) || 1;
    const departmentDistribution = Object.entries(deptCounts).map(([department, count]) => ({
      department,
      count,
      percentage: Math.round((count / totalDeptOccurrences) * 100),
    }));

    const nearingDeadlineProjects = projects
      .filter((p) => p.status === 'OPEN' && !isDeadlinePassed(p.deadline))
      .map((p) => {
        const diffMs = new Date(p.deadline).getTime() - Date.now();
        const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        return {
          id: p.id,
          code: p.code,
          title: p.title,
          deadline: p.deadline,
          daysRemaining,
          departments: p.departments,
        };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);

    return {
      activeProjects,
      totalApplicants,
      overallCompletionRate,
      activeDepartments: Object.keys(deptCounts).length,
      departmentDistribution,
      nearingDeadlineProjects,
    };
  },
};

export function resetMockDataToSeed(): void {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SEED_PROJECTS));
  localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(SEED_MEMBERSHIPS));
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEED_APPLICATIONS));
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_TASKS));
}

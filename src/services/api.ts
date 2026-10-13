import type {
  AnalyticsOverview,
  Application,
  Project,
  ProjectMembership,
  ProjectRole,
  Task,
  TaskPriority,
  User,
} from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

interface BackendResponse<T> {
  success: boolean;
  data?: T;
  error?: { code?: string; message?: string };
}

class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  const payload = (await response.json().catch(() => ({}))) as BackendResponse<T>;

  if (response.status === 401 && retry && localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return request<T>(path, init, false);
  }

  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new ApiError(
      payload.error?.message || `Request failed with status ${response.status}`,
      response.status,
      payload.error?.code,
    );
  }
  return payload.data;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  if (!refreshToken) return false;
  try {
    const result = await request<{ accessToken: string }>(
      '/auth/refresh',
      { method: 'POST', body: JSON.stringify({ refreshToken }) },
      false,
    );
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, result.accessToken);
    return true;
  } catch {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    return false;
  }
}

function mapUser(user: User): User {
  return { ...user, department: user.department || '', rollNumber: user.rollNumber || undefined };
}

export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  accountType: 'student' | 'company';
  rollNumber: string;
  department: string;
}

export interface ProjectAssignment {
  id: string;
  email: string;
  role: 'OWNER' | 'REPRESENTATIVE';
}

function mapProject(raw: Record<string, unknown>): Project {
  const id = String(raw.id);
  const deadline = String(raw.deadlineAt || new Date(8640000000000000).toISOString());
  return {
    id,
    code: String(raw.code || id.slice(-6)),
    title: String(raw.title || raw.name || 'Untitled project'),
    description: String(raw.description || ''),
    departments: Array.isArray(raw.departments)
      ? raw.departments.map(String)
      : Array.isArray(raw.targetDepartments) ? raw.targetDepartments.map(String) : [],
    status: raw.status as Project['status'],
    deadline,
    mentorName: String(raw.mentorName || ''),
    facultyName: String(raw.facultyName || raw.mentorName || ''),
    prerequisites: Array.isArray(raw.prerequisites) ? raw.prerequisites.map(String) : [],
    guidelines: Array.isArray(raw.guidelines) ? raw.guidelines.map(String) : [],
    createdAt: String(raw.createdAt || new Date().toISOString()),
    fullDescription: raw.fullDescription ? String(raw.fullDescription) : undefined,
  };
}

function mapTask(raw: Record<string, unknown>, projectId: string): Task {
  const status = raw.status === 'COMPLETED'
    ? 'Completed'
    : raw.status === 'IN_PROGRESS'
      ? 'In progress'
      : 'To do';
  const assignedTo = raw.assignedTo;
  const assigneeId = typeof assignedTo === 'object' && assignedTo
    ? String((assignedTo as Record<string, unknown>).id)
    : String(raw.assignedToId || '');
  const assigneeName = typeof assignedTo === 'object' && assignedTo
    ? String((assignedTo as Record<string, unknown>).name || '')
    : String(assignedTo || '');
  return {
    id: String(raw.id),
    projectId,
    title: String(raw.title || ''),
    description: String(raw.description || ''),
    status,
    priority: (raw.priority as TaskPriority) || 'Medium',
    assigneeId,
    assigneeName,
    dueDate: raw.dueAt ? String(raw.dueAt) : undefined,
    createdAt: String(raw.createdAt || new Date().toISOString()),
    updatedAt: String(raw.updatedAt || new Date().toISOString()),
  };
}

function mapApplication(raw: Record<string, unknown>, project?: Project): Application {
  const user = (raw.user || {}) as Record<string, unknown>;
  const rawStatus = String(raw.status || '').toUpperCase();
  return {
    id: String(raw.id),
    projectId: String(raw.projectId || ''),
    studentId: String(raw.studentId || user.id || ''),
    studentName: String(raw.studentName || user.name || ''),
    studentEmail: String(raw.studentEmail || user.email || ''),
    studentDepartment: String(raw.studentDepartment || user.department || ''),
    projectTitle: project?.title || String(raw.projectTitle || ''),
    projectCode: project?.code || String(raw.projectCode || ''),
    statement: raw.message ? String(raw.message) : undefined,
    submittedDate: String(raw.submittedDate || new Date().toISOString()),
    status: rawStatus === 'APPROVED' ? 'Accepted' : rawStatus === 'REJECTED' ? 'Rejected' : 'Under Review',
  };
}

export const authService = {
  async login(email: string, password?: string): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const result = await request<{ accessToken: string; refreshToken: string; user: User }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email: email.trim(), password: password || '' }) },
      false,
    );
    return { ...result, user: mapUser(result.user) };
  },

  async signup(name: string, email: string, password: string, department?: string, accountType: 'student' | 'company' = 'student'): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const result = await request<{ accessToken: string; refreshToken: string; user: User }>(
      '/auth/signup',
      { method: 'POST', body: JSON.stringify({ name: name.trim(), email: email.trim(), password, accountType, department: department?.trim() || undefined }) },
      false,
    );
    return { ...result, user: mapUser(result.user) };
  },

  async refresh(): Promise<{ accessToken: string }> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) throw new Error('No refresh token available');
    return request('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }, false);
  },

  async logout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) }) });
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  },
};

export const projectService = {
  async searchStudents(search: string): Promise<AdminStudent[]> {
    const result = await request<{ students: AdminStudent[] }>(
      `/admin/students?q=${encodeURIComponent(search.trim())}`,
    );
    return result.students;
  },
  async getDiscoverProjects(): Promise<Project[]> {
    const result = await request<{ projects: Record<string, unknown>[] }>('/student/projects/browse');
    return result.projects.map(mapProject);
  },

  async getAllProjects(): Promise<Project[]> {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH_USER) || 'null') as User | null;
    if (user?.role === 'admin') {
      const result = await request<{ projects: Record<string, unknown>[] }>('/admin/projects?limit=100');
      return result.projects.map(mapProject);
    }
    const dashboard = await request<{ projects: Record<string, unknown>[] }>('/student');
    return dashboard.projects.map(mapProject);
  },

  async getProjectById(id: string): Promise<Project | null> {
    try {
      const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH_USER) || 'null') as User | null;
      const path = user?.role === 'admin' ? `/admin/projects/${id}` : `/student/projects/${id}`;
      return mapProject(await request<Record<string, unknown>>(path));
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },

  async createProject(projectData: Omit<Project, 'id' | 'createdAt'> & { assignments?: ProjectAssignment[] }): Promise<Project> {
    const result = await request<Record<string, unknown>>('/admin/projects/add', {
      method: 'POST',
      body: JSON.stringify({
        name: projectData.title,
        code: projectData.code,
        description: projectData.description,
        fullDescription: projectData.fullDescription || projectData.description,
        status: projectData.status,
        deadlineAt: projectData.deadline,
        targetDepartments: projectData.departments,
        mentorName: projectData.mentorName,
        facultyName: projectData.mentorName,
        prerequisites: projectData.prerequisites,
        guidelines: projectData.guidelines,
        representative: projectData.assignments?.map((assignment) => ({
          email: assignment.email,
          role: assignment.role,
        })),
      }),
    });
    return mapProject(result);
  },

  async assignMember(projectId: string, userId: string, role: 'OWNER' | 'REPRESENTATIVE'): Promise<void> {
    await request(`/admin/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    });
  },

  async patchProject(id: string, updates: Partial<Project>): Promise<Project> {
    return mapProject(await request<Record<string, unknown>>(`/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...(updates.title ? { name: updates.title } : {}),
        ...(updates.description !== undefined ? { description: updates.description } : {}),
        ...(updates.fullDescription !== undefined ? { fullDescription: updates.fullDescription } : {}),
        ...(updates.mentorName !== undefined ? { mentorName: updates.mentorName, facultyName: updates.mentorName } : {}),
        ...(updates.departments !== undefined ? { targetDepartments: updates.departments } : {}),
        ...(updates.status ? { status: updates.status } : {}),
        ...(updates.deadline ? { deadlineAt: updates.deadline } : {}),
      }),
    }));
  },
};

export const applicationService = {
  async applyToProject(projectId: string, _student: User, statement?: string, _portfolioUrl?: string): Promise<Application> {
    const result = await request<Record<string, unknown>>(`/student/projects/${projectId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ message: statement || '' }),
    });
    return mapApplication(result);
  },

  async getMyApplications(_studentId: string): Promise<Application[]> {
    const result = await request<Record<string, unknown>>('/student/applications');
    return (Array.isArray(result.applications) ? result.applications : [])
      .map((item) => mapApplication(item as Record<string, unknown>));
  },

  async getAdminApplications(statusFilter?: 'PENDING' | 'REVIEWED' | 'ALL'): Promise<Application[]> {
    const result = await request<Record<string, unknown>>('/admin/applications');
    const applications = (Array.isArray(result.applications) ? result.applications : [])
      .map((item) => mapApplication(item as Record<string, unknown>));
    if (statusFilter === 'PENDING') return applications.filter((app) => app.status === 'Under Review');
    if (statusFilter === 'REVIEWED') return applications.filter((app) => app.status !== 'Under Review');
    return applications;
  },

  async patchApplicationStatus(id: string, projectId: string, status: 'Accepted' | 'Rejected'): Promise<Application> {
    const result = await request<Record<string, unknown>>(`/admin/projects/${projectId}/applications/${id}`, {
      method: 'POST',
      body: JSON.stringify({ status: status === 'Accepted' ? 'APPROVED' : 'REJECTED' }),
    });
    return mapApplication(result);
  },
};

export const membershipService = {
  async getProjectMembers(projectId: string): Promise<ProjectMembership[]> {
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH_USER) || 'null') as User | null;
    const path = currentUser?.role === 'admin'
      ? `/admin/projects/${projectId}/members`
      : `/student/projects/${projectId}`;
    const detail = await request<Record<string, unknown>>(path);
    const members = Array.isArray(detail.members) ? detail.members : [];
    return members.map((member) => {
      const raw = member as Record<string, unknown>;
      const rawUser = (raw.user || raw) as Record<string, unknown>;
      const user = {
        id: String(rawUser.id || raw.userId),
        name: String(rawUser.name || ''),
        email: String(rawUser.email || ''),
        role: 'student' as const,
        department: String(rawUser.department || ''),
        rollNumber: String(rawUser.rollNumber || ''),
      };
      return {
        id: String(raw.id),
        projectId,
        userId: String(raw.userId || raw.id),
        role: raw.role as ProjectRole,
        joinedAt: new Date().toISOString(),
        user,
      };
    });
  },

  async getUserMemberships(_userId: string): Promise<ProjectMembership[]> {
    return [];
  },

  async patchMemberRole(projectId: string, userId: string, newRole: ProjectRole): Promise<ProjectMembership> {
    if (newRole === 'MEMBER') {
      throw new Error('The Roles page supports only Owner and Representative assignments.');
    }
    await projectService.assignMember(projectId, userId, newRole);
    const members = await this.getProjectMembers(projectId);
    const updated = members.find((member) => member.userId === userId);
    if (!updated) throw new Error('Role assignment was not returned by the backend.');
    return updated;
  },
};

export const taskService = {
  async getProjectTasks(projectId: string): Promise<Task[]> {
    const detail = await request<Record<string, unknown>>(`/student/projects/${projectId}`);
    return (Array.isArray(detail.tasks) ? detail.tasks : []).map((task) => mapTask(task as Record<string, unknown>, projectId));
  },

  async createTask(projectId: string, taskData: { title: string; description?: string; priority: TaskPriority; assigneeId: string; dueDate?: string }): Promise<Task> {
    const result = await request<Record<string, unknown>>(`/student/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({
        title: taskData.title,
        description: taskData.description,
        assignedTo: taskData.assigneeId,
        dueAt: taskData.dueDate ? `${taskData.dueDate}T00:00:00.000Z` : undefined,
        priority: taskData.priority,
      }),
    });
    return mapTask(result, projectId);
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    if (updates.status) {
      const backendStatus = updates.status === 'In progress' ? 'IN_PROGRESS' : 'COMPLETED';
      return mapTask(await request<Record<string, unknown>>(`/student/tasks/${id}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: backendStatus }),
      }), updates.projectId || '');
    }
    const dueAt = updates.dueDate
      ? (updates.dueDate.length === 10 ? `${updates.dueDate}T00:00:00.000Z` : updates.dueDate)
      : undefined;
    const result = await request<Record<string, unknown>>(`/student/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: updates.title,
        description: updates.description,
        assignedTo: updates.assigneeId,
        dueAt,
        priority: updates.priority,
      }),
    });
    return mapTask(result, updates.projectId || String(result.projectId || ''));
  },

  async deleteTask(id: string): Promise<void> {
    await request<{ id: string; deleted: boolean }>(`/student/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

export const analyticsService = {
  async getOverview(): Promise<AnalyticsOverview> {
    return request<AnalyticsOverview>('/admin/analytics');
  },
};

export function resetMockDataToSeed(): void {
  throw new Error('Mock data reset is unavailable when using the backend API.');
}

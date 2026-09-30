export type ThemeMode = 'dark' | 'light';

export type PlatformRole = 'student' | 'admin';
export type ProjectRole = 'OWNER' | 'REPRESENTATIVE' | 'MEMBER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: PlatformRole;
  department: string;
  rollNumber?: string;
  avatarUrl?: string;
}

export type ProjectStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'ARCHIVED';

export interface Project {
  id: string;
  code: string;
  title: string;
  description: string;
  fullDescription?: string;
  departments: string[];
  status: ProjectStatus;
  deadline: string; // ISO date string
  mentorName: string;
  mentorRole?: string;
  prerequisites?: string[];
  guidelines?: string[];
  createdAt: string;
}

export interface ProjectMembership {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  joinedAt: string;
  user?: User;
}

export type ApplicationStatus = 'Under Review' | 'Accepted' | 'Rejected';

export interface Application {
  id: string;
  projectId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentDepartment: string;
  studentRollNumber?: string;
  projectTitle: string;
  projectCode: string;
  statement?: string;
  portfolioUrl?: string;
  submittedDate: string;
  status: ApplicationStatus;
  reviewedAt?: string;
  reviewedBy?: string;
}

export type TaskStatus = 'To do' | 'In progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentDistribution {
  department: string;
  count: number;
  percentage: number;
}

export interface AnalyticsOverview {
  activeProjects: number;
  totalApplicants: number;
  overallCompletionRate: number;
  activeDepartments: number;
  departmentDistribution: DepartmentDistribution[];
  nearingDeadlineProjects: {
    id: string;
    code: string;
    title: string;
    deadline: string;
    daysRemaining: number;
    departments: string[];
  }[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  badge?: string | number;
}

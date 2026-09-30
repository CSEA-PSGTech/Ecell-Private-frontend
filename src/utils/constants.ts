export const DEPARTMENTS = [
  'CSE',
  'IT',
  'ECE',
  'Mech',
  'BioTech',
  'Civil',
  'EEE',
] as const;

export const PROJECT_STATUSES = ['DRAFT', 'OPEN', 'CLOSED', 'ARCHIVED'] as const;

export const APPLICATION_STATUSES = ['Under Review', 'Accepted', 'Rejected'] as const;

export const TASK_STATUSES = ['To do', 'In progress', 'Completed'] as const;

export const TASK_PRIORITIES = ['Low', 'Medium', 'High'] as const;

export const CURRENT_CYCLE = {
  name: 'Cycle 14',
  deadlineLabel: '8 days left',
  academicYear: 'AY 2026-27',
};

export const APP_CONFIG = {
  NAME: 'Nexus PM',
  ORGANIZATION: 'E-Cell Incubator OS',
  VERSION: '2.0.0',
  DEFAULT_THEME: 'dark' as const,
};

export const NAV_LINKS = [
  { label: 'Discover Projects', path: '/discover' },
  { label: 'My Applications', path: '/applications' },
];

export const STORAGE_KEYS = {
  AUTH_USER: 'ecell_auth_user',
  ACCESS_TOKEN: 'ecell_access_token',
  REFRESH_TOKEN: 'ecell_refresh_token',
  PROJECTS: 'ecell_data_projects',
  APPLICATIONS: 'ecell_data_applications',
  TASKS: 'ecell_data_tasks',
  MEMBERSHIPS: 'ecell_data_memberships',
  THEME: 'ecell_theme',
};

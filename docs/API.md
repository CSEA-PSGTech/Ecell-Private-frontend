# Nexus PM API Documentation

## Current Implementation

The current frontend uses a mock API layer. It does not make HTTP requests yet.

- Service module: `src/services/api.ts`
- Persistence: browser `localStorage`
- Seed data: `src/utils/seedData.ts`
- Authentication: mock tokens, no password validation
- Response style: methods return the resource directly, not an `ApiResponse<T>` wrapper
- IDs: generated with `prefix-${Date.now()}` for newly created records

All methods are asynchronous and return Promises. The small delays simulate network latency.

## Authentication

### `authService.login(email, password?)`

Returns:

```ts
{
  accessToken: string;
  refreshToken: string;
  user: User;
}
```

Notes:

- `password` is accepted but currently ignored.
- Email matching is case-insensitive and trims surrounding whitespace.
- Any seeded email can log in without a password.
- An email containing `admin` falls back to the admin user.
- Otherwise, the method throws `Invalid email or password`.

Demo users:

| Email | Role | User ID |
| --- | --- | --- |
| `alex@college.edu` | student | `user-alex` |
| `sarah@college.edu` | student | `user-sarah` |
| `karthik@college.edu` | student | `user-karthik` |
| `admin@college.edu` | admin | `user-admin` |

### `authService.refresh()`

Returns a new mock access token:

```ts
{ accessToken: string }
```

### `authService.logout()`

Removes the stored auth user, access token, and refresh token. Returns `void`.

## Projects

### `projectService.getDiscoverProjects()`

Returns all projects where:

- `status === 'OPEN'`
- `deadline` has not passed

Department membership is not currently used as a filter.

### `projectService.getAllProjects()`

Returns every stored `Project`, including draft, closed, and archived projects.

### `projectService.getProjectById(id)`

Returns the matching `Project`, or `null` when it does not exist.

### `projectService.createProject(projectData)`

Input:

```ts
Omit<Project, 'id' | 'createdAt'>
```

Creates and returns a project with generated `id` and current ISO `createdAt`.

### `projectService.patchProject(id, updates)`

Input:

```ts
Partial<Project>
```

Merges the updates into the project and returns the updated project. Throws `Project not found` for an unknown ID.

## Applications

### `applicationService.applyToProject(projectId, student, statement?, portfolioUrl?)`

Creates an application for the supplied `User` and returns the new `Application`.

Defaults:

- `statement`: `Eager to contribute technical skills to this innovation track.`
- `portfolioUrl`: `https://github.com`
- `status`: `Under Review`

Errors:

- `Project not found`
- `You have already applied to this project`

### `applicationService.getMyApplications(studentId)`

Returns applications whose `studentId` matches the supplied ID.

### `applicationService.getAdminApplications(statusFilter?)`

Supported filters:

| Filter | Returned applications |
| --- | --- |
| `PENDING` | `status === 'Under Review'` |
| `REVIEWED` | `status === 'Accepted'` or `status === 'Rejected'` |
| `ALL` or omitted | All applications |

### `applicationService.patchApplicationStatus(id, status, reviewerName?)`

Supported status values: `Accepted`, `Rejected`.

Defaults `reviewerName` to `Dr. Aris Thorne`. The method sets `reviewedAt` to the current ISO timestamp and returns the updated application.

When an application is accepted, a `MEMBER` project membership is automatically created or updated for the applicant.

Throws `Application not found` for an unknown ID.

## Memberships and Roles

Supported project roles: `OWNER`, `REPRESENTATIVE`, `MEMBER`.

### `membershipService.getProjectMembers(projectId)`

Returns all memberships for a project and enriches each membership with its matching seeded `User`.

### `membershipService.getUserMemberships(userId)`

Returns all memberships belonging to a user.

### `membershipService.ensureMembership(projectId, userId, role?)`

Creates a membership or updates the role of an existing membership. The default role is `MEMBER`.

### `membershipService.patchMemberRole(projectId, userId, newRole)`

Convenience method that delegates to `ensureMembership`.

## Tasks

Supported statuses: `To do`, `In progress`, `Completed`.

Supported priorities: `Low`, `Medium`, `High`.

### `taskService.getProjectTasks(projectId)`

Returns all tasks belonging to the project.

### `taskService.createTask(projectId, taskData)`

Input:

```ts
{
  title: string;
  description?: string;
  priority: TaskPriority;
  assigneeId: string;
  dueDate?: string;
}
```

Generated/default fields:

- `status`: `To do`
- `description`: empty string when omitted
- `assigneeName`: looked up from seeded users, otherwise `Unassigned`
- `dueDate`: seven days from creation when omitted
- `createdAt` and `updatedAt`: current ISO timestamps

### `taskService.updateTask(id, updates)`

Accepts `Partial<Task>`, refreshes `updatedAt`, and recalculates `assigneeName` when `assigneeId` changes. Throws `Task not found` for an unknown ID.

### `taskService.deleteTask(id)`

Deletes the task if present and returns `void`. Unknown IDs are currently treated as a no-op.

## Analytics

### `analyticsService.getOverview()`

Returns:

```ts
{
  activeProjects: number;
  totalApplicants: number;
  overallCompletionRate: number;
  activeDepartments: number;
  departmentDistribution: {
    department: string;
    count: number;
    percentage: number;
  }[];
  nearingDeadlineProjects: {
    id: string;
    code: string;
    title: string;
    deadline: string;
    daysRemaining: number;
    departments: string[];
  }[];
}
```

Calculation rules:

- `activeProjects`: projects with status `OPEN`
- `totalApplicants`: total number of stored applications
- `overallCompletionRate`: completed tasks divided by all tasks, rounded to a percentage
- `activeDepartments`: departments appearing on at least one project
- `nearingDeadlineProjects`: open, non-expired projects sorted by ascending `daysRemaining`

## Local Storage

| Key | Contents |
| --- | --- |
| `ecell_auth_user` | Current serialized user |
| `ecell_access_token` | Mock access token |
| `ecell_refresh_token` | Mock refresh token |
| `ecell_data_projects` | Stored projects |
| `ecell_data_applications` | Stored applications |
| `ecell_data_tasks` | Stored tasks |
| `ecell_data_memberships` | Stored project memberships |

The data collections are initialized from seed data when their keys do not exist. `resetMockDataToSeed()` restores all four collections but does not clear authentication.

## Important Backend Handoff Notes

When replacing the mock layer with a real backend, preserve these frontend contracts or update the consuming contexts together:

1. Return the resource shapes defined in `src/types/index.ts`.
2. Keep application acceptance atomic with membership creation.
3. Replace mock token handling with real authentication and secure token storage.
4. Add server-side authorization for admin application review, project changes, task changes, and role changes.
5. Validate project deadlines, duplicate applications, user IDs, enum values, and ownership on the server.
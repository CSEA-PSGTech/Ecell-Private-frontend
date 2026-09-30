import React from 'react';
import {
  Compass,
  FileCheck2,
  Kanban,
  Users,
  Eye,
  FolderGit2,
  UserCheck,
  BarChart3,
  Inbox,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProjectData } from '@/context/ProjectDataContext';
import { CURRENT_CYCLE } from '@/utils/constants';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  collapsed,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();
  const { projects, applications, getUserProjects } = useProjectData();

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const openProjectsCount = projects.filter((p) => p.status === 'OPEN').length;
  const pendingAppsCount = applications.filter((a) => a.status === 'Under Review').length;
  const myProjects = getUserProjects(user.id);

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

  return (
    <aside
      style={{
        width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        minWidth: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-base)',
        zIndex: 50,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: 'var(--topbar-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '0' : '0 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          onClick={() => onNavigate(isAdmin ? '/admin' : '/discover')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            E
          </div>
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.2 }}>
                E-Cell Portal
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Private Project Hub
              </span>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            style={{
              color: 'var(--text-muted)',
              padding: '0.25rem',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: collapsed ? '1rem 0.5rem' : '1.25rem 0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Discovery Section (Student & Admin) */}
        <div>
          {!collapsed && (
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0 0.5rem 0.5rem',
              }}
            >
              Discovery
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <button
              onClick={() => onNavigate('/discover')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between',
                padding: '0.5rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isActive('/discover') ? 'var(--brand-primary-light)' : 'transparent',
                color: isActive('/discover') ? 'var(--brand-primary)' : 'var(--text-secondary)',
                fontWeight: isActive('/discover') ? 600 : 500,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              title="Project Discovery"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Compass size={17} />
                {!collapsed && <span>Project Discovery</span>}
              </div>
              {!collapsed && openProjectsCount > 0 && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    backgroundColor: isActive('/discover') ? 'var(--brand-primary)' : 'var(--bg-elevated)',
                    color: isActive('/discover') ? '#ffffff' : 'var(--text-secondary)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600,
                  }}
                >
                  {openProjectsCount}
                </span>
              )}
            </button>

            {!isAdmin && (
              <button
                onClick={() => onNavigate('/applications')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive('/applications') ? 'var(--brand-primary-light)' : 'transparent',
                  color: isActive('/applications') ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive('/applications') ? 600 : 500,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                title="My Applications"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <FileCheck2 size={17} />
                  {!collapsed && <span>My Applications</span>}
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Workspace Section (Student's Joined Projects) */}
        {!isAdmin && (
          <div>
            {!collapsed && (
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: '0 0.5rem 0.5rem',
                }}
              >
                My Projects
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {myProjects.length === 0 ? (
                !collapsed && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.25rem 0.5rem' }}>
                    No enrolled projects
                  </div>
                )
              ) : (
                myProjects.map(({ project, role }) => {
                  const roleIcon =
                    role === 'REPRESENTATIVE' ? <Kanban size={16} /> : role === 'OWNER' ? <Eye size={16} /> : <Users size={16} />;
                  const projectPath = `/workspace/${project.id}`;
                  const isCurrent = currentPath === projectPath;

                  return (
                    <button
                      key={project.id}
                      onClick={() => onNavigate(projectPath)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        padding: '0.5rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isCurrent ? 'var(--brand-primary-light)' : 'transparent',
                        color: isCurrent ? 'var(--brand-primary)' : 'var(--text-secondary)',
                        fontWeight: isCurrent ? 600 : 500,
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all var(--transition-fast)',
                      }}
                      title={`${project.title} (${role})`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
                        {roleIcon}
                        {!collapsed && (
                          <span className="truncate" style={{ maxWidth: '135px' }}>
                            {project.title}
                          </span>
                        )}
                      </div>
                      {!collapsed && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            padding: '0.1rem 0.35rem',
                            borderRadius: 'var(--radius-xs)',
                            backgroundColor:
                              role === 'REPRESENTATIVE'
                                ? 'var(--brand-primary-light)'
                                : role === 'OWNER'
                                ? 'rgba(168, 85, 247, 0.15)'
                                : 'var(--bg-elevated)',
                            color:
                              role === 'REPRESENTATIVE'
                                ? 'var(--brand-primary)'
                                : role === 'OWNER'
                                ? '#a855f7'
                                : 'var(--text-muted)',
                            fontWeight: 600,
                          }}
                        >
                          {role === 'REPRESENTATIVE' ? 'REP' : role}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Admin Suite Section (Admin Only) */}
        {isAdmin && (
          <div>
            {!collapsed && (
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: '0 0.5rem 0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>Admin Suite</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <button
                onClick={() => onNavigate('/admin/projects')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: '0.65rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: currentPath === '/admin' || currentPath === '/admin/projects' ? 'var(--brand-primary-light)' : 'transparent',
                  color: currentPath === '/admin' || currentPath === '/admin/projects' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: currentPath === '/admin' || currentPath === '/admin/projects' ? 600 : 500,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
                title="All Projects"
              >
                <FolderGit2 size={17} />
                {!collapsed && <span>Projects</span>}
              </button>

              <button
                onClick={() => onNavigate('/admin/applications')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: currentPath === '/admin/applications' ? 'var(--brand-primary-light)' : 'transparent',
                  color: currentPath === '/admin/applications' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: currentPath === '/admin/applications' ? 600 : 500,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
                title="Review Queue"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Inbox size={17} />
                  {!collapsed && <span>Review Queue</span>}
                </div>
                {!collapsed && pendingAppsCount > 0 && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      backgroundColor: 'var(--status-warning)',
                      color: '#000000',
                      padding: '0.1rem 0.45rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                    }}
                  >
                    {pendingAppsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onNavigate('/admin/roles')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: '0.65rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: currentPath === '/admin/roles' ? 'var(--brand-primary-light)' : 'transparent',
                  color: currentPath === '/admin/roles' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: currentPath === '/admin/roles' ? 600 : 500,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
                title="Role Allocation"
              >
                <UserCheck size={17} />
                {!collapsed && <span>Roles</span>}
              </button>

              <button
                onClick={() => onNavigate('/admin/analytics')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: '0.65rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: currentPath === '/admin/analytics' ? 'var(--brand-primary-light)' : 'transparent',
                  color: currentPath === '/admin/analytics' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: currentPath === '/admin/analytics' ? 600 : 500,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
                title="Analytics"
              >
                <BarChart3 size={17} />
                {!collapsed && <span>Analytics</span>}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Area: Cycle Badge & Logout */}
      <div
        style={{
          padding: collapsed ? '0.75rem 0.5rem' : '1rem 1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {!collapsed && (
          <div
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-success)',
                }}
              />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {CURRENT_CYCLE.name}
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {CURRENT_CYCLE.deadlineLabel}
            </span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
          }}
        >
          {collapsed ? (
            <button
              onClick={onToggleCollapse}
              style={{
                color: 'var(--text-muted)',
                padding: '0.35rem',
                borderRadius: 'var(--radius-xs)',
              }}
              title="Expand sidebar"
            >
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={() => logout()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
              title="Log out"
            >
              <LogOut size={15} />
              <span>Log out</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

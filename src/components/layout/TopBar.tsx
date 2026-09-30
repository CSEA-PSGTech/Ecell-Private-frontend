import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Check,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { SEED_USERS } from '@/utils/seedData';

interface TopBarProps {
  onOpenSearch: () => void;
  onNavigate: (path: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenSearch, onNavigate }) => {
  const { user, switchPersona, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [personaOpen, setPersonaOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const personaRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) {
        setPersonaOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'Application Approved', desc: 'Your EcoSense IoT Canopy application was accepted.', time: '2h ago', unread: true },
    { id: 2, title: 'Sprint Milestone Due', desc: 'Milestone 2 deliverables lock in 48 hours.', time: '5h ago', unread: false },
    { id: 3, title: 'New Task Assigned', desc: 'MAVLink heartbeat serializer assigned to you.', time: '1d ago', unread: false },
  ];

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: 'var(--bg-topbar)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Global Search Bar (Trigger) */}
      <div style={{ flex: 1, maxWidth: '440px' }}>
        <button
          onClick={onOpenSearch}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.45rem 0.85rem',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            transition: 'border-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={15} />
            <span>Search projects, tasks, applications...</span>
          </div>
          <kbd
            style={{
              padding: '0.1rem 0.4rem',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.7rem',
              fontFamily: 'inherit',
              color: 'var(--text-secondary)',
            }}
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Switch Persona Dropdown (Super useful for reviewing student vs admin vs roles) */}
        <div ref={personaRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setPersonaOpen(!personaOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--brand-primary-border)',
              backgroundColor: 'var(--brand-primary-light)',
              color: 'var(--brand-primary)',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            title="Switch testing persona"
          >
            <Sparkles size={13} />
            <span>Switch Role / User</span>
            <ChevronDown size={13} />
          </button>

          {personaOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '280px',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                zIndex: 60,
                animation: 'fadeIn 120ms ease',
              }}
            >
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  padding: '0.35rem 0.5rem 0.2rem',
                }}
              >
                Select Review Persona
              </div>

              {SEED_USERS.map((u) => {
                const isCurrent = user?.id === u.id;
                let roleDescription = '';
                if (u.id === 'user-alex') roleDescription = 'Rep (Drone Swarm) • Member (EcoSense)';
                else if (u.id === 'user-sarah') roleDescription = 'Owner (CampusConnect) • Member (Drone)';
                else if (u.id === 'user-karthik') roleDescription = 'Applicant • Member (EcoSense)';
                else if (u.id === 'user-admin') roleDescription = 'Full Platform Admin';

                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchPersona(u.id);
                      setPersonaOpen(false);
                      if (u.role === 'admin') onNavigate('/admin');
                      else onNavigate('/discover');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isCurrent ? 'var(--brand-primary-light)' : 'transparent',
                      color: isCurrent ? 'var(--brand-primary)' : 'var(--text-main)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>{u.name}</span>
                        <Badge size="sm" variant={u.role === 'admin' ? 'purple' : 'info'}>
                          {u.role}
                        </Badge>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {roleDescription}
                      </div>
                    </div>
                    {isCurrent && <Check size={15} color="var(--brand-primary)" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              position: 'relative',
              padding: '0.45rem',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
            title="Notifications"
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary)',
              }}
            />
          </button>

          {notifOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '300px',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                zIndex: 60,
                animation: 'fadeIn 120ms ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Notifications</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--brand-primary)', cursor: 'pointer' }}>Mark all read</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '240px', overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '0.45rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: n.unread ? 'var(--bg-surface-hover)' : 'transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-main)' }}>{n.title}</span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{n.time}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{n.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            padding: '0.45rem',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Profile */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
          >
            <Avatar name={user?.name || 'User'} size="sm" />
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {user?.name}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                {user?.role === 'admin' ? 'Board Admin' : user?.department}
              </span>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {profileOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '220px',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                zIndex: 60,
                animation: 'fadeIn 120ms ease',
              }}
            >
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
                <div style={{ marginTop: '0.35rem' }}>
                  <Badge size="sm" variant={user?.role === 'admin' ? 'purple' : 'info'}>
                    {user?.role === 'admin' ? 'Administrator' : `Student • ${user?.rollNumber || ''}`}
                  </Badge>
                </div>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  color: 'var(--status-danger)',
                  fontSize: '0.8125rem',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                }}
              >
                <LogOut size={14} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

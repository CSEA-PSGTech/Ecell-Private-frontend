import React, { useState, useEffect } from 'react';
import { Search, Compass, Kanban } from 'lucide-react';
import { useProjectData } from '@/context/ProjectDataContext';
import { Badge } from '@/components/common/Badge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const { projects, tasks } = useProjectData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingProjects = trimmed
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(trimmed) ||
          p.code.toLowerCase().includes(trimmed) ||
          p.departments.some((d) => d.toLowerCase().includes(trimmed))
      )
    : projects.slice(0, 3);

  const matchingTasks = trimmed
    ? tasks.filter((t) => t.title.toLowerCase().includes(trimmed) || (t.assigneeName && t.assigneeName.toLowerCase().includes(trimmed)))
    : tasks.slice(0, 3);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 120ms ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Search size={18} color="var(--text-muted)" />
          <input
            autoFocus
            type="text"
            placeholder="Type to search projects, tasks, or departments..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.9375rem',
              color: 'var(--text-main)',
            }}
          />
          <kbd
            style={{
              padding: '0.1rem 0.35rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
            }}
          >
            ESC
          </kbd>
        </div>

        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '0.75rem' }}>
          {/* Projects */}
          <div style={{ marginBottom: '1rem' }}>
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginBottom: '0.4rem',
                paddingLeft: '0.5rem',
              }}
            >
              Projects
            </div>
            {matchingProjects.length === 0 ? (
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '0.5rem' }}>
                No projects matched
              </div>
            ) : (
              matchingProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onClose();
                    onNavigate(`/discover`);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Compass size={15} color="var(--brand-primary)" />
                    <div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-main)' }}>
                        {p.title}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                        {p.code}
                      </span>
                    </div>
                  </div>
                  <Badge size="sm" variant={p.status === 'OPEN' ? 'success' : 'neutral'}>
                    {p.status}
                  </Badge>
                </div>
              ))
            )}
          </div>

          {/* Tasks */}
          <div>
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginBottom: '0.4rem',
                paddingLeft: '0.5rem',
              }}
            >
              Tasks
            </div>
            {matchingTasks.length === 0 ? (
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '0.5rem' }}>
                No tasks matched
              </div>
            ) : (
              matchingTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    onClose();
                    onNavigate(`/workspace/${t.projectId}`);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Kanban size={15} color="var(--text-secondary)" />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>{t.title}</span>
                  </div>
                  <Badge
                    size="sm"
                    variant={t.status === 'Completed' ? 'success' : t.status === 'In progress' ? 'warning' : 'neutral'}
                  >
                    {t.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

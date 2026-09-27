import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary' }) => {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary-500)', border: '1px solid rgba(59, 130, 246, 0.3)' },
    success: { background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.3)' },
    warning: { background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.3)' },
    error: { background: 'rgba(239, 68, 68, 0.15)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.3)' },
    info: { background: 'rgba(6, 182, 212, 0.15)', color: 'var(--info)', border: '1px solid rgba(6, 182, 212, 0.3)' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.65rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        ...styles[variant],
      }}
    >
      {children}
    </span>
  );
};

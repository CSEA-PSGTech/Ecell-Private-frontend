import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary' | 'purple';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  style = {},
}) => {
  const styles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    success: {
      bg: 'var(--status-success-bg)',
      text: 'var(--status-success)',
      border: 'var(--status-success-border)',
      dotColor: 'var(--status-success)',
    },
    warning: {
      bg: 'var(--status-warning-bg)',
      text: 'var(--status-warning)',
      border: 'var(--status-warning-border)',
      dotColor: 'var(--status-warning)',
    },
    error: {
      bg: 'var(--status-danger-bg)',
      text: 'var(--status-danger)',
      border: 'var(--status-danger-border)',
      dotColor: 'var(--status-danger)',
    },
    info: {
      bg: 'var(--status-info-bg)',
      text: 'var(--status-info)',
      border: 'var(--status-info-border)',
      dotColor: 'var(--status-info)',
    },
    primary: {
      bg: 'var(--brand-primary-light)',
      text: 'var(--brand-primary)',
      border: 'var(--brand-primary-border)',
      dotColor: 'var(--brand-primary)',
    },
    purple: {
      bg: 'rgba(139, 92, 246, 0.12)',
      text: '#a855f7',
      border: 'rgba(139, 92, 246, 0.25)',
      dotColor: '#a855f7',
    },
    neutral: {
      bg: 'var(--status-neutral-bg)',
      text: 'var(--text-secondary)',
      border: 'var(--border-subtle)',
      dotColor: 'var(--text-muted)',
    },
  };

  const current = styles[variant] || styles.neutral;
  const isSm = size === 'sm';

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: isSm ? '0.15rem 0.45rem' : '0.2rem 0.6rem',
        borderRadius: 'var(--radius-full)',
        fontSize: isSm ? '0.7rem' : '0.75rem',
        fontWeight: 500,
        lineHeight: 1.2,
        backgroundColor: current.bg,
        color: current.text,
        border: `1px solid ${current.border}`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: current.dotColor,
          }}
        />
      )}
      {children}
    </span>
  );
};

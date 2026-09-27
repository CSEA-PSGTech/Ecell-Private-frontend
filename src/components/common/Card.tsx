import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`glass-panel ${className}`} style={{ padding: '1.5rem' }}>
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            {title && <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

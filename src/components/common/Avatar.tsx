import React from 'react';
import { getInitials } from '@/utils/formatters';

export interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  avatarUrl?: string;
  subtitle?: string;
  showName?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'sm',
  avatarUrl,
  subtitle,
  showName = false,
  className = '',
}) => {
  const sizeMap = {
    xs: { dim: 22, font: '0.65rem' },
    sm: { dim: 28, font: '0.75rem' },
    md: { dim: 34, font: '0.8125rem' },
    lg: { dim: 42, font: '0.9375rem' },
  };

  const { dim, font } = sizeMap[size];

  // Deterministic color based on name string
  const colors = [
    '#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#4f46e5'
  ];
  const charCodeSum = (name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const color = colors[charCodeSum % colors.length];

  return (
    <div className={`avatar-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <div
        title={name}
        style={{
          width: `${dim}px`,
          height: `${dim}px`,
          minWidth: `${dim}px`,
          borderRadius: '50%',
          backgroundColor: avatarUrl ? 'transparent' : color,
          backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: font,
          fontWeight: 600,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          userSelect: 'none',
        }}
      >
        {!avatarUrl && getInitials(name)}
      </div>

      {showName && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-main)' }}>{name}</span>
          {subtitle && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};

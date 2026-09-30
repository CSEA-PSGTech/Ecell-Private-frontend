import React from 'react';

export interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  showLabel = true,
  label,
  size = 'md',
  color,
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage || 0)));

  const heights = {
    sm: '4px',
    md: '6px',
    lg: '8px',
  };

  // Determine progress color if not specified
  const barColor = color || (clamped >= 100 ? 'var(--status-success)' : clamped > 50 ? 'var(--brand-primary)' : 'var(--status-warning)');

  return (
    <div className={`progress-wrapper ${className}`} style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.35rem',
          }}
        >
          <span>{label || 'Completion'}</span>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{clamped}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: heights[size],
          backgroundColor: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: '100%',
            backgroundColor: barColor,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
};

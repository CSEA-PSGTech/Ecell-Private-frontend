import React from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = 'var(--radius-xs)',
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius,
        backgroundColor: 'var(--border-subtle)',
        opacity: 0.6,
        ...style,
      }}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="60px" height="18px" borderRadius="12px" />
        <Skeleton width="80px" height="14px" />
      </div>
      <Skeleton width="75%" height="22px" />
      <Skeleton width="100%" height="36px" />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <Skeleton width="45px" height="20px" borderRadius="10px" />
        <Skeleton width="45px" height="20px" borderRadius="10px" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => {
  return (
    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} style={{ padding: '0.85rem 1rem' }}>
          <Skeleton width={i === 0 ? '70%' : '50%'} height="16px" />
        </td>
      ))}
    </tr>
  );
};

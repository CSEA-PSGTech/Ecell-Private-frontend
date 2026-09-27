import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, title, subtitle }) => {
  return (
    <main className="container animate-fade-in" style={{ padding: '2rem 1.5rem 4rem' }}>
      {(title || subtitle) && (
        <div style={{ marginBottom: '2.5rem' }}>
          {title && (
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </main>
  );
};

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/common/Button';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <PageContainer>
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <h1 style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--primary-500)', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '1.75rem', marginTop: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '2rem' }}>
          The requested route does not exist or has been relocated.
        </p>
        <Button variant="primary" onClick={() => onNavigate('/')}>
          Return to Home Page
        </Button>
      </div>
    </PageContainer>
  );
};

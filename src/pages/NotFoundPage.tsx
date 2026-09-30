import React from 'react';
import { Compass } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ padding: '4rem 1rem' }}>
      <EmptyState
        icon={<Compass size={36} />}
        message="The page you are looking for does not exist or has been moved."
        actionLabel="Return to Discover"
        onAction={() => onNavigate('/discover')}
      />
    </div>
  );
};

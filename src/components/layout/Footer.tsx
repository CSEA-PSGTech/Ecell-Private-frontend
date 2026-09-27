import React from 'react';
import { APP_CONFIG } from '@/utils/constants';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: 'auto',
        padding: '3rem 0 2rem',
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{APP_CONFIG.NAME}</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Fostering innovation, entrepreneurship, and leadership.
          </p>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} {APP_CONFIG.ORGANIZATION}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

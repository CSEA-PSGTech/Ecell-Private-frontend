import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { MetricsOverview } from '@/features/dashboard/components/MetricsOverview';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <PageContainer>
      {/* Hero Banner */}
      <section
        className="glass-panel"
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          marginBottom: '3rem',
          background: 'var(--gradient-glass)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.35rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(59, 130, 246, 0.15)',
              color: 'var(--primary-500)',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            ⚡ E-Cell Innovation Engine 2.0
          </span>
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
            }}
          >
            Empowering Next-Gen Founders & Startup Leaders
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              marginBottom: '2.5rem',
              lineHeight: 1.6,
            }}
          >
            Access mentorship, seed incubation support, investor networks, and high-impact founder workshops—all from a unified portal.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" onClick={() => onNavigate('/dashboard')}>
              Explore Dashboard →
            </Button>
            <Button variant="secondary" size="lg" onClick={() => onNavigate('/events')}>
              Upcoming Events
            </Button>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>Ecosystem Impact</h2>
      <MetricsOverview />

      {/* Feature Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card title="🚀 Incubation & Grants" subtitle="Equity-free funding & mentorship">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Pitch your ideas directly to top venture capital partners and access university-backed seed capital pools.
          </p>
        </Card>
        <Card title="💡 Startup Bootcamps" subtitle="Hands-on founder execution">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Participate in intensive weekend hackathons, IP legal clinics, and product-market fit teardowns.
          </p>
        </Card>
        <Card title="🌐 Alumni Network" subtitle="Global mentor directory">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Connect with 500+ successful alumni founders, technical advisors, and industry domain experts.
          </p>
        </Card>
      </div>
    </PageContainer>
  );
};

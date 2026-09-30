import React from 'react';
import { Compass, Users, CheckCircle2, Building2, Clock } from 'lucide-react';
import type { AnalyticsOverview } from '@/types';
import { Card } from '@/components/common/Card';
import { formatDate } from '@/utils/formatters';

interface AdminAnalyticsViewProps {
  analytics: AnalyticsOverview | null;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({
  analytics,
}) => {
  if (!analytics) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Stat Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Projects</span>
            <Compass size={16} color="var(--brand-primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {analytics.activeProjects}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Open for applications
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Applicants</span>
            <Users size={16} color="var(--status-info)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {analytics.totalApplicants}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Across all active cycles
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overall Completion</span>
            <CheckCircle2 size={16} color="var(--status-success)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--status-success)' }}>
            {analytics.overallCompletionRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Sprint milestone pace
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Departments</span>
            <Building2 size={16} color="var(--status-warning)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {analytics.activeDepartments}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Interdisciplinary participation
          </div>
        </Card>
      </div>

      {/* Middle Row: Department Distribution & Projects Nearing Deadline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {/* Department Distribution Chart */}
        <Card
          title="Department Distribution"
          subtitle="Proportion of innovation projects targeting each academic department"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginTop: '0.5rem' }}>
            {analytics.departmentDistribution.map((item) => (
              <div key={item.department} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{item.department}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {item.count} projects ({item.percentage}%)
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      backgroundColor: 'var(--brand-primary)',
                      borderRadius: 'var(--radius-full)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Projects Nearing Deadline */}
        <Card
          title="Projects Nearing Deadline"
          subtitle="Open initiatives requiring final review before application cutoff"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {analytics.nearingDeadlineProjects.length === 0 ? (
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '1rem 0' }}>
                No projects nearing imminent deadlines
              </div>
            ) : (
              analytics.nearingDeadlineProjects.map((p) => {
                const isUrgent = p.daysRemaining <= 7;

                return (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0.85rem',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            padding: '0.1rem 0.35rem',
                            borderRadius: 'var(--radius-xs)',
                            backgroundColor: 'var(--brand-primary-light)',
                            color: 'var(--brand-primary)',
                          }}
                        >
                          {p.code}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                          {p.title}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Target: {p.departments.join(', ')}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: isUrgent ? 'var(--status-warning)' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <Clock size={12} />
                        <span>{p.daysRemaining} days left</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {formatDate(p.deadline)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

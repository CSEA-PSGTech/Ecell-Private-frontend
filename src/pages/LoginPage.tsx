import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { SEED_USERS } from '@/utils/seedData';

interface LoginPageProps {
  onSuccess: (role: 'student' | 'admin') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, sessionExpired, clearSessionExpired } = useAuth();

  const [email, setEmail] = useState('alex@college.edu');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      const targetUser = SEED_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      const role = targetUser?.role || (email.includes('admin') ? 'admin' : 'student');
      onSuccess(role);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('demo-pass');
    setIsLoading(true);
    setError('');
    try {
      await login(userEmail, 'demo-pass');
      const targetUser = SEED_USERS.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
      const role = targetUser?.role || 'student';
      onSuccess(role);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--brand-primary)',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.35rem',
              marginBottom: '1rem',
            }}
          >
            E
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            E-Cell Private Portal
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Sign in to access your project workspace.
          </p>
        </div>

        {/* Session expired notice */}
        {sessionExpired && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--status-warning-bg)',
              border: '1px solid var(--status-warning-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8125rem',
              color: 'var(--status-warning)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={15} />
              <span>Your session expired. Please sign in again.</span>
            </div>
            <button onClick={clearSessionExpired} style={{ fontSize: '0.75rem', color: 'var(--text-main)', cursor: 'pointer' }}>
              ✕
            </button>
          </div>
        )}

        {/* Login Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div
                style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--status-danger-bg)',
                  border: '1px solid var(--status-danger-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8125rem',
                  color: 'var(--status-danger)',
                }}
              >
                {error}
              </div>
            )}

            <Input
              label="College Email"
              type="email"
              placeholder="rollnumber@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={15} />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={15} />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              icon={<ArrowRight size={14} />}
              style={{ marginTop: '0.5rem', width: '100%' }}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Personas */}
          <div
            style={{
              marginTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '1.25rem',
            }}
          >
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
                textAlign: 'center',
              }}
            >
              Demo Accounts
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {SEED_USERS.map((u) => {
                const roleLabel =
                  u.id === 'user-alex' ? 'Student — Rep & Member'
                  : u.id === 'user-sarah' ? 'Student — Owner & Member'
                  : u.id === 'user-karthik' ? 'Student — Applicant'
                  : 'Admin';

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickSelect(u.email)}
                    disabled={isLoading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'border-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                  >
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {roleLabel}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: u.role === 'admin' ? 'rgba(168,85,247,0.12)' : 'var(--brand-primary-light)',
                        color: u.role === 'admin' ? '#a855f7' : 'var(--brand-primary)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {u.role === 'admin' ? 'Admin' : 'Student'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          E-Cell Innovation Hub · PSG College of Technology
        </p>
      </div>
    </div>
  );
};

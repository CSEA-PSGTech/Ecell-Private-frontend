import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, UserRound, Building2, BriefcaseBusiness } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

interface SignupPageProps {
  onSuccess: () => void;
  onGoToLogin: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSuccess, onGoToLogin }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [accountType, setAccountType] = useState<'student' | 'company'>('student');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await signup(name, email, password, accountType === 'student' ? department : undefined, accountType);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create your account.');
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
        <div style={{ textAlign: 'center' }}>
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            Join E-Cell
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Create an account to join an assigned project workspace.
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div
                role="alert"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {(['student', 'company'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAccountType(type)}
                  aria-pressed={accountType === type}
                  style={{
                    padding: '0.7rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${accountType === type ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                    backgroundColor: accountType === type ? 'var(--brand-primary-muted)' : 'transparent',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {type === 'student' ? <UserRound size={15} /> : <BriefcaseBusiness size={15} />}
                  <span style={{ marginLeft: '0.35rem' }}>{type === 'student' ? 'Student' : 'Company'}</span>
                </button>
              ))}
            </div>

            <Input label="Full Name" type="text" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} leftIcon={<UserRound size={15} />} required />
            <Input label="College Email" type="email" placeholder="you@college.edu" value={email} onChange={(event) => setEmail(event.target.value)} leftIcon={<Mail size={15} />} required />
            {accountType === 'student' && (
              <Input label="Department" type="text" placeholder="e.g. CSE" value={department} onChange={(event) => setDepartment(event.target.value)} leftIcon={<Building2 size={15} />} required />
            )}
            <Input label="Password" type="password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} leftIcon={<Lock size={15} />} minLength={8} required />
            <Input label="Confirm Password" type="password" placeholder="Re-enter your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} leftIcon={<Lock size={15} />} minLength={8} required />

            <Button type="submit" variant="primary" size="md" isLoading={isLoading} icon={<ArrowRight size={14} />} style={{ marginTop: '0.5rem', width: '100%' }}>
              Create {accountType === 'student' ? 'Student' : 'Company'} Account
            </Button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '1.25rem' }}>
            Already have an account?{' '}
            <button type="button" onClick={onGoToLogin} style={{ color: 'var(--brand-primary)', fontWeight: 600, cursor: 'pointer' }}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

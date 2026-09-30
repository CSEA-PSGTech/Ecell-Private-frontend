export const formatDate = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return '—';
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return String(dateInput);
  }
};

export const getDaysRemaining = (deadlineInput: string | Date): { days: number; text: string; isPast: boolean } => {
  try {
    const deadline = new Date(deadlineInput).getTime();
    const now = new Date().getTime();
    const diffMs = deadline - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { days: 0, text: 'Deadline passed', isPast: true };
    }
    if (diffDays === 1) {
      return { days: 1, text: '1 day left', isPast: false };
    }
    return { days: diffDays, text: `${diffDays} days left`, isPast: false };
  } catch {
    return { days: 0, text: 'No deadline', isPast: false };
  }
};

export const isDeadlinePassed = (deadlineInput: string | Date): boolean => {
  const { isPast } = getDaysRemaining(deadlineInput);
  return isPast;
};

export const calculateCompletionPercentage = (completedTasks: number, totalTasks: number): number => {
  if (!totalTasks || totalTasks <= 0) return 0;
  return Math.min(100, Math.round((completedTasks / totalTasks) * 100));
};

export const getInitials = (name: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

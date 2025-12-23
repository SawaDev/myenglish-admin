import { cn } from '@/lib/utils';

type StatusType = 'active' | 'blocked' | 'expired' | 'pending' | 'new' | 'submitted' | 'graded';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  active: 'status-active',
  blocked: 'status-blocked',
  expired: 'status-blocked',
  pending: 'status-pending',
  new: 'status-new',
  new_student: 'status-new',
  submitted: 'status-pending',
  graded: 'status-active',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(' ', '_');
  const styleClass = statusStyles[normalizedStatus] || 'status-pending';
  
  return (
    <span className={cn('status-badge', styleClass, className)}>
      {status.replace('_', ' ')}
    </span>
  );
}

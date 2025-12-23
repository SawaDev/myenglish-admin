import { cn } from '@/lib/utils';
import { TeacherRole } from '@/lib/mockData';

interface RoleBadgeProps {
  role: TeacherRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span className={cn(
      'role-badge',
      role === 'main' ? 'role-main' : 'role-assistant',
      className
    )}>
      {role === 'main' ? 'Main Teacher' : 'Assistant'}
    </span>
  );
}

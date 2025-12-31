import { cn } from '@/lib/utils';
import { TeacherRole } from '@/lib/mockData';

interface RoleBadgeProps {
  role: TeacherRole | string;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const normalized = role.toString().toLowerCase();
  const isMain = normalized === 'main' || normalized === 'main_teacher';

  return (
    <span className={cn(
      'role-badge',
      isMain ? 'role-main' : 'role-assistant',
      className
    )}>
      {isMain ? 'Main Teacher' : 'Assistant'}
    </span>
  );
}

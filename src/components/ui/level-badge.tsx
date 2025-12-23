import { cn } from '@/lib/utils';
import { Level } from '@/lib/mockData';

interface LevelBadgeProps {
  level: Level;
  className?: string;
}

const levelColors: Record<Level, string> = {
  'Beginner': 'bg-success/10 text-success',
  'Elementary': 'bg-primary/10 text-primary',
  'Intermediate': 'bg-warning/10 text-warning',
  'Upper-Intermediate': 'bg-orange-100 text-orange-700',
  'Advanced': 'bg-destructive/10 text-destructive',
};

export function LevelBadge({ level, className }: LevelBadgeProps) {
  return (
    <span className={cn(
      'level-badge',
      levelColors[level],
      className
    )}>
      {level}
    </span>
  );
}

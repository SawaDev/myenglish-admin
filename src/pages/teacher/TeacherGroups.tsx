import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { LevelBadge } from '@/components/ui/level-badge';
import { RoleBadge } from '@/components/ui/role-badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getGroupsByTeacherId, Group } from '@/lib/mockData';

export function TeacherGroups() {
  const { user } = useAuth();
  const teacherGroups = getGroupsByTeacherId(user?.id || '');

  const columns = [
    {
      key: 'name',
      header: 'Group Name',
      render: (group: Group) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <span className="font-medium text-foreground">{group.name}</span>
        </div>
      ),
    },
    {
      key: 'level',
      header: 'Level',
      render: (group: Group) => <LevelBadge level={group.level} />,
    },
    {
      key: 'students',
      header: 'Students',
      render: (group: Group) => (
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(group.studentIds.length / group.maxStudents) * 100}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {group.studentIds.length}/{group.maxStudents}
          </span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Your Role',
      render: (group: Group) => (
        <RoleBadge role={group.mainTeacherId === user?.id ? 'main' : 'assistant'} />
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (group: Group) => (
        <Link to={`/teacher/groups/${group.id}`}>
          <Button variant="outline" size="sm">Open Group</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Groups</h1>
        <p className="page-subtitle">Manage your assigned teaching groups</p>
      </div>

      <div className="content-card">
        <DataTable
          columns={columns}
          data={teacherGroups}
          keyExtractor={(group) => group.id}
          emptyMessage="You haven't been assigned to any groups yet."
        />
      </div>
    </div>
  );
}

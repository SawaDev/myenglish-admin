import { Link } from 'react-router-dom';
import { Users, ClipboardList, Calendar, Award } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { LevelBadge } from '@/components/ui/level-badge';
import { RoleBadge } from '@/components/ui/role-badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getGroupsByTeacherId, getTeacherById, groups, students, assignments } from '@/lib/mockData';

export function TeacherDashboard() {
  const { user } = useAuth();
  const teacherGroups = getGroupsByTeacherId(user?.id || '');
  const teacher = getTeacherById(user?.id || '');
  
  const totalStudents = teacherGroups.reduce((acc, g) => acc + g.studentIds.length, 0);
  const totalAssignments = assignments.filter(a => 
    teacherGroups.some(g => g.id === a.groupId)
  ).length;
  const pendingSubmissions = assignments
    .filter(a => teacherGroups.some(g => g.id === a.groupId))
    .reduce((acc, a) => acc + a.submissions.filter(s => s.status === 'Submitted').length, 0);

  const columns = [
    {
      key: 'name',
      header: 'Group Name',
      render: (group: typeof groups[0]) => (
        <span className="font-medium text-foreground">{group.name}</span>
      ),
    },
    {
      key: 'level',
      header: 'Level',
      render: (group: typeof groups[0]) => <LevelBadge level={group.level} />,
    },
    {
      key: 'students',
      header: 'Students',
      render: (group: typeof groups[0]) => (
        <span>{group.studentIds.length}/{group.maxStudents}</span>
      ),
    },
    {
      key: 'role',
      header: 'Your Role',
      render: (group: typeof groups[0]) => (
        <RoleBadge role={group.mainTeacherId === user?.id ? 'main' : 'assistant'} />
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (group: typeof groups[0]) => (
        <Link to={`/teacher/groups/${group.id}`}>
          <Button variant="outline" size="sm">Open Group</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {teacher?.name?.split(' ')[0]}</h1>
        <p className="page-subtitle">Here's what's happening with your groups today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="My Groups"
          value={teacherGroups.length}
          icon={Users}
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
        />
        <StatCard
          title="Active Assignments"
          value={totalAssignments}
          icon={ClipboardList}
        />
        <StatCard
          title="Pending Reviews"
          value={pendingSubmissions}
          icon={Award}
          iconClassName={pendingSubmissions > 0 ? 'bg-warning/10' : undefined}
        />
      </div>

      {/* Groups Table */}
      <div className="content-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">My Groups</h2>
          <Link to="/teacher/groups">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        <DataTable
          columns={columns}
          data={teacherGroups}
          keyExtractor={(group) => group.id}
        />
      </div>
    </div>
  );
}

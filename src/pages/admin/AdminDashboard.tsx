import { Link } from 'react-router-dom';
import { Users, GraduationCap, BookOpen, UserX, Plus, UserPlus, Eye } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { groups, students, teachers, getNewStudents, Student } from '@/lib/mockData';

export function AdminDashboard() {
  const totalStudents = students.filter(s => s.status !== 'NEW_STUDENT').length;
  const activeGroups = groups.length;
  const totalTeachers = teachers.length;
  const blockedStudents = students.filter(s => s.status === 'BLOCKED' || s.status === 'EXPIRED').length;
  const newStudents = getNewStudents();

  const newStudentColumns = [
    {
      key: 'avatar',
      header: '',
      render: (student: Student) => (
        <Avatar className="w-8 h-8">
          <AvatarImage src={student.avatar} alt={student.name} />
          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
      className: 'w-12',
    },
    {
      key: 'name',
      header: 'Name',
      render: (student: Student) => (
        <span className="font-medium text-foreground">{student.name}</span>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'registrationDate',
      header: 'Registered',
      render: (student: Student) => (
        <span>{new Date(student.registrationDate).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: () => <StatusBadge status="NEW_STUDENT" />,
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of your LMS platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={GraduationCap}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Active Groups"
          value={activeGroups}
          icon={Users}
        />
        <StatCard
          title="Teachers"
          value={totalTeachers}
          icon={BookOpen}
        />
        <StatCard
          title="Blocked/Expired"
          value={blockedStudents}
          icon={UserX}
          iconClassName="bg-destructive/10"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/groups" className="content-card hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Create Group</h3>
              <p className="text-sm text-muted-foreground">Add a new study group</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/teachers" className="content-card hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Assign Teacher</h3>
              <p className="text-sm text-muted-foreground">Manage teacher assignments</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/new-students" className="content-card hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
              <UserPlus className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">New Students</h3>
              <p className="text-sm text-muted-foreground">{newStudents.length} waiting for activation</p>
            </div>
          </div>
        </Link>
      </div>

      {/* New Students Table */}
      <div className="content-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Registrations
            {newStudents.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                {newStudents.length} new
              </span>
            )}
          </h2>
          <Link to="/admin/new-students">
            <Button variant="ghost" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              View All
            </Button>
          </Link>
        </div>
        <DataTable
          columns={newStudentColumns}
          data={newStudents.slice(0, 5)}
          keyExtractor={(student) => student.id}
          emptyMessage="No new registrations"
        />
      </div>
    </div>
  );
}

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, UserPlus, UserMinus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { LevelBadge } from '@/components/ui/level-badge';
import { RoleBadge } from '@/components/ui/role-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  getGroupById, 
  getStudentsByGroupId, 
  getTeacherById,
  Student 
} from '@/lib/mockData';

export function AdminGroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  
  const group = getGroupById(groupId || '');
  const students = getStudentsByGroupId(groupId || '');
  const mainTeacher = getTeacherById(group?.mainTeacherId || '');
  const assistantTeacher = group?.assistantTeacherId ? getTeacherById(group.assistantTeacherId) : null;

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Group not found</p>
        <Link to="/admin/groups">
          <Button variant="outline" className="mt-4">Back to Groups</Button>
        </Link>
      </div>
    );
  }

  const capacityPercent = (group.studentIds.length / group.maxStudents) * 100;

  const studentColumns = [
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
      key: 'status',
      header: 'Status',
      render: (student: Student) => <StatusBadge status={student.status} />,
    },
    {
      key: 'attendance',
      header: 'Attendance',
      render: (student: Student) => <span>{student.attendancePercent}%</span>,
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
          <UserMinus className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/groups">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="page-title">{group.name}</h1>
            <LevelBadge level={group.level} />
          </div>
          <p className="page-subtitle">Manage group settings and students</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Pencil className="w-4 h-4" />
          Edit Group
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Capacity */}
        <div className="content-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Capacity</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-semibold">{group.studentIds.length}</span>
                <span className="text-muted-foreground">/ {group.maxStudents}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    capacityPercent >= 90 ? 'bg-destructive' : 
                    capacityPercent >= 70 ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Teacher */}
        <div className="content-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Main Teacher</h3>
          {mainTeacher ? (
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={mainTeacher.avatar} alt={mainTeacher.name} />
                <AvatarFallback>{mainTeacher.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{mainTeacher.name}</p>
                <RoleBadge role="main" />
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Not assigned</p>
          )}
        </div>

        {/* Assistant Teacher */}
        <div className="content-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Assistant Teacher</h3>
          {assistantTeacher ? (
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={assistantTeacher.avatar} alt={assistantTeacher.name} />
                <AvatarFallback>{assistantTeacher.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{assistantTeacher.name}</p>
                <RoleBadge role="assistant" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Not assigned</span>
              <Button variant="ghost" size="sm" className="text-primary">
                Assign
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Students */}
      <div className="content-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Students</h2>
          <Button className="gap-2" disabled={group.studentIds.length >= group.maxStudents}>
            <UserPlus className="w-4 h-4" />
            Add Student
          </Button>
        </div>
        <DataTable
          columns={studentColumns}
          data={students}
          keyExtractor={(student) => student.id}
          emptyMessage="No students in this group."
        />
      </div>
    </div>
  );
}

import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, UserPlus, UserMinus, Pencil, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { RoleBadge } from '@/components/ui/role-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import api from '@/lib/axios';

interface Teacher {
  id: number;
  name: string;
  avatar: string;
}

interface Student {
  id: number;
  name: string;
  avatar: string;
  phone: string;
  status: string;
  attendance_rate: number;
}

interface GroupDetail {
  id: number;
  name: string;
  main_teacher: Teacher | null;
  assistant_teacher: Teacher | null;
  students: Student[];
}

export function AdminGroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();

  const { data: group, isLoading } = useQuery({
    queryKey: ['adminGroupDetail', groupId],
    queryFn: async () => {
      const response = await api.get<GroupDetail>(`/admin/groups/${groupId}`);
      return response.data;
    },
    enabled: !!groupId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
      key: 'attendance_rate',
      header: 'Attendance',
      render: (student: Student) => <span>{student.attendance_rate}%</span>,
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
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Students</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-semibold">{group.students.length}</span>
                <span className="text-muted-foreground">Students</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Teacher */}
        <div className="content-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Main Teacher</h3>
          {group.main_teacher ? (
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={group.main_teacher.avatar} alt={group.main_teacher.name} />
                <AvatarFallback>{group.main_teacher.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{group.main_teacher.name}</p>
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
          {group.assistant_teacher ? (
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={group.assistant_teacher.avatar} alt={group.assistant_teacher.name} />
                <AvatarFallback>{group.assistant_teacher.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{group.assistant_teacher.name}</p>
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
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add Student
          </Button>
        </div>
        <DataTable
          columns={studentColumns}
          data={group.students}
          keyExtractor={(student) => student.id.toString()}
          emptyMessage="No students in this group."
        />
      </div>
    </div>
  );
}

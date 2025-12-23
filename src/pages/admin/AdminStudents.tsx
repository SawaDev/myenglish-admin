import { useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { students, getGroupById, getTeacherById, Student } from '@/lib/mockData';

export function AdminStudents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filter out NEW_STUDENT status (they have their own page)
  const activeStudents = students.filter(s => s.status !== 'NEW_STUDENT');
  
  const filteredStudents = activeStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.includes(searchQuery) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'avatar',
      header: '',
      render: (student: Student) => (
        <Avatar className="w-10 h-10">
          <AvatarImage src={student.avatar} alt={student.name} />
          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
      className: 'w-14',
    },
    {
      key: 'name',
      header: 'Name',
      render: (student: Student) => (
        <div>
          <span className="font-medium text-foreground">{student.name}</span>
          <p className="text-sm text-muted-foreground">{student.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'group',
      header: 'Group',
      render: (student: Student) => {
        const group = student.groupId ? getGroupById(student.groupId) : null;
        return <span className="text-muted-foreground">{group?.name || '-'}</span>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (student: Student) => <StatusBadge status={student.status} />,
    },
    {
      key: 'attendance',
      header: 'Attendance',
      render: (student: Student) => (
        <div className="flex items-center gap-2">
          <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                student.attendancePercent >= 80 ? 'bg-success' : 
                student.attendancePercent >= 60 ? 'bg-warning' : 
                'bg-destructive'
              }`}
              style={{ width: `${student.attendancePercent}%` }}
            />
          </div>
          <span className="text-sm">{student.attendancePercent}%</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (student: Student) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setSelectedStudent(student)}>
              <Eye className="w-4 h-4" />
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Student Profile</DialogTitle>
            </DialogHeader>
            <StudentProfile student={student} />
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Students Management</h1>
        <p className="page-subtitle">View and manage all students</p>
      </div>

      {/* Search */}
      <div className="content-card mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="content-card">
        <DataTable
          columns={columns}
          data={filteredStudents}
          keyExtractor={(student) => student.id}
          emptyMessage="No students found"
        />
      </div>
    </div>
  );
}

function StudentProfile({ student }: { student: Student }) {
  const group = student.groupId ? getGroupById(student.groupId) : null;
  const mainTeacher = group ? getTeacherById(group.mainTeacherId) : null;
  const assistantTeacher = group?.assistantTeacherId ? getTeacherById(group.assistantTeacherId) : null;

  return (
    <div className="pt-4 space-y-6">
      {/* Basic Info */}
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={student.avatar} alt={student.name} />
          <AvatarFallback className="text-xl">{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold text-foreground">{student.name}</h3>
          <p className="text-muted-foreground">{student.phone}</p>
          <StatusBadge status={student.status} className="mt-1" />
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Group</p>
          <p className="font-medium text-foreground">{group?.name || '-'}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Level</p>
          <p className="font-medium text-foreground">{group?.level || '-'}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Main Teacher</p>
          <p className="font-medium text-foreground">{mainTeacher?.name || '-'}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Assistant</p>
          <p className="font-medium text-foreground">{assistantTeacher?.name || '-'}</p>
        </div>
      </div>

      {/* Scores */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Performance</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Attendance</span>
            <span className="font-medium">{student.attendancePercent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                student.attendancePercent >= 80 ? 'bg-success' : 
                student.attendancePercent >= 60 ? 'bg-warning' : 
                'bg-destructive'
              }`}
              style={{ width: `${student.attendancePercent}%` }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Score</span>
            <span className="font-medium">{student.totalScore}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                student.totalScore >= 80 ? 'bg-success' : 
                student.totalScore >= 60 ? 'bg-warning' : 
                'bg-destructive'
              }`}
              style={{ width: `${student.totalScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="border-t border-border pt-4">
        <h4 className="font-medium text-foreground mb-3">Payment Period</h4>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">
              {student.paymentStartDate && student.paymentEndDate
                ? `${new Date(student.paymentStartDate).toLocaleDateString()} - ${new Date(student.paymentEndDate).toLocaleDateString()}`
                : 'Not set'}
            </p>
          </div>
          <StatusBadge 
            status={
              student.status === 'EXPIRED' || student.status === 'BLOCKED' 
                ? 'Expired' 
                : 'Active'
            } 
          />
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Eye, Search, Plus, Pencil, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StudentDialog } from '@/components/admin/StudentDialog';
import api from '@/lib/axios';

interface Teacher {
  id: number;
  name: string;
}

interface Group {
  id: number;
  name: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  status: string;
  attendance_rate: number;
  total_score: number;
  group: Group | null;
  teacher: Teacher | null;
  assistant_teacher: Teacher | null;
  payment_expiry?: string;
}

export function AdminStudents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const { data: students, isLoading } = useQuery({
    queryKey: ['adminStudents'],
    queryFn: async () => {
      const response = await api.get<Student[]>('/admin/students');
      return response.data;
    },
  });

  const filteredStudents = students?.filter(s => 
    s.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
    s.phone?.includes(searchQuery) ||
    s.email?.toLowerCase().includes(searchQuery?.toLowerCase())
  ) || [];

  const handleEdit = (student: Student) => {
    setStudentToEdit(student);
    setIsStudentDialogOpen(true);
  };

  const handleAddNew = () => {
    setStudentToEdit(null);
    setIsStudentDialogOpen(true);
  };

  const columns = [
    {
      key: 'avatar',
      header: '',
      render: (student: Student) => (
        <Avatar className="w-10 h-10">
          <AvatarImage src={student.avatar_url} alt={student.name} />
          <AvatarFallback>{student.name?.charAt(0)}</AvatarFallback>
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
      render: (student: Student) => (
        <span className="text-muted-foreground">{student.group?.name || '-'}</span>
      ),
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
                student.attendance_rate >= 80 ? 'bg-success' : 
                student.attendance_rate >= 60 ? 'bg-warning' : 
                'bg-destructive'
              }`}
              style={{ width: `${student.attendance_rate}%` }}
            />
          </div>
          <span className="text-sm">{student.attendance_rate}%</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (student: Student) => (
        <div className="flex gap-2">
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
          <Button variant="ghost" size="sm" onClick={() => handleEdit(student)}>
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Students Management</h1>
          <p className="page-subtitle">View and manage all students</p>
        </div>
        <Button className="gap-2" onClick={handleAddNew}>
          <Plus className="w-4 h-4" />
          Add New Student
        </Button>
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
          keyExtractor={(student) => student.id.toString()}
          emptyMessage="No students found"
        />
      </div>

      <StudentDialog
        isOpen={isStudentDialogOpen}
        onClose={() => setIsStudentDialogOpen(false)}
        studentToEdit={studentToEdit}
      />
    </div>
  );
}

function StudentProfile({ student }: { student: Student }) {
  return (
    <div className="pt-4 space-y-6">
      {/* Basic Info */}
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={student.avatar_url} alt={student.name} />
          <AvatarFallback className="text-xl">{student.name?.charAt(0)}</AvatarFallback>
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
          <p className="font-medium text-foreground">{student.group?.name || '-'}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Total Score</p>
          <p className="font-medium text-foreground">{student.total_score}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Main Teacher</p>
          <p className="font-medium text-foreground">{student.teacher?.name || '-'}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Assistant</p>
          <p className="font-medium text-foreground">{student.assistant_teacher?.name || '-'}</p>
        </div>
      </div>

      {/* Scores */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Performance</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Attendance Rate</span>
            <span className="font-medium">{student.attendance_rate}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                student.attendance_rate >= 80 ? 'bg-success' : 
                student.attendance_rate >= 60 ? 'bg-warning' : 
                'bg-destructive'
              }`}
              style={{ width: `${student.attendance_rate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="border-t border-border pt-4">
        <h4 className="font-medium text-foreground mb-3">Payment Expiry</h4>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">
              {student.payment_expiry
                ? new Date(student.payment_expiry).toLocaleDateString()
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

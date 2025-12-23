import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { students, getGroupById, Student } from '@/lib/mockData';

export function AdminPayments() {
  // Filter students who are in groups (not NEW_STUDENT)
  const enrolledStudents = students.filter(s => s.status !== 'NEW_STUDENT');
  
  const expiredStudents = enrolledStudents.filter(
    s => s.status === 'EXPIRED' || s.status === 'BLOCKED'
  );
  const activeStudents = enrolledStudents.filter(s => s.status === 'ACTIVE');

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
      header: 'Student',
      render: (student: Student) => {
        const group = student.groupId ? getGroupById(student.groupId) : null;
        return (
          <div>
            <span className="font-medium text-foreground">{student.name}</span>
            <p className="text-sm text-muted-foreground">{group?.name}</p>
          </div>
        );
      },
    },
    {
      key: 'paymentPeriod',
      header: 'Payment Period',
      render: (student: Student) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>
            {student.paymentStartDate && student.paymentEndDate
              ? `${new Date(student.paymentStartDate).toLocaleDateString()} - ${new Date(student.paymentEndDate).toLocaleDateString()}`
              : '-'}
          </span>
        </div>
      ),
    },
    {
      key: 'daysRemaining',
      header: 'Days Remaining',
      render: (student: Student) => {
        if (!student.paymentEndDate) return <span>-</span>;
        const endDate = new Date(student.paymentEndDate);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          return <span className="text-destructive font-medium">{Math.abs(diffDays)} days overdue</span>;
        } else if (diffDays <= 7) {
          return <span className="text-warning font-medium">{diffDays} days left</span>;
        } else {
          return <span className="text-success">{diffDays} days left</span>;
        }
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (student: Student) => {
        const isExpired = student.status === 'EXPIRED' || student.status === 'BLOCKED';
        return (
          <div className="flex items-center gap-2">
            <StatusBadge status={isExpired ? 'Expired' : 'Active'} />
            {isExpired && (
              <span className="text-xs text-destructive">Content blocked</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      render: (student: Student) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Update Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Payment Period</DialogTitle>
            </DialogHeader>
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{student.name}</p>
                  <StatusBadge status={student.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input 
                    type="date" 
                    defaultValue={student.paymentStartDate || undefined}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input 
                    type="date" 
                    defaultValue={student.paymentEndDate || undefined}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Payments & Blocking</h1>
        <p className="page-subtitle">Manage student payment periods and access</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="content-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Payments</p>
              <p className="text-2xl font-semibold text-foreground">{activeStudents.length}</p>
            </div>
          </div>
        </div>
        <div className="content-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expired/Blocked</p>
              <p className="text-2xl font-semibold text-foreground">{expiredStudents.length}</p>
            </div>
          </div>
        </div>
        <div className="content-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expiring Soon (7 days)</p>
              <p className="text-2xl font-semibold text-foreground">
                {enrolledStudents.filter(s => {
                  if (!s.paymentEndDate || s.status !== 'ACTIVE') return false;
                  const endDate = new Date(s.paymentEndDate);
                  const today = new Date();
                  const diffTime = endDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays > 0 && diffDays <= 7;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expired Students Alert */}
      {expiredStudents.length > 0 && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">
                {expiredStudents.length} student{expiredStudents.length !== 1 ? 's have' : ' has'} expired payments
              </h3>
              <p className="text-sm text-muted-foreground">
                Their accounts are visible but content access is blocked until payment is renewed.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="content-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">All Students</h2>
        <DataTable
          columns={columns}
          data={enrolledStudents}
          keyExtractor={(student) => student.id}
          emptyMessage="No students found"
        />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, ClipboardList, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { LevelBadge } from '@/components/ui/level-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  getGroupById, 
  getStudentsByGroupId, 
  getAssignmentsByGroupId,
  getAttendanceByGroupId,
  getTeacherById,
  Student,
  Assignment,
} from '@/lib/mockData';

export function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const group = getGroupById(groupId || '');
  const students = getStudentsByGroupId(groupId || '');
  const assignments = getAssignmentsByGroupId(groupId || '');
  const attendanceRecords = getAttendanceByGroupId(groupId || '');
  const mainTeacher = getTeacherById(group?.mainTeacherId || '');
  const assistantTeacher = group?.assistantTeacherId ? getTeacherById(group.assistantTeacherId) : null;

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Group not found</p>
        <Link to="/teacher/groups">
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
      header: 'Full Name',
      render: (student: Student) => (
        <span className="font-medium text-foreground">{student.name}</span>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'attendance',
      header: 'Attendance %',
      render: (student: Student) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${student.attendancePercent >= 80 ? 'bg-success' : student.attendancePercent >= 60 ? 'bg-warning' : 'bg-destructive'}`}
              style={{ width: `${student.attendancePercent}%` }}
            />
          </div>
          <span className="text-sm">{student.attendancePercent}%</span>
        </div>
      ),
    },
    {
      key: 'totalScore',
      header: 'Total Score',
      render: (student: Student) => (
        <span className={`font-medium ${student.totalScore >= 80 ? 'text-success' : student.totalScore >= 60 ? 'text-warning' : 'text-destructive'}`}>
          {student.totalScore}
        </span>
      ),
    },
  ];

  const assignmentColumns = [
    {
      key: 'title',
      header: 'Title',
      render: (assignment: Assignment) => (
        <span className="font-medium text-foreground">{assignment.title}</span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (assignment: Assignment) => (
        <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'submissions',
      header: 'Submissions',
      render: (assignment: Assignment) => (
        <span>{assignment.submissions.length}/{students.length}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (assignment: Assignment) => {
        const pending = assignment.submissions.filter(s => s.status === 'Submitted').length;
        return pending > 0 ? (
          <StatusBadge status="pending" />
        ) : (
          <StatusBadge status="active" />
        );
      },
    },
    {
      key: 'actions',
      header: '',
      render: (assignment: Assignment) => (
        <Link to={`/teacher/assignments/${assignment.id}`}>
          <Button variant="outline" size="sm">Review</Button>
        </Link>
      ),
    },
  ];

  const todayAttendance = attendanceRecords.find(r => r.date === selectedDate);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/teacher/groups">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="page-title">{group.name}</h1>
            <LevelBadge level={group.level} />
          </div>
          <p className="page-subtitle">
            {mainTeacher?.name} {assistantTeacher && `• ${assistantTeacher.name} (Assistant)`}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="students" className="gap-2">
            <Users className="w-4 h-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="assignments" className="gap-2">
            <ClipboardList className="w-4 h-4" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2">
            <Calendar className="w-4 h-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="grades" className="gap-2">
            <Award className="w-4 h-4" />
            Grades
          </TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students">
          <div className="content-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Students ({students.length}/{group.maxStudents})
              </h2>
            </div>
            <DataTable
              columns={studentColumns}
              data={students}
              keyExtractor={(student) => student.id}
              emptyMessage="No students in this group yet."
            />
          </div>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments">
          <div className="content-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Assignments</h2>
              <Button>Create Assignment</Button>
            </div>
            <DataTable
              columns={assignmentColumns}
              data={assignments}
              keyExtractor={(assignment) => assignment.id}
              emptyMessage="No assignments created yet."
            />
          </div>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <div className="content-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Attendance</h2>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="space-y-3">
              {students.map((student) => {
                const record = todayAttendance?.records.find(r => r.studentId === student.id);
                return (
                  <div 
                    key={student.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{student.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={record?.present === true ? 'default' : 'outline'}
                        size="sm"
                        className="w-24"
                      >
                        Present
                      </Button>
                      <Button
                        variant={record?.present === false ? 'destructive' : 'outline'}
                        size="sm"
                        className="w-24"
                      >
                        Absent
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades">
          <div className="content-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Grades Overview</h2>
            <div className="data-table overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground bg-muted/50">Student</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground bg-muted/50">Assignment Score</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground bg-muted/50">Attendance Score</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground bg-muted/50">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-4 py-3 text-sm border-t border-border">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm border-t border-border">
                        {Math.round(student.totalScore * 0.7)}
                      </td>
                      <td className="px-4 py-3 text-sm border-t border-border">
                        {Math.round(student.attendancePercent * 0.3)}
                      </td>
                      <td className="px-4 py-3 text-sm border-t border-border">
                        <span className={`font-semibold ${student.totalScore >= 80 ? 'text-success' : student.totalScore >= 60 ? 'text-warning' : 'text-destructive'}`}>
                          {student.totalScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

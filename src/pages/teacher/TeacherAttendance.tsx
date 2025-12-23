import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { getGroupsByTeacherId, getStudentsByGroupId, Group, Student } from '@/lib/mockData';

export function TeacherAttendance() {
  const { user } = useAuth();
  const teacherGroups = getGroupsByTeacherId(user?.id || '');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(teacherGroups[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const selectedGroup = teacherGroups.find(g => g.id === selectedGroupId);
  const students = selectedGroup ? getStudentsByGroupId(selectedGroup.id) : [];

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setAttendance(prev => ({ ...prev, [studentId]: present }));
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = Object.values(attendance).filter(v => v === false).length;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Record daily attendance for your groups</p>
      </div>

      {/* Controls */}
      <div className="content-card mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Select Group
            </label>
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {teacherGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-[200px]">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Date
            </label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      {students.length > 0 && (
        <div className="flex gap-4 mb-6">
          <div className="flex-1 content-card text-center">
            <p className="text-3xl font-semibold text-success">{presentCount}</p>
            <p className="text-sm text-muted-foreground">Present</p>
          </div>
          <div className="flex-1 content-card text-center">
            <p className="text-3xl font-semibold text-destructive">{absentCount}</p>
            <p className="text-sm text-muted-foreground">Absent</p>
          </div>
          <div className="flex-1 content-card text-center">
            <p className="text-3xl font-semibold text-muted-foreground">
              {students.length - presentCount - absentCount}
            </p>
            <p className="text-sm text-muted-foreground">Unmarked</p>
          </div>
        </div>
      )}

      {/* Student List */}
      <div className="content-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {selectedGroup?.name || 'Select a group'}
          </h2>
          <Button disabled={students.length === 0}>Save Attendance</Button>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {selectedGroupId ? 'No students in this group' : 'Please select a group'}
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student) => (
              <div 
                key={student.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-foreground">{student.name}</span>
                    <p className="text-sm text-muted-foreground">{student.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={attendance[student.id] === true ? 'default' : 'outline'}
                    size="sm"
                    className="w-24"
                    onClick={() => handleAttendanceChange(student.id, true)}
                  >
                    Present
                  </Button>
                  <Button
                    variant={attendance[student.id] === false ? 'destructive' : 'outline'}
                    size="sm"
                    className="w-24"
                    onClick={() => handleAttendanceChange(student.id, false)}
                  >
                    Absent
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

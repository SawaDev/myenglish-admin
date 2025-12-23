import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { getGroupsByTeacherId, getStudentsByGroupId, Student } from '@/lib/mockData';

export function TeacherGrades() {
  const { user } = useAuth();
  const teacherGroups = getGroupsByTeacherId(user?.id || '');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(teacherGroups[0]?.id || '');

  const selectedGroup = teacherGroups.find(g => g.id === selectedGroupId);
  const students = selectedGroup ? getStudentsByGroupId(selectedGroup.id) : [];

  // Sort students by total score descending
  const sortedStudents = [...students].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Grades</h1>
        <p className="page-subtitle">View student grades and rankings</p>
      </div>

      {/* Controls */}
      <div className="content-card mb-6">
        <div className="flex-1 max-w-xs">
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
      </div>

      {/* Grades Table */}
      <div className="content-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {selectedGroup?.name || 'Select a group'} - Grade Overview
        </h2>

        {students.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {selectedGroupId ? 'No students in this group' : 'Please select a group'}
          </div>
        ) : (
          <div className="data-table overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground bg-muted/50">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground bg-muted/50">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground bg-muted/50">
                    Assignment Score
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground bg-muted/50">
                    Attendance Score
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground bg-muted/50">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td className="px-4 py-3 text-sm border-t border-border">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
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
                      <span className={`font-semibold text-lg ${
                        student.totalScore >= 80 ? 'text-success' : 
                        student.totalScore >= 60 ? 'text-warning' : 
                        'text-destructive'
                      }`}>
                        {student.totalScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

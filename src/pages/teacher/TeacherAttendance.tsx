import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

interface TeacherGroup {
  id: number;
  name: string;
  level: string;
  max_students: number;
  teacher_role: string;
  student_count: number;
}

interface GroupStudent {
  id: number;
  avatar?: string;
  full_name: string;
  phone: string;
  attendance_rate: number;
  total_score: number;
}

export function TeacherAttendance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const selectedGroupIdNum = Number(selectedGroupId);

  // attendanceByKey: key = `${groupId}:${date}` -> { [studentId]: boolean }
  const [attendanceByKey, setAttendanceByKey] = useState<Record<string, Record<number, boolean>>>({});
  const key = selectedGroupId ? `${selectedGroupId}:${selectedDate}` : "";
  const attendanceForSelection = key ? attendanceByKey[key] || {} : {};

  const { data: teacherGroups, isLoading: groupsLoading } = useQuery({
    queryKey: ["teacherGroups"],
    queryFn: async () => {
      const response = await api.get<TeacherGroup[]>("/teacher/groups");
      return response.data;
    },
  });

  // Default to first group once loaded
  useEffect(() => {
    if (selectedGroupId) return;
    const first = teacherGroups?.[0];
    if (first) setSelectedGroupId(first.id.toString());
  }, [teacherGroups, selectedGroupId]);

  const selectedGroup = useMemo(() => {
    if (!teacherGroups || !selectedGroupId) return undefined;
    return teacherGroups.find((g) => g.id.toString() === selectedGroupId);
  }, [teacherGroups, selectedGroupId]);

  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ["teacherGroupStudents", selectedGroupIdNum],
    queryFn: async () => {
      const response = await api.get<GroupStudent[]>(`/teacher/groups/${selectedGroupIdNum}/students`);
      return response.data;
    },
    enabled: Number.isFinite(selectedGroupIdNum) && !!selectedGroupId,
  });

  // Initialize attendance for selection when students load: default everyone present.
  useEffect(() => {
    if (!key) return;
    if (!students || students.length === 0) return;
    setAttendanceByKey((prev) => {
      if (prev[key]) return prev;
      const initial: Record<number, boolean> = {};
      for (const s of students) initial[s.id] = true;
      return { ...prev, [key]: initial };
    });
  }, [key, students]);

  const setStudentPresence = (studentId: number, present: boolean) => {
    if (!key) return;
    setAttendanceByKey((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [studentId]: present,
      },
    }));
  };

  const saveAttendanceMutation = useMutation({
    mutationFn: async (payload: { group_id: number; date: string; attendance: Array<{ student_id: number; is_present: boolean }> }) => {
      const response = await api.post<{ message: string }>("/teacher/attendance", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast({ title: "Success", description: data?.message || "Attendance recorded successfully" });
      // no GET attendance endpoint yet; keep local state as source of truth for now
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to record attendance" });
    },
  });

  const presentCount = useMemo(() => {
    return Object.values(attendanceForSelection).filter(Boolean).length;
  }, [attendanceForSelection]);

  const absentCount = useMemo(() => {
    return Object.values(attendanceForSelection).filter((v) => v === false).length;
  }, [attendanceForSelection]);

  const totalStudents = students?.length ?? 0;
  const unmarkedCount = Math.max(0, totalStudents - presentCount - absentCount);

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
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId} disabled={groupsLoading}>
              <SelectTrigger>
                <SelectValue placeholder={groupsLoading ? "Loading groups..." : "Select a group"} />
              </SelectTrigger>
              <SelectContent>
                {(teacherGroups || []).map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
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
      {totalStudents > 0 && (
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
              {unmarkedCount}
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
          <Button
            disabled={totalStudents === 0 || saveAttendanceMutation.isPending || studentsLoading}
            onClick={() => {
              if (!selectedGroupIdNum || !key || !students || students.length === 0) return;
              const payloadAttendance = students.map((s) => ({
                student_id: s.id,
                is_present: (attendanceForSelection[s.id] ?? true) === true,
              }));
              saveAttendanceMutation.mutate({
                group_id: selectedGroupIdNum,
                date: selectedDate,
                attendance: payloadAttendance,
              });
            }}
          >
            {saveAttendanceMutation.isPending ? "Saving..." : "Save Attendance"}
          </Button>
        </div>

        {studentsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        ) : totalStudents === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {selectedGroupId ? 'No students in this group' : 'Please select a group'}
          </div>
        ) : (
          <div className="space-y-3">
            {(students || []).map((student) => (
              <div 
                key={student.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={student.avatar} alt={student.full_name} />
                    <AvatarFallback>{student.full_name?.charAt(0) ?? "?"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-foreground">{student.full_name}</span>
                    <p className="text-sm text-muted-foreground">{student.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={(attendanceForSelection[student.id] ?? true) === true ? 'default' : 'outline'}
                    size="sm"
                    className="w-24"
                    onClick={() => setStudentPresence(student.id, true)}
                  >
                    Present
                  </Button>
                  <Button
                    variant={(attendanceForSelection[student.id] ?? true) === false ? 'destructive' : 'outline'}
                    size="sm"
                    className="w-24"
                    onClick={() => setStudentPresence(student.id, false)}
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

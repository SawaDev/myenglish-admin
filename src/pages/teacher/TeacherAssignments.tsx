import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

interface TeacherAssignment {
  id: number;
  title: string;
  group_name: string;
  due_date: string; // YYYY-MM-DD
  submission_ratio: string; // "12/20"
  waiting_for_review: number;
  status: string;
}

interface TeacherGroup {
  id: number;
  name: string;
  level: string;
  max_students: number;
  teacher_role: string;
  student_count: number;
}

export function TeacherAssignments() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    content: "",
    due_date: "",
    group_id: "",
  });

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["teacherAssignments"],
    queryFn: async () => {
      const response = await api.get<TeacherAssignment[]>("/teacher/assignments");
      return response.data;
    },
  });

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ["teacherGroups"],
    queryFn: async () => {
      const response = await api.get<TeacherGroup[]>("/teacher/groups");
      return response.data;
    },
    enabled: isCreateOpen,
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (payload: { title: string; content: string; group_id: number; due_date: string }) => {
      await api.post("/teacher/assignments", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherAssignments"] });
      toast({ title: "Success", description: "Assignment created" });
      setIsCreateOpen(false);
      setNewAssignment({ title: "", content: "", due_date: "", group_id: "" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to create assignment" });
    },
  });

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (assignment: TeacherAssignment) => (
        <span className="font-medium text-foreground">{assignment.title}</span>
      ),
    },
    {
      key: 'group_name',
      header: 'Group',
      render: (assignment: TeacherAssignment) => (
        <span className="text-muted-foreground">{assignment.group_name}</span>
      ),
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: (assignment: TeacherAssignment) => (
        <span>{assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "-"}</span>
      ),
    },
    {
      key: 'submission_ratio',
      header: 'Submissions',
      render: (assignment: TeacherAssignment) => <span>{assignment.submission_ratio}</span>,
    },
    {
      key: "waiting_for_review",
      header: "Waiting",
      render: (assignment: TeacherAssignment) => (
        <span className={assignment.waiting_for_review > 0 ? "text-warning font-medium" : "text-muted-foreground"}>
          {assignment.waiting_for_review}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (assignment: TeacherAssignment) => <StatusBadge status={assignment.status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (assignment: TeacherAssignment) => (
        <Link to={`/teacher/assignments/${assignment.id}`}>
          <Button variant="outline" size="sm">Review</Button>
        </Link>
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
      <div className="page-header">
        <h1 className="page-title">Assignments</h1>
        <p className="page-subtitle">Manage and review student assignments</p>
      </div>

      <div className="content-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">All Assignments</h2>
          <Button onClick={() => setIsCreateOpen(true)}>Create Assignment</Button>
        </div>
        <DataTable
          columns={columns}
          data={assignments || []}
          keyExtractor={(assignment) => assignment.id.toString()}
          emptyMessage="No assignments created yet."
        />
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Create Assignment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="group_id">Group</Label>
              <Select
                value={newAssignment.group_id}
                onValueChange={(value) => setNewAssignment((p) => ({ ...p, group_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={groupsLoading ? "Loading groups..." : "Select group"} />
                </SelectTrigger>
                <SelectContent>
                  {(groups || []).map((g) => (
                    <SelectItem key={g.id} value={g.id.toString()}>
                      {g.name}
                    </SelectItem>
                  ))}
                  {!groupsLoading && (groups?.length ?? 0) === 0 && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">No groups found</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Present Simple Homework"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Input
                id="content"
                value={newAssignment.content}
                onChange={(e) => setNewAssignment((p) => ({ ...p, content: e.target.value }))}
                placeholder="Do exercises 1-5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Due date</Label>
              <Input
                id="due_date"
                type="date"
                value={newAssignment.due_date}
                onChange={(e) => setNewAssignment((p) => ({ ...p, due_date: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={createAssignmentMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!newAssignment.group_id || !newAssignment.title || !newAssignment.content || !newAssignment.due_date) {
                    toast({
                      variant: "destructive",
                      title: "Validation Error",
                      description: "Group, title, content and due date are required",
                    });
                    return;
                  }
                  createAssignmentMutation.mutate({
                    title: newAssignment.title,
                    content: newAssignment.content,
                    group_id: Number(newAssignment.group_id),
                    due_date: newAssignment.due_date,
                  });
                }}
                disabled={createAssignmentMutation.isPending}
              >
                {createAssignmentMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
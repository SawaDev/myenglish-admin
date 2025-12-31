import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Download, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

interface TeacherAssignment {
  id: number;
  title: string;
  group_name: string;
  due_date: string;
  submission_ratio: string;
  waiting_for_review: number;
  status: string;
}

interface AssignmentSubmission {
  id: number;
  avatar_url?: string;
  full_name: string;
  submitted_at: string; // ISO
  content: string;
  file_url?: string;
  grade: number | null;
}

export function AssignmentReview() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const assignmentIdNum = Number(assignmentId);
  const [grades, setGrades] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState<Record<number, string>>({});

  const { data: allAssignments, isLoading: assignmentLoading } = useQuery({
    // No dedicated "get assignment by id" endpoint provided, so we reuse the list and find it.
    queryKey: ["teacherAssignments"],
    queryFn: async () => {
      const response = await api.get<TeacherAssignment[]>("/teacher/assignments");
      return response.data;
    },
    enabled: Number.isFinite(assignmentIdNum),
  });

  const assignment = useMemo(() => {
    if (!allAssignments) return null;
    return allAssignments.find((a) => a.id === assignmentIdNum) || null;
  }, [allAssignments, assignmentIdNum]);

  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ["teacherAssignmentSubmissions", assignmentIdNum],
    queryFn: async () => {
      const response = await api.get<AssignmentSubmission[]>(
        `/teacher/assignments/${assignmentIdNum}/submissions`
      );
      return response.data;
    },
    enabled: Number.isFinite(assignmentIdNum),
  });

  const gradeSubmissionMutation = useMutation({
    mutationFn: async (payload: { submissionId: number; grade: number; teacher_feedback: string }) => {
      const response = await api.put<{ message: string }>(
        `/teacher/submissions/${payload.submissionId}/grade`,
        {
          grade: payload.grade,
          teacher_feedback: payload.teacher_feedback,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teacherAssignmentSubmissions", assignmentIdNum] });
      queryClient.invalidateQueries({ queryKey: ["teacherAssignments"] });
      toast({ title: "Success", description: data?.message || "Submission graded successfully" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to grade submission" });
    },
  });

  if (!Number.isFinite(assignmentIdNum)) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Invalid assignment id</p>
        <Link to="/teacher/assignments">
          <Button variant="outline" className="mt-4">Back to Assignments</Button>
        </Link>
      </div>
    );
  }

  if (!assignment) {
    if (assignmentLoading) {
      return (
        <div className="flex items-center justify-center min-h-[500px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Assignment not found</p>
        <Link to="/teacher/assignments">
          <Button variant="outline" className="mt-4">Back to Assignments</Button>
        </Link>
      </div>
    );
  }

  const handleGradeChange = (submissionId: number, grade: number) => {
    setGrades((prev) => ({ ...prev, [submissionId]: grade }));
  };

  const handleFeedbackChange = (submissionId: number, value: string) => {
    setFeedback((prev) => ({ ...prev, [submissionId]: value }));
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/teacher/assignments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="page-title">{assignment.title}</h1>
          <p className="page-subtitle">
            Group: {assignment.group_name} • Due:{" "}
            {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "-"}
          </p>
        </div>
      </div>

      {/* Submissions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Student Submissions</h2>

        {submissionsLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        ) : (submissions?.length ?? 0) === 0 ? (
          <div className="content-card text-center py-12">
            <p className="text-muted-foreground">No submissions yet</p>
          </div>
        ) : (
          (submissions || []).map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              grade={grades[submission.id] ?? submission.grade ?? undefined}
              feedback={feedback[submission.id] ?? ""}
              isSaving={gradeSubmissionMutation.isPending}
              onGradeChange={(grade) => handleGradeChange(submission.id, grade)}
              onFeedbackChange={(v) => handleFeedbackChange(submission.id, v)}
              onSubmit={() => {
                const gradeValue = grades[submission.id] ?? submission.grade;
                if (gradeValue === null || gradeValue === undefined || Number.isNaN(gradeValue)) {
                  toast({
                    variant: "destructive",
                    title: "Validation Error",
                    description: "Please enter a grade (0-100)",
                  });
                  return;
                }
                gradeSubmissionMutation.mutate({
                  submissionId: submission.id,
                  grade: Number(gradeValue),
                  teacher_feedback: feedback[submission.id] ?? "",
                });
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface SubmissionCardProps {
  submission: AssignmentSubmission;
  grade?: number;
  onGradeChange: (grade: number) => void;
  feedback: string;
  onFeedbackChange: (value: string) => void;
  onSubmit: () => void;
  isSaving: boolean;
}

function SubmissionCard({ submission, grade, onGradeChange, feedback, onFeedbackChange, onSubmit, isSaving }: SubmissionCardProps) {
  return (
    <div className="content-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={submission.avatar_url} alt={submission.full_name} />
            <AvatarFallback>{submission.full_name?.charAt(0) ?? "?"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{submission.full_name}</p>
            <p className="text-sm text-muted-foreground">
              Submitted: {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : "-"}
            </p>
          </div>
        </div>
        <StatusBadge status={submission.grade === null ? "pending" : "graded"} />
      </div>

      {/* Content */}
      <div className="bg-muted/50 rounded-lg p-4 mb-4">
        <p className="text-foreground">{submission.content}</p>
      </div>

      {/* Attachments */}
      {(submission.file_url) && (
        <div className="flex gap-3 mb-4">
          <Button asChild variant="outline" className="gap-2">
            <a href={submission.file_url} target="_blank" rel="noreferrer">
              <Download className="w-4 h-4" />
              Download File
            </a>
          </Button>
        </div>
      )}

      {/* Grade Input */}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Grade:</label>
          <Input
            type="number"
            min={0}
            max={100}
            value={grade ?? ''}
            onChange={(e) => onGradeChange(Number(e.target.value))}
            className="w-20"
            placeholder="0-100"
            disabled={isSaving}
          />
        </div>
        <div className="flex-1" />
        <Input
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
          placeholder="Teacher feedback (optional)"
          disabled={isSaving}
        />
        <Button size="sm" onClick={onSubmit} disabled={isSaving}>
          {isSaving ? "Saving..." : (submission.grade === null ? "Submit Grade" : "Update Grade")}
        </Button>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { assignments, getStudentById, Submission } from '@/lib/mockData';

export function AssignmentReview() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const assignment = assignments.find(a => a.id === assignmentId);
  const [grades, setGrades] = useState<Record<string, number>>({});

  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Assignment not found</p>
        <Link to="/teacher/assignments">
          <Button variant="outline" className="mt-4">Back to Assignments</Button>
        </Link>
      </div>
    );
  }

  const handleGradeChange = (submissionId: string, grade: number) => {
    setGrades(prev => ({ ...prev, [submissionId]: grade }));
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/teacher/groups/${assignment.groupId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="page-title">{assignment.title}</h1>
          <p className="page-subtitle">
            Due: {new Date(assignment.dueDate).toLocaleDateString()} • 
            {assignment.submissions.length} submissions
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="content-card mb-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-2">Description</h2>
        <p className="text-foreground">{assignment.description}</p>
      </div>

      {/* Submissions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Student Submissions</h2>
        
        {assignment.submissions.length === 0 ? (
          <div className="content-card text-center py-12">
            <p className="text-muted-foreground">No submissions yet</p>
          </div>
        ) : (
          assignment.submissions.map((submission) => {
            const student = getStudentById(submission.studentId);
            return (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                student={student}
                grade={grades[submission.id] ?? submission.grade}
                onGradeChange={(grade) => handleGradeChange(submission.id, grade)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

interface SubmissionCardProps {
  submission: Submission;
  student: ReturnType<typeof getStudentById>;
  grade?: number;
  onGradeChange: (grade: number) => void;
}

function SubmissionCard({ submission, student, grade, onGradeChange }: SubmissionCardProps) {
  return (
    <div className="content-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={student?.avatar} alt={student?.name} />
            <AvatarFallback>{student?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{student?.name}</p>
            <p className="text-sm text-muted-foreground">
              Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <StatusBadge status={submission.status} />
      </div>

      {/* Content */}
      <div className="bg-muted/50 rounded-lg p-4 mb-4">
        <p className="text-foreground">{submission.content}</p>
      </div>

      {/* Attachments */}
      {(submission.imageUrl || submission.fileUrl) && (
        <div className="flex gap-3 mb-4">
          {submission.imageUrl && (
            <div className="relative group">
              <img 
                src={submission.imageUrl} 
                alt="Submission attachment" 
                className="w-32 h-24 object-cover rounded-lg border border-border"
              />
              <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-background" />
              </div>
            </div>
          )}
          {submission.fileUrl && (
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download File
            </Button>
          )}
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
          />
        </div>
        <Button size="sm">
          {submission.status === 'Graded' ? 'Update Grade' : 'Submit Grade'}
        </Button>
      </div>
    </div>
  );
}

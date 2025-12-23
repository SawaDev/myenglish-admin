import { Link } from 'react-router-dom';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getGroupsByTeacherId, getAssignmentsByGroupId, Assignment, getGroupById } from '@/lib/mockData';

export function TeacherAssignments() {
  const { user } = useAuth();
  const teacherGroups = getGroupsByTeacherId(user?.id || '');
  
  const allAssignments = teacherGroups.flatMap(group => 
    getAssignmentsByGroupId(group.id).map(a => ({
      ...a,
      groupName: group.name,
    }))
  );

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (assignment: Assignment & { groupName: string }) => (
        <span className="font-medium text-foreground">{assignment.title}</span>
      ),
    },
    {
      key: 'groupName',
      header: 'Group',
      render: (assignment: Assignment & { groupName: string }) => (
        <span className="text-muted-foreground">{assignment.groupName}</span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (assignment: Assignment & { groupName: string }) => (
        <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'submissions',
      header: 'Submissions',
      render: (assignment: Assignment & { groupName: string }) => {
        const group = getGroupById(assignment.groupId);
        return (
          <span>{assignment.submissions.length}/{group?.studentIds.length || 0}</span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (assignment: Assignment & { groupName: string }) => {
        const pending = assignment.submissions.filter(s => s.status === 'Submitted').length;
        return pending > 0 ? (
          <div className="flex items-center gap-2">
            <StatusBadge status="pending" />
            <span className="text-xs text-muted-foreground">({pending} pending)</span>
          </div>
        ) : (
          <StatusBadge status="active" />
        );
      },
    },
    {
      key: 'actions',
      header: '',
      render: (assignment: Assignment & { groupName: string }) => (
        <Link to={`/teacher/assignments/${assignment.id}`}>
          <Button variant="outline" size="sm">Review</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Assignments</h1>
        <p className="page-subtitle">Manage and review student assignments</p>
      </div>

      <div className="content-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">All Assignments</h2>
          <Button>Create Assignment</Button>
        </div>
        <DataTable
          columns={columns}
          data={allAssignments}
          keyExtractor={(assignment) => assignment.id}
          emptyMessage="No assignments created yet."
        />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Pencil, Eye } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { LevelBadge } from '@/components/ui/level-badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { groups, teachers, getTeacherById, Group, Level } from '@/lib/mockData';

export function AdminGroups() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const columns = [
    {
      key: 'name',
      header: 'Group Name',
      render: (group: Group) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <span className="font-medium text-foreground">{group.name}</span>
        </div>
      ),
    },
    {
      key: 'level',
      header: 'Level',
      render: (group: Group) => <LevelBadge level={group.level} />,
    },
    {
      key: 'students',
      header: 'Students',
      render: (group: Group) => (
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                group.studentIds.length >= group.maxStudents * 0.9 
                  ? 'bg-destructive' 
                  : group.studentIds.length >= group.maxStudents * 0.7 
                    ? 'bg-warning' 
                    : 'bg-success'
              }`}
              style={{ width: `${(group.studentIds.length / group.maxStudents) * 100}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {group.studentIds.length}/{group.maxStudents}
          </span>
        </div>
      ),
    },
    {
      key: 'mainTeacher',
      header: 'Main Teacher',
      render: (group: Group) => {
        const teacher = getTeacherById(group.mainTeacherId);
        return <span>{teacher?.name || '-'}</span>;
      },
    },
    {
      key: 'assistantTeacher',
      header: 'Assistant',
      render: (group: Group) => {
        const teacher = group.assistantTeacherId ? getTeacherById(group.assistantTeacherId) : null;
        return <span className="text-muted-foreground">{teacher?.name || '-'}</span>;
      },
    },
    {
      key: 'actions',
      header: '',
      render: (group: Group) => (
        <div className="flex gap-2">
          <Link to={`/admin/groups/${group.id}`}>
            <Button variant="outline" size="sm" className="gap-1">
              <Eye className="w-4 h-4" />
              View
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="gap-1">
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Groups Management</h1>
          <p className="page-subtitle">Create and manage study groups</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input id="name" placeholder="e.g., Morning Beginners A" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Elementary">Elementary</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Upper-Intermediate">Upper-Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainTeacher">Main Teacher</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.filter(t => t.role === 'main').map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assistantTeacher">Assistant Teacher (Optional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assistant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {teachers.filter(t => t.role === 'assistant').map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateOpen(false)}>
                  Create Group
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="content-card">
        <DataTable
          columns={columns}
          data={groups}
          keyExtractor={(group) => group.id}
          emptyMessage="No groups created yet."
        />
      </div>
    </div>
  );
}

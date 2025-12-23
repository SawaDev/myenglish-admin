import { useState } from 'react';
import { Plus, Key, Pencil, Users } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { RoleBadge } from '@/components/ui/role-badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { teachers, groups, Teacher, TeacherRole } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

export function AdminTeachers() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<TeacherRole>('main');

  const handleCreateTeacher = () => {
    toast({
      title: "Teacher Created",
      description: "Login credentials have been generated and sent.",
    });
    setIsCreateOpen(false);
  };

  const columns = [
    {
      key: 'avatar',
      header: '',
      render: (teacher: Teacher) => (
        <Avatar className="w-10 h-10">
          <AvatarImage src={teacher.avatar} alt={teacher.name} />
          <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
      className: 'w-14',
    },
    {
      key: 'name',
      header: 'Name',
      render: (teacher: Teacher) => (
        <div>
          <span className="font-medium text-foreground">{teacher.name}</span>
          <p className="text-sm text-muted-foreground">{teacher.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'role',
      header: 'Role',
      render: (teacher: Teacher) => <RoleBadge role={teacher.role} />,
    },
    {
      key: 'groups',
      header: 'Assigned Groups',
      render: (teacher: Teacher) => {
        const teacherGroups = groups.filter(
          g => g.mainTeacherId === teacher.id || g.assistantTeacherId === teacher.id
        );
        return (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{teacherGroups.length} group{teacherGroups.length !== 1 ? 's' : ''}</span>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (teacher: Teacher) => (
        <span className="text-muted-foreground">
          {new Date(teacher.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (teacher: Teacher) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Key className="w-4 h-4" />
            Reset Password
          </Button>
          <Button variant="ghost" size="sm">
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Teachers Management</h1>
          <p className="page-subtitle">Create and manage teacher accounts</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Teacher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Teacher</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.smith@lms.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 234 567 8900" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as TeacherRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Teacher</SelectItem>
                    <SelectItem value="assistant">Assistant Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assign to Groups (Optional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select groups" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Login credentials will be auto-generated and can be shared with the teacher.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTeacher}>
                  Create & Generate Login
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="content-card">
          <p className="text-sm text-muted-foreground">Total Teachers</p>
          <p className="text-3xl font-semibold text-foreground mt-1">{teachers.length}</p>
        </div>
        <div className="content-card">
          <p className="text-sm text-muted-foreground">Main Teachers</p>
          <p className="text-3xl font-semibold text-primary mt-1">
            {teachers.filter(t => t.role === 'main').length}
          </p>
        </div>
        <div className="content-card">
          <p className="text-sm text-muted-foreground">Assistants</p>
          <p className="text-3xl font-semibold text-muted-foreground mt-1">
            {teachers.filter(t => t.role === 'assistant').length}
          </p>
        </div>
      </div>

      <div className="content-card">
        <DataTable
          columns={columns}
          data={teachers}
          keyExtractor={(teacher) => teacher.id}
          emptyMessage="No teachers created yet."
        />
      </div>
    </div>
  );
}

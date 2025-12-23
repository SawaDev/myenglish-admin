import { useState } from 'react';
import { UserPlus, Check } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getNewStudents, groups, Student, Group } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

export function AdminNewStudents() {
  const newStudents = getNewStudents();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const availableGroups = groups.filter(g => g.studentIds.length < g.maxStudents);

  const handleActivate = () => {
    if (!selectedStudent || !selectedGroupId) return;
    
    toast({
      title: "Student Activated",
      description: `${selectedStudent.name} has been added to the group.`,
    });
    setIsDialogOpen(false);
    setSelectedStudent(null);
    setSelectedGroupId('');
  };

  const columns = [
    {
      key: 'avatar',
      header: '',
      render: (student: Student) => (
        <Avatar className="w-10 h-10">
          <AvatarImage src={student.avatar} alt={student.name} />
          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
      className: 'w-14',
    },
    {
      key: 'name',
      header: 'Full Name',
      render: (student: Student) => (
        <div>
          <span className="font-medium text-foreground">{student.name}</span>
          <p className="text-sm text-muted-foreground">{student.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'registrationDate',
      header: 'Registration Date',
      render: (student: Student) => (
        <span>{new Date(student.registrationDate).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: () => <StatusBadge status="NEW_STUDENT" />,
    },
    {
      key: 'actions',
      header: '',
      render: (student: Student) => (
        <Dialog open={isDialogOpen && selectedStudent?.id === student.id} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (open) setSelectedStudent(student);
          else {
            setSelectedStudent(null);
            setSelectedGroupId('');
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" />
              Activate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Activate Student</DialogTitle>
            </DialogHeader>
            <div className="pt-4">
              <div className="flex items-center gap-3 mb-6 p-4 bg-muted/50 rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.phone}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Select Group
                  </label>
                  <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a group" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableGroups.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No groups with available spots
                        </div>
                      ) : (
                        availableGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{group.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({group.studentIds.length}/{group.maxStudents})
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-sm text-muted-foreground">
                  The student will be activated and a teacher will be auto-assigned based on the selected group.
                </p>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleActivate}
                    disabled={!selectedGroupId}
                    className="gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Activate Student
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">New Students</h1>
        <p className="page-subtitle">Review and activate new student registrations</p>
      </div>

      {/* Info Banner */}
      {newStudents.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {newStudents.length} student{newStudents.length !== 1 ? 's' : ''} waiting for activation
            </h3>
            <p className="text-sm text-muted-foreground">
              Assign them to a group to activate their accounts
            </p>
          </div>
        </div>
      )}

      <div className="content-card">
        <DataTable
          columns={columns}
          data={newStudents}
          keyExtractor={(student) => student.id}
          emptyMessage="No new students waiting for activation"
        />
      </div>
    </div>
  );
}

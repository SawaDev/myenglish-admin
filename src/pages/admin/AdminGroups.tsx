import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Plus, Pencil, Eye, Loader2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";

interface GroupListItem {
  id: number;
  name: string;
  main_teacher: string;
  assistant_teacher: string;
  student_count: string;
}

interface Teacher {
  id: number;
  full_name: string;
}

interface TeacherResponse {
  teachers: Teacher[];
  assistants: Teacher[];
}

interface CreateGroupData {
  name: string;
  level: string;
  main_teacher_id: string;
  assistant_teacher_id?: string;
}

export function AdminGroups() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGroup, setNewGroup] = useState<CreateGroupData>({
    name: "",
    level: "",
    main_teacher_id: "",
    assistant_teacher_id: "",
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ["adminGroups"],
    queryFn: async () => {
      const response = await api.get<GroupListItem[]>("/admin/groups");
      return response.data;
    },
  });

  const { data: teachersData } = useQuery({
    queryKey: ["adminTeachers"],
    queryFn: async () => {
      const response = await api.get<TeacherResponse>(
        "/admin/teacher-and-assistants"
      );
      return response.data;
    },
    enabled: isCreateOpen, // Only fetch when dialog is open
  });

  const createGroupMutation = useMutation({
    mutationFn: async (data: CreateGroupData) => {
      await api.post("/admin/groups", {
        ...data,
        main_teacher_id: Number(data.main_teacher_id),
        assistant_teacher_id: data.assistant_teacher_id
          ? Number(data.assistant_teacher_id)
          : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminGroups"] });
      setIsCreateOpen(false);
      setNewGroup({
        name: "",
        level: "",
        main_teacher_id: "",
        assistant_teacher_id: "",
      });
      toast({
        title: "Success",
        description: "Group created successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create group",
      });
    },
  });

  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.level || !newGroup.main_teacher_id) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields",
      });
      return;
    }
    createGroupMutation.mutate(newGroup);
  };

  const columns = [
    {
      key: "name",
      header: "Group Name",
      render: (group: GroupListItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <span className="font-medium text-foreground">{group.name}</span>
        </div>
      ),
    },
    {
      key: "students",
      header: "Students",
      render: (group: GroupListItem) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{group.student_count}</span>
        </div>
      ),
    },
    {
      key: "main_teacher",
      header: "Main Teacher",
      render: (group: GroupListItem) => (
        <span>{group.main_teacher || "-"}</span>
      ),
    },
    {
      key: "assistant_teacher",
      header: "Assistant",
      render: (group: GroupListItem) => (
        <span className="text-muted-foreground">
          {group.assistant_teacher || "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (group: GroupListItem) => (
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

  if (groupsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                <Input
                  id="name"
                  placeholder="e.g., Morning Beginners A"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={newGroup.level}
                  onValueChange={(value) =>
                    setNewGroup({ ...newGroup, level: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Elementary">Elementary</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Upper-Intermediate">
                      Upper-Intermediate
                    </SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainTeacher">Main Teacher</Label>
                <Select
                  value={newGroup.main_teacher_id}
                  onValueChange={(value) =>
                    setNewGroup({ ...newGroup, main_teacher_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachersData?.teachers.map((teacher) => (
                      <SelectItem
                        key={teacher.id}
                        value={teacher.id.toString()}
                      >
                        {teacher.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assistantTeacher">
                  Assistant Teacher (Optional)
                </Label>
                <Select
                  value={newGroup.assistant_teacher_id}
                  onValueChange={(value) =>
                    setNewGroup({
                      ...newGroup,
                      assistant_teacher_id: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assistant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {teachersData?.assistants.map((teacher) => (
                      <SelectItem
                        key={teacher.id}
                        value={teacher.id.toString()}
                      >
                        {teacher.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateGroup}
                  disabled={createGroupMutation.isPending}
                >
                  {createGroupMutation.isPending
                    ? "Creating..."
                    : "Create Group"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="content-card">
        <DataTable
          columns={columns}
          data={groups || []}
          keyExtractor={(group) => group.id.toString()}
          emptyMessage="No groups created yet."
        />
      </div>
    </div>
  );
}

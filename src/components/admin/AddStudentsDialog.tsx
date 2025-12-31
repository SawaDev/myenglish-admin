import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";

function getApiErrorMessage(err: unknown, fallback: string) {
  const anyErr = err as any;
  return (
    anyErr?.response?.data?.message ||
    anyErr?.response?.data?.error ||
    anyErr?.message ||
    fallback
  );
}

interface NewStudent {
  id: number;
  full_name: string;
  phone: string;
  status: string;
  created_at: string;
  avatar?: string;
}

interface NewStudentsResponse {
  new_students: NewStudent[];
  students_without_group: NewStudent[];
}

interface AddStudentsDialogProps {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AddStudentsDialog({
  groupId,
  isOpen,
  onClose,
}: AddStudentsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectionError, setSelectionError] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const numericGroupId = Number(groupId);
  const isGroupIdValid = Number.isFinite(numericGroupId) && numericGroupId > 0;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["newStudents"],
    queryFn: async () => {
      const response = await api.get<NewStudentsResponse>("/admin/new-students");
      return response.data;
    },
    enabled: isOpen,
  });

  const allAvailableStudents = useMemo(() => {
    if (!data) return [];
    return [...data.new_students, ...data.students_without_group];
  }, [data]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return allAvailableStudents;

    const qLower = q.toLowerCase();
    return allAvailableStudents.filter((student) => {
      const name = (student.full_name ?? "").toString().toLowerCase();
      const phone = (student.phone ?? "").toString();
      return name.includes(qLower) || phone.includes(q);
    });
  }, [allAvailableStudents, searchQuery]);

  const addStudentsMutation = useMutation({
    mutationFn: async (studentIds: number[]) => {
      await api.post("/admin/groups/add-students", {
        group_id: numericGroupId,
        student_ids: studentIds,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminGroupDetail", groupId] });
      queryClient.invalidateQueries({ queryKey: ["newStudents"] }); // Refresh available students
      toast({
        title: "Success",
        description: "Students added to group successfully",
      });
      handleClose();
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: getApiErrorMessage(err, "Failed to add students to group"),
      });
    },
  });

  const isSubmitting = addStudentsMutation.isPending;

  const handleToggleStudent = (studentId: number) => {
    setSelectionError("");
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAddStudents = () => {
    if (!isGroupIdValid) {
      setSelectionError("Invalid group id. Please refresh and try again.");
      return;
    }
    const uniqueIds = Array.from(new Set(selectedStudents));
    if (uniqueIds.length === 0) {
      setSelectionError("Select at least 1 student.");
      return;
    }
    // Basic safety to avoid sending huge payloads accidentally.
    if (uniqueIds.length > 100) {
      setSelectionError("You can add up to 100 students at a time.");
      return;
    }
    addStudentsMutation.mutate(selectedStudents);
  };

  const handleClose = () => {
    setSelectionError("");
    setSelectedStudents([]);
    setSearchQuery("");
    onClose();
  };

  const handleRequestClose = () => {
    if (isSubmitting) return;
    handleClose();
  };

  const handleSelectAllFiltered = () => {
    setSelectionError("");
    const ids = filteredStudents.map((s) => s.id);
    const next = Array.from(new Set([...selectedStudents, ...ids]));
    if (next.length > 100) {
      setSelectionError("You can add up to 100 students at a time.");
      return;
    }
    setSelectedStudents(next);
  };

  const handleClearSelection = () => {
    setSelectionError("");
    setSelectedStudents([]);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleRequestClose();
      }}
    >
      <DialogContent
        className="sm:max-w-[500px]"
        onEscapeKeyDown={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Add Students to Group</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {!isGroupIdValid && (
            <div className="mb-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Invalid group id. Please refresh the page and try again.
            </div>
          )}

          <div className="border rounded-md">
            <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Available Students</span>
                <span className="text-xs text-muted-foreground">
                  {filteredStudents.length} shown • {allAvailableStudents.length} total
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {selectedStudents.length} selected
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleClearSelection}
                  disabled={selectedStudents.length === 0 || isSubmitting}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleSelectAllFiltered}
                  disabled={filteredStudents.length === 0 || isSubmitting}
                >
                  Select all
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : isError ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                  <p className="text-sm text-destructive">
                    {getApiErrorMessage(error, "Failed to load students")}
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                    Retry
                  </Button>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  No students found
                </div>
              ) : (
                <div className="divide-y">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleToggleStudent(student.id)}
                    >
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => handleToggleStudent(student.id)}
                        onClick={(e) => e.stopPropagation()}
                        disabled={isSubmitting}
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.full_name?.charAt(0) ?? "?"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {student.full_name || "-"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {(student.phone || "-")} • {(student.status || "-")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {selectionError && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {selectionError}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleRequestClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddStudents} 
            disabled={
              !isGroupIdValid ||
              selectedStudents.length === 0 ||
              isSubmitting
            }
          >
            {isSubmitting ? "Adding..." : `Add ${selectedStudents.length} Students`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  GraduationCap,
  BookOpen,
  UserX,
  Plus,
  UserPlus,
  Eye,
  Loader2,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/axios";

interface AdminStats {
  total_students: number;
  student_growth_rate: number;
  active_groups: number;
  total_teachers: number;
  blocked_users: number;
}

interface NewStudent {
  id: number;
  full_name: string;
  phone: string;
  status: string;
  created_at: string;
  avatar?: string;
}

export function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const response = await api.get<AdminStats>("/admin/stats");
      return response.data;
    },
  });

  const { data: newStudents, isLoading: studentsLoading } = useQuery({
    queryKey: ["newStudents"],
    queryFn: async () => {
      const response = await api.get<NewStudent[]>("/admin/new-students");
      return response.data;
    },
  });

  const newStudentColumns = [
    {
      key: "avatar",
      header: "",
      render: (student: NewStudent) => (
        <Avatar className="w-8 h-8">
          <AvatarImage src={student.avatar} alt={student.full_name} />
          <AvatarFallback>{student.full_name.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
      className: "w-12",
    },
    {
      key: "full_name",
      header: "Name",
      render: (student: NewStudent) => (
        <span className="font-medium text-foreground">{student.full_name}</span>
      ),
    },
    {
      key: "phone",
      header: "Phone",
    },
    {
      key: "created_at",
      header: "Registered",
      render: (student: NewStudent) => (
        <span>{new Date(student.created_at).toLocaleDateString()}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: () => <StatusBadge status="NEW_STUDENT" />,
    },
  ];

  if (statsLoading || studentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of your LMS platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Students"
          value={stats?.total_students || 0}
          icon={GraduationCap}
          trend={{
            value: stats?.student_growth_rate || 0,
            positive: (stats?.student_growth_rate || 0) >= 0,
          }}
        />
        <StatCard
          title="Active Groups"
          value={stats?.active_groups || 0}
          icon={Users}
        />
        <StatCard
          title="Teachers"
          value={stats?.total_teachers || 0}
          icon={BookOpen}
        />
        <StatCard
          title="Blocked/Expired"
          value={stats?.blocked_users || 0}
          icon={UserX}
          iconClassName="bg-destructive/10"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          to="/admin/groups"
          className="content-card hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Create Group</h3>
              <p className="text-sm text-muted-foreground">
                Add a new study group
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/teachers"
          className="content-card hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Assign Teacher</h3>
              <p className="text-sm text-muted-foreground">
                Manage teacher assignments
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/new-students"
          className="content-card hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
              <UserPlus className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">New Students</h3>
              <p className="text-sm text-muted-foreground">
                {newStudents?.length || 0} waiting for activation
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* New Students Table */}
      <div className="content-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Registrations
            {newStudents && newStudents.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                {newStudents.length} new
              </span>
            )}
          </h2>
          <Link to="/admin/new-students">
            <Button variant="ghost" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              View All
            </Button>
          </Link>
        </div>
        <DataTable
          columns={newStudentColumns}
          data={newStudents?.slice(0, 5) || []}
          keyExtractor={(student) => student.id.toString()}
          emptyMessage="No new registrations"
        />
      </div>
    </div>
  );
}

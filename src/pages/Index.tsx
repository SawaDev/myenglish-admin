import { Link, Navigate } from "react-router-dom";
import { GraduationCap, Users, BookOpen, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthStore } from "@/stores/authStore";

const Index = () => {
  const { user } = useAuthStore();

  if (user) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/teacher"} replace />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl text-foreground">
              LMS Admin
            </span>
          </div>
          <div className="flex gap-3">
            {!user && (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            English Learning Platform
            <span className="block text-primary mt-2">Admin Panel</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Manage your online paid LMS with role-based access for teachers and
            administrators
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="content-card text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Group Management
            </h3>
            <p className="text-sm text-muted-foreground">
              Create and manage study groups with up to 20 students each
            </p>
          </div>
          <div className="content-card text-center">
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-success" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Teacher Roles
            </h3>
            <p className="text-sm text-muted-foreground">
              Assign main teachers and assistants to each group
            </p>
          </div>
          <div className="content-card text-center">
            <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-warning" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Payment Tracking
            </h3>
            <p className="text-sm text-muted-foreground">
              Monitor payment periods and auto-block expired accounts
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

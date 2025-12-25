import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Teacher Pages
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { TeacherGroups } from "./pages/teacher/TeacherGroups";
import { GroupDetail } from "./pages/teacher/GroupDetail";
import { TeacherAssignments } from "./pages/teacher/TeacherAssignments";
import { AssignmentReview } from "./pages/teacher/AssignmentReview";
import { TeacherAttendance } from "./pages/teacher/TeacherAttendance";
import { TeacherGrades } from "./pages/teacher/TeacherGrades";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminGroups } from "./pages/admin/AdminGroups";
import { AdminGroupDetail } from "./pages/admin/AdminGroupDetail";
import { AdminNewStudents } from "./pages/admin/AdminNewStudents";
import { AdminStudents } from "./pages/admin/AdminStudents";
import { AdminTeachers } from "./pages/admin/AdminTeachers";
import { AdminPayments } from "./pages/admin/AdminPayments";
import { AdminSettings } from "./pages/admin/AdminSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            {/* Teacher Routes */}
            <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
              <Route path="/teacher" element={<DashboardLayout />}>
                <Route index element={<TeacherDashboard />} />
                <Route path="groups" element={<TeacherGroups />} />
                <Route path="groups/:groupId" element={<GroupDetail />} />
                <Route path="assignments" element={<TeacherAssignments />} />
                <Route
                  path="assignments/:assignmentId"
                  element={<AssignmentReview />}
                />
                <Route path="attendance" element={<TeacherAttendance />} />
                <Route path="grades" element={<TeacherGrades />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="groups" element={<AdminGroups />} />
                <Route path="groups/:groupId" element={<AdminGroupDetail />} />
                <Route path="new-students" element={<AdminNewStudents />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="teachers" element={<AdminTeachers />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

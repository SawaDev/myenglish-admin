// Mock data for the LMS Admin Panel

export type UserRole = 'Teacher' | 'Admin';
export type TeacherRole = 'main' | 'assistant';
export type StudentStatus = 'NEW_STUDENT' | 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
export type Level = 'Beginner' | 'Elementary' | 'Intermediate' | 'Upper-Intermediate' | 'Advanced';
export type AssignmentStatus = 'Submitted' | 'Graded' | 'Pending';
export type PaymentStatus = 'Active' | 'Expired';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: TeacherRole;
  groupIds: string[];
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  status: StudentStatus;
  groupId: string | null;
  attendancePercent: number;
  totalScore: number;
  registrationDate: string;
  paymentStartDate: string | null;
  paymentEndDate: string | null;
}

export interface Group {
  id: string;
  name: string;
  level: Level;
  maxStudents: number;
  mainTeacherId: string;
  assistantTeacherId: string | null;
  studentIds: string[];
}

export interface Assignment {
  id: string;
  groupId: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  submissions: Submission[];
}

export interface Submission {
  id: string;
  studentId: string;
  assignmentId: string;
  content: string;
  fileUrl?: string;
  imageUrl?: string;
  status: AssignmentStatus;
  grade?: number;
  submittedAt: string;
}

export interface AttendanceRecord {
  id: string;
  groupId: string;
  date: string;
  records: { studentId: string; present: boolean }[];
}
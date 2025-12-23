// Mock data for the LMS Admin Panel

export type UserRole = 'teacher' | 'admin';
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

// Mock Teachers
export const teachers: Teacher[] = [
  {
    id: 't1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@lms.com',
    phone: '+1 234 567 8901',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    role: 'main',
    groupIds: ['g1', 'g2'],
    createdAt: '2024-01-15',
  },
  {
    id: 't2',
    name: 'Michael Chen',
    email: 'michael.chen@lms.com',
    phone: '+1 234 567 8902',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    role: 'assistant',
    groupIds: ['g1'],
    createdAt: '2024-02-20',
  },
  {
    id: 't3',
    name: 'Emily Davis',
    email: 'emily.davis@lms.com',
    phone: '+1 234 567 8903',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    role: 'main',
    groupIds: ['g3'],
    createdAt: '2024-03-10',
  },
];

// Mock Groups
export const groups: Group[] = [
  {
    id: 'g1',
    name: 'Morning Beginners A',
    level: 'Beginner',
    maxStudents: 20,
    mainTeacherId: 't1',
    assistantTeacherId: 't2',
    studentIds: ['s1', 's2', 's3', 's4', 's5'],
  },
  {
    id: 'g2',
    name: 'Afternoon Intermediate',
    level: 'Intermediate',
    maxStudents: 20,
    mainTeacherId: 't1',
    assistantTeacherId: null,
    studentIds: ['s6', 's7', 's8'],
  },
  {
    id: 'g3',
    name: 'Evening Elementary',
    level: 'Elementary',
    maxStudents: 20,
    mainTeacherId: 't3',
    assistantTeacherId: null,
    studentIds: ['s9', 's10'],
  },
];

// Mock Students
export const students: Student[] = [
  {
    id: 's1',
    name: 'Alex Thompson',
    phone: '+1 555 0101',
    email: 'alex.t@email.com',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
    status: 'ACTIVE',
    groupId: 'g1',
    attendancePercent: 92,
    totalScore: 87,
    registrationDate: '2024-09-01',
    paymentStartDate: '2024-12-01',
    paymentEndDate: '2025-01-01',
  },
  {
    id: 's2',
    name: 'Jessica Wang',
    phone: '+1 555 0102',
    email: 'jessica.w@email.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    status: 'ACTIVE',
    groupId: 'g1',
    attendancePercent: 88,
    totalScore: 91,
    registrationDate: '2024-09-05',
    paymentStartDate: '2024-12-01',
    paymentEndDate: '2025-02-01',
  },
  {
    id: 's3',
    name: 'Daniel Kim',
    phone: '+1 555 0103',
    email: 'daniel.k@email.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    status: 'EXPIRED',
    groupId: 'g1',
    attendancePercent: 75,
    totalScore: 68,
    registrationDate: '2024-08-15',
    paymentStartDate: '2024-11-01',
    paymentEndDate: '2024-12-01',
  },
  {
    id: 's4',
    name: 'Maria Garcia',
    phone: '+1 555 0104',
    email: 'maria.g@email.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    status: 'ACTIVE',
    groupId: 'g1',
    attendancePercent: 95,
    totalScore: 94,
    registrationDate: '2024-09-10',
    paymentStartDate: '2024-12-01',
    paymentEndDate: '2025-03-01',
  },
  {
    id: 's5',
    name: 'James Wilson',
    phone: '+1 555 0105',
    email: 'james.w@email.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    status: 'ACTIVE',
    groupId: 'g1',
    attendancePercent: 82,
    totalScore: 79,
    registrationDate: '2024-09-20',
    paymentStartDate: '2024-12-15',
    paymentEndDate: '2025-01-15',
  },
  {
    id: 's6',
    name: 'Sophie Brown',
    phone: '+1 555 0106',
    email: 'sophie.b@email.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    status: 'ACTIVE',
    groupId: 'g2',
    attendancePercent: 90,
    totalScore: 85,
    registrationDate: '2024-10-01',
    paymentStartDate: '2024-12-01',
    paymentEndDate: '2025-02-01',
  },
  {
    id: 's7',
    name: 'Ryan Martinez',
    phone: '+1 555 0107',
    email: 'ryan.m@email.com',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop',
    status: 'BLOCKED',
    groupId: 'g2',
    attendancePercent: 45,
    totalScore: 52,
    registrationDate: '2024-10-05',
    paymentStartDate: '2024-11-01',
    paymentEndDate: '2024-12-01',
  },
  {
    id: 's8',
    name: 'Emma Lee',
    phone: '+1 555 0108',
    email: 'emma.l@email.com',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop',
    status: 'ACTIVE',
    groupId: 'g2',
    attendancePercent: 97,
    totalScore: 96,
    registrationDate: '2024-10-10',
    paymentStartDate: '2024-12-01',
    paymentEndDate: '2025-03-01',
  },
  {
    id: 's9',
    name: 'Oliver Taylor',
    phone: '+1 555 0109',
    email: 'oliver.t@email.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    status: 'ACTIVE',
    groupId: 'g3',
    attendancePercent: 86,
    totalScore: 81,
    registrationDate: '2024-11-01',
    paymentStartDate: '2024-12-01',
    paymentEndDate: '2025-02-01',
  },
  {
    id: 's10',
    name: 'Ava Anderson',
    phone: '+1 555 0110',
    email: 'ava.a@email.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    status: 'ACTIVE',
    groupId: 'g3',
    attendancePercent: 93,
    totalScore: 89,
    registrationDate: '2024-11-05',
    paymentStartDate: '2024-12-01',
    paymentEndDate: '2025-01-01',
  },
  // New students (no group assigned)
  {
    id: 's11',
    name: 'Lucas White',
    phone: '+1 555 0111',
    email: 'lucas.w@email.com',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop',
    status: 'NEW_STUDENT',
    groupId: null,
    attendancePercent: 0,
    totalScore: 0,
    registrationDate: '2024-12-18',
    paymentStartDate: null,
    paymentEndDate: null,
  },
  {
    id: 's12',
    name: 'Mia Johnson',
    phone: '+1 555 0112',
    email: 'mia.j@email.com',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
    status: 'NEW_STUDENT',
    groupId: null,
    attendancePercent: 0,
    totalScore: 0,
    registrationDate: '2024-12-20',
    paymentStartDate: null,
    paymentEndDate: null,
  },
  {
    id: 's13',
    name: 'Noah Davis',
    phone: '+1 555 0113',
    email: 'noah.d@email.com',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop',
    status: 'NEW_STUDENT',
    groupId: null,
    attendancePercent: 0,
    totalScore: 0,
    registrationDate: '2024-12-21',
    paymentStartDate: null,
    paymentEndDate: null,
  },
];

// Mock Assignments
export const assignments: Assignment[] = [
  {
    id: 'a1',
    groupId: 'g1',
    title: 'Present Simple Exercise',
    description: 'Complete the exercises on present simple tense.',
    dueDate: '2024-12-25',
    createdAt: '2024-12-15',
    submissions: [
      {
        id: 'sub1',
        studentId: 's1',
        assignmentId: 'a1',
        content: 'Here are my answers for the present simple exercises...',
        status: 'Graded',
        grade: 85,
        submittedAt: '2024-12-20',
      },
      {
        id: 'sub2',
        studentId: 's2',
        assignmentId: 'a1',
        content: 'Completed all exercises.',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
        status: 'Submitted',
        submittedAt: '2024-12-21',
      },
      {
        id: 'sub3',
        studentId: 's4',
        assignmentId: 'a1',
        content: 'My submission for the assignment.',
        status: 'Graded',
        grade: 92,
        submittedAt: '2024-12-19',
      },
    ],
  },
  {
    id: 'a2',
    groupId: 'g1',
    title: 'Vocabulary Quiz - Unit 3',
    description: 'Learn and write sentences using new vocabulary words.',
    dueDate: '2024-12-28',
    createdAt: '2024-12-18',
    submissions: [
      {
        id: 'sub4',
        studentId: 's1',
        assignmentId: 'a2',
        content: 'Vocabulary sentences completed.',
        status: 'Submitted',
        submittedAt: '2024-12-22',
      },
    ],
  },
  {
    id: 'a3',
    groupId: 'g2',
    title: 'Reading Comprehension',
    description: 'Read the article and answer questions.',
    dueDate: '2024-12-30',
    createdAt: '2024-12-20',
    submissions: [],
  },
];

// Mock Attendance Records
export const attendanceRecords: AttendanceRecord[] = [
  {
    id: 'att1',
    groupId: 'g1',
    date: '2024-12-20',
    records: [
      { studentId: 's1', present: true },
      { studentId: 's2', present: true },
      { studentId: 's3', present: false },
      { studentId: 's4', present: true },
      { studentId: 's5', present: true },
    ],
  },
  {
    id: 'att2',
    groupId: 'g1',
    date: '2024-12-18',
    records: [
      { studentId: 's1', present: true },
      { studentId: 's2', present: false },
      { studentId: 's3', present: true },
      { studentId: 's4', present: true },
      { studentId: 's5', present: true },
    ],
  },
];

// Current logged-in user for demo purposes
export const currentUser = {
  id: 't1',
  role: 'teacher' as UserRole,
  name: 'Sarah Johnson',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
};

// Helper functions
export function getTeacherById(id: string): Teacher | undefined {
  return teachers.find(t => t.id === id);
}

export function getStudentById(id: string): Student | undefined {
  return students.find(s => s.id === id);
}

export function getGroupById(id: string): Group | undefined {
  return groups.find(g => g.id === id);
}

export function getStudentsByGroupId(groupId: string): Student[] {
  return students.filter(s => s.groupId === groupId);
}

export function getAssignmentsByGroupId(groupId: string): Assignment[] {
  return assignments.filter(a => a.groupId === groupId);
}

export function getAttendanceByGroupId(groupId: string): AttendanceRecord[] {
  return attendanceRecords.filter(a => a.groupId === groupId);
}

export function getGroupsByTeacherId(teacherId: string): Group[] {
  return groups.filter(g => g.mainTeacherId === teacherId || g.assistantTeacherId === teacherId);
}

export function getNewStudents(): Student[] {
  return students.filter(s => s.status === 'NEW_STUDENT');
}

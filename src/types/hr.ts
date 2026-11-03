export type NavigationTab =
  | 'dashboard'
  | 'org-structure'
  | 'employees'
  | 'attendance'
  | 'leaves'
  | 'payroll'
  | 'performance'
  | 'training'
  | 'recruitment'
  | 'documents'
  | 'reports'
  | 'settings';

export type QuickActionType =
  | 'add-employee'
  | 'record-leave'
  | 'record-attendance'
  | 'issue-payslip'
  | 'evaluate-performance'
  | 'register-training'
  | 'hr-report'
  | null;

export type DepartmentName =
  | 'إدارة المشاريع'
  | 'الإدارة الهندسية'
  | 'المكتب الفني'
  | 'الإدارة المالية'
  | 'المشتريات'
  | 'الشؤون الإدارية'
  | 'إدارات أخرى';

export type JobCategoryName =
  | 'إدارة عليا'
  | 'وظائف إشرافية'
  | 'وظائف فنية'
  | 'وظائف إدارية';

export type GenderType = 'male' | 'female';

export type EmployeeStatus = 'active' | 'probation' | 'transferred' | 'terminated';

export interface Employee {
  id: string;
  code: string;
  name: string;
  role: string;
  department: DepartmentName;
  jobCategory: JobCategoryName;
  project: string;
  gender: GenderType;
  status: EmployeeStatus;
  joinDate: string;
  salary: number;
  rating: number;
  attendanceRate: number;
  phone: string;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  department: DepartmentName;
  type: 'سنوية' | 'مرضية' | 'عارضة' | 'بدون راتب';
  startDate: string;
  days: number;
  status: 'approved' | 'pending' | 'rejected';
}

export interface TrainingProgram {
  id: string;
  title: string;
  department: DepartmentName;
  instructor: string;
  date: string;
  enrolledCount: number;
  status: 'مكتمل' | 'جاري التنفيذ' | 'مجدول';
}

export interface AttendanceStat {
  presentDays: number;
  absentDays: number;
  lateDays: number;
  earlyLeaveDays: number;
  rate: number;
  rateTrend: string;
}

export interface LeaveStat {
  totalRequests: number;
  approved: number;
  pending: number;
  rejected: number;
}

export interface PerformanceStat {
  averageRating: number;
  excellentPct: number; // 5
  veryGoodPct: number;  // 4
  goodPct: number;      // 3
  acceptablePct: number;// 2
  needsImprovementPct: number; // 1
}

export type ToastVariant = 'success' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  title: string;
  description: string;
  variant: ToastVariant;
  duration?: number;
}

export type TaskPriority = 'عالية' | 'متوسطة' | 'عادية';

export interface TodoTask {
  id: string;
  title: string;
  assignee: string;
  department: DepartmentName;
  priority: TaskPriority;
  dueTime: string;
  completed: boolean;
}

export interface HRState {
  theme: 'light' | 'dark';
  activeTab: NavigationTab;
  activeQuickAction: QuickActionType;
  selectedYear: string;
  selectedProject: string;
  selectedDepartment: string;
  lastSavedAt: string;
  // Core Metrics matching the EEC HR Dashboard image
  totalEmployees: number;
  totalGrowthPct: number;
  activeEmployees: number;
  probationEmployees: number;
  recentlyTransferred: number;
  terminatedThisYear: number;
  departments: Record<DepartmentName, number>;
  jobCategories: Record<JobCategoryName, number>;
  genderDistribution: {
    male: number;
    female: number;
  };
  attendance: AttendanceStat;
  leaves: LeaveStat;
  performance: PerformanceStat;
  // Detailed lists for sub-pages & quick actions
  employeeList: Employee[];
  leaveRequests: LeaveRequest[];
  trainingPrograms: TrainingProgram[];
  todoTasks: TodoTask[];
  notifications: Array<{
    id: string;
    title: string;
    time: string;
    read: boolean;
  }>;
  toasts: ToastItem[];
}

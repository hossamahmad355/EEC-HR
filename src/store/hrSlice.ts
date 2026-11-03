import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DepartmentName,
  Employee,
  GenderType,
  HRState,
  JobCategoryName,
  LeaveRequest,
  NavigationTab,
  QuickActionType,
  TaskPriority,
  ToastItem,
  ToastVariant,
  TodoTask,
  TrainingProgram,
} from '../types/hr';

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-1001',
    code: 'EEC-2041',
    name: 'م. أحمد محمود عبد الرحمن',
    role: 'مدير مشروعات أول',
    department: 'إدارة المشاريع',
    jobCategory: 'إدارة عليا',
    project: 'مشروع أبراج العلمين الجديدة',
    gender: 'male',
    status: 'active',
    joinDate: '2019-03-15',
    salary: 42500,
    rating: 5,
    attendanceRate: 98.5,
    phone: '01012345678',
  },
  {
    id: 'EMP-1002',
    code: 'EEC-2089',
    name: 'م. سارة طارق الشافعي',
    role: 'مهندس تصميم معماري أول',
    department: 'الإدارة الهندسية',
    jobCategory: 'وظائف فنية',
    project: 'مشروع العاصمة الإدارية - الحي الحكومي',
    gender: 'female',
    status: 'active',
    joinDate: '2021-07-01',
    salary: 28000,
    rating: 5,
    attendanceRate: 97.2,
    phone: '01123456789',
  },
  {
    id: 'EMP-1003',
    code: 'EEC-2114',
    name: 'م. كريم عادل المنياوي',
    role: 'رئيس قسم المكتب الفني',
    department: 'المكتب الفني',
    jobCategory: 'وظائف إشرافية',
    project: 'مشروع أبراج العلمين الجديدة',
    gender: 'male',
    status: 'active',
    joinDate: '2020-11-10',
    salary: 33500,
    rating: 4,
    attendanceRate: 96.8,
    phone: '01234567890',
  },
  {
    id: 'EMP-1004',
    code: 'EEC-2190',
    name: 'أ. محمد حسن السويفي',
    role: 'مدير الحسابات والمراجعة',
    department: 'الإدارة المالية',
    jobCategory: 'وظائف إشرافية',
    project: 'مشروع المجمع الصناعي بالعين السخنة',
    gender: 'male',
    status: 'active',
    joinDate: '2018-05-20',
    salary: 31000,
    rating: 4,
    attendanceRate: 99.1,
    phone: '01098765432',
  },
  {
    id: 'EMP-1005',
    code: 'EEC-2245',
    name: 'أ. نهى خالد عبد العزيز',
    role: 'أخصائي أول مشتريات وعقود',
    department: 'المشتريات',
    jobCategory: 'وظائف إدارية',
    project: 'مشروع محطة معالجة المياه',
    gender: 'female',
    status: 'active',
    joinDate: '2022-02-14',
    salary: 21500,
    rating: 5,
    attendanceRate: 95.4,
    phone: '01554321987',
  },
  {
    id: 'EMP-1006',
    code: 'EEC-2301',
    name: 'م. عمر فاروق الجندي',
    role: 'مهندس تنفيذ مواقع',
    department: 'إدارة المشاريع',
    jobCategory: 'وظائف فنية',
    project: 'مشروع تطوير الموانئ البحرية',
    gender: 'male',
    status: 'probation',
    joinDate: '2026-01-12',
    salary: 19500,
    rating: 4,
    attendanceRate: 94.0,
    phone: '01066778899',
  },
  {
    id: 'EMP-1007',
    code: 'EEC-2319',
    name: 'أ. ياسمين وائل الدسوقي',
    role: 'منسق شؤون إدارية وموارد بشرية',
    department: 'الشؤون الإدارية',
    jobCategory: 'وظائف إدارية',
    project: 'مشروع العاصمة الإدارية - الحي الحكومي',
    gender: 'female',
    status: 'active',
    joinDate: '2023-09-01',
    salary: 18500,
    rating: 4,
    attendanceRate: 97.8,
    phone: '01144556677',
  },
  {
    id: 'EMP-1008',
    code: 'EEC-2355',
    name: 'م. مصطفى شريف النجار',
    role: 'مهندس تخطيط ومتابعة',
    department: 'المكتب الفني',
    jobCategory: 'وظائف فنية',
    project: 'مشروع المجمع الصناعي بالعين السخنة',
    gender: 'male',
    status: 'transferred',
    joinDate: '2022-06-18',
    salary: 25000,
    rating: 3,
    attendanceRate: 93.5,
    phone: '01288990011',
  },
  {
    id: 'EMP-1009',
    code: 'EEC-2388',
    name: 'م. رانيا سامح عبد اللطيف',
    role: 'مهندس جودة وسلامة مهنية',
    department: 'إدارات أخرى',
    jobCategory: 'وظائف فنية',
    project: 'مشروع محطة معالجة المياه',
    gender: 'female',
    status: 'active',
    joinDate: '2021-12-05',
    salary: 24000,
    rating: 5,
    attendanceRate: 96.9,
    phone: '01033221144',
  },
  {
    id: 'EMP-1010',
    code: 'EEC-2412',
    name: 'م. حسام الدين رأفت',
    role: 'مهندس ميكانيكا وكهرباء MEP',
    department: 'الإدارة الهندسية',
    jobCategory: 'وظائف فنية',
    project: 'مشروع أبراج العلمين الجديدة',
    gender: 'male',
    status: 'probation',
    joinDate: '2026-02-01',
    salary: 22000,
    rating: 4,
    attendanceRate: 95.8,
    phone: '01199887766',
  },
];

const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'LV-301',
    employeeName: 'م. عمر فاروق الجندي',
    department: 'إدارة المشاريع',
    type: 'سنوية',
    startDate: '2026-04-10',
    days: 4,
    status: 'pending',
  },
  {
    id: 'LV-302',
    employeeName: 'م. سارة طارق الشافعي',
    department: 'الإدارة الهندسية',
    type: 'سنوية',
    startDate: '2026-04-05',
    days: 2,
    status: 'approved',
  },
  {
    id: 'LV-303',
    employeeName: 'أ. نهى خالد عبد العزيز',
    department: 'المشتريات',
    type: 'مرضية',
    startDate: '2026-04-12',
    days: 3,
    status: 'pending',
  },
  {
    id: 'LV-304',
    employeeName: 'م. كريم عادل المنياوي',
    department: 'المكتب الفني',
    type: 'سنوية',
    startDate: '2026-03-22',
    days: 5,
    status: 'approved',
  },
  {
    id: 'LV-305',
    employeeName: 'م. مصطفى شريف النجار',
    department: 'المكتب الفني',
    type: 'عارضة',
    startDate: '2026-03-28',
    days: 1,
    status: 'rejected',
  },
];

const INITIAL_TRAININGS: TrainingProgram[] = [
  {
    id: 'TR-101',
    title: 'إدارة المشروعات الهندسية الاحترافية PMP',
    department: 'إدارة المشاريع',
    instructor: 'د. هاني عبد السلام',
    date: '2026-04-15',
    enrolledCount: 28,
    status: 'جاري التنفيذ',
  },
  {
    id: 'TR-102',
    title: 'نمذجة معلومات البناء المتقدمة BIM & Revit',
    department: 'الإدارة الهندسية',
    instructor: 'م. طارق المنصور',
    date: '2026-05-01',
    enrolledCount: 22,
    status: 'مجدول',
  },
  {
    id: 'TR-103',
    title: 'معايير السلامة والصحة المهنية بالمواقع الإنشائية OSHA',
    department: 'إدارات أخرى',
    instructor: 'م. سامح الكيلاني',
    date: '2026-03-10',
    enrolledCount: 45,
    status: 'مكتمل',
  },
  {
    id: 'TR-104',
    title: 'إدارة العقود والمناقصات الهندسية FIDIC',
    department: 'المكتب الفني',
    instructor: 'د. محمود الشربيني',
    date: '2026-04-22',
    enrolledCount: 19,
    status: 'جاري التنفيذ',
  },
];

const INITIAL_TODOS: TodoTask[] = [
  {
    id: 'TODO-1',
    title: 'اعتماد كشوف الحضور والانصراف لمشروع أبراج العلمين الجديدة',
    assignee: 'م. أحمد محمود عبد الرحمن',
    department: 'إدارة المشاريع',
    priority: 'عالية',
    dueTime: '10:30 ص',
    completed: true,
  },
  {
    id: 'TODO-2',
    title: 'مراجعة طلبات الإجازات السنوية المعلقة للمهندسين بالمواقع',
    assignee: 'أ. ياسمين وائل الدسوقي',
    department: 'الشؤون الإدارية',
    priority: 'عالية',
    dueTime: '12:00 م',
    completed: false,
  },
  {
    id: 'TODO-3',
    title: 'إجراء مقابلات التعيين لمهندسي المكتب الفني الجدد',
    assignee: 'م. كريم عادل المنياوي',
    department: 'المكتب الفني',
    priority: 'متوسطة',
    dueTime: '02:00 م',
    completed: false,
  },
  {
    id: 'TODO-4',
    title: 'تحديث نماذج تقييم الأداء الربع سنوي للإدارة الهندسية',
    assignee: 'م. سارة طارق الشافعي',
    department: 'الإدارة الهندسية',
    priority: 'متوسطة',
    dueTime: '03:30 م',
    completed: true,
  },
  {
    id: 'TODO-5',
    title: 'إعداد بيان مفردات المرتبات والبدلات الشهرية للاعتماد المالي',
    assignee: 'أ. محمد حسن السويفي',
    department: 'الإدارة المالية',
    priority: 'عادية',
    dueTime: '04:30 م',
    completed: false,
  },
];

export const defaultHRState: HRState = {
  theme: 'light',
  activeTab: 'dashboard',
  activeQuickAction: null,
  selectedYear: '2026',
  selectedProject: 'جميع المشاريع',
  selectedDepartment: 'جميع الإدارات',
  lastSavedAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),

  totalEmployees: 437,
  totalGrowthPct: 2.8,
  activeEmployees: 425,
  probationEmployees: 12,
  recentlyTransferred: 8,
  terminatedThisYear: 5,

  departments: {
    'إدارة المشاريع': 128,
    'الإدارة الهندسية': 76,
    'المكتب الفني': 54,
    'الإدارة المالية': 42,
    'المشتريات': 36,
    'الشؤون الإدارية': 28,
    'إدارات أخرى': 73,
  },

  jobCategories: {
    'إدارة عليا': 44,
    'وظائف إشرافية': 101,
    'وظائف فنية': 156,
    'وظائف إدارية': 136,
  },

  genderDistribution: {
    male: 351,
    female: 86,
  },

  attendance: {
    presentDays: 8245,
    absentDays: 264,
    lateDays: 137,
    earlyLeaveDays: 91,
    rate: 96.4,
    rateTrend: '+1.9%',
  },

  leaves: {
    totalRequests: 126,
    approved: 112,
    pending: 8,
    rejected: 6,
  },

  performance: {
    averageRating: 4.3,
    excellentPct: 46,
    veryGoodPct: 32,
    goodPct: 15,
    acceptablePct: 5,
    needsImprovementPct: 2,
  },

  employeeList: INITIAL_EMPLOYEES,
  leaveRequests: INITIAL_LEAVES,
  trainingPrograms: INITIAL_TRAININGS,
  todoTasks: INITIAL_TODOS,
  notifications: [
    {
      id: 'notif-1',
      title: 'تم اعتماد 4 طلبات إجازة سنوية في إدارة المشاريع',
      time: 'منذ 15 دقيقة',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'اكتمال تقييم الأداء الربع سنوي للإدارة الهندسية بنسبة 98%',
      time: 'منذ ساعة',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'انضمام مهندس موقع جديد تحت التجربة بمشروع العلمين',
      time: 'منذ 3 ساعات',
      read: true,
    },
  ],
  toasts: [],
};

const STORAGE_KEY = 'eec_hr_dashboard_state_v1';

const loadPersistedState = (): HRState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultHRState;
    const parsed = JSON.parse(raw);
    return {
      ...defaultHRState,
      ...parsed,
      departments: { ...defaultHRState.departments, ...(parsed.departments || {}) },
      jobCategories: { ...defaultHRState.jobCategories, ...(parsed.jobCategories || {}) },
      genderDistribution: {
        ...defaultHRState.genderDistribution,
        ...(parsed.genderDistribution || {}),
      },
      attendance: { ...defaultHRState.attendance, ...(parsed.attendance || {}) },
      leaves: { ...defaultHRState.leaves, ...(parsed.leaves || {}) },
      performance: { ...defaultHRState.performance, ...(parsed.performance || {}) },
      todoTasks: Array.isArray(parsed.todoTasks) ? parsed.todoTasks : INITIAL_TODOS,
      toasts: [],
    };
  } catch {
    return defaultHRState;
  }
};

const touchTimestamp = (state: HRState) => {
  state.lastSavedAt = new Date().toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const pushToastHelper = (
  state: HRState,
  title: string,
  description: string,
  variant: ToastVariant = 'success'
) => {
  const newToast: ToastItem = {
    id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    description,
    variant,
    duration: 4500,
  };
  state.toasts = [newToast, ...state.toasts].slice(0, 4);
};

const hrSlice = createSlice({
  name: 'hr',
  initialState: loadPersistedState(),
  reducers: {
    addToast(
      state,
      action: PayloadAction<{
        title: string;
        description: string;
        variant?: ToastVariant;
      }>
    ) {
      pushToastHelper(
        state,
        action.payload.title,
        action.payload.description,
        action.payload.variant || 'success'
      );
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      touchTimestamp(state);
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
      touchTimestamp(state);
    },
    setActiveTab(state, action: PayloadAction<NavigationTab>) {
      state.activeTab = action.payload;
      touchTimestamp(state);
    },
    setActiveQuickAction(state, action: PayloadAction<QuickActionType>) {
      state.activeQuickAction = action.payload;
    },
    setSelectedYear(state, action: PayloadAction<string>) {
      state.selectedYear = action.payload;
      touchTimestamp(state);
    },
    setSelectedProject(state, action: PayloadAction<string>) {
      state.selectedProject = action.payload;
      touchTimestamp(state);
    },
    setSelectedDepartment(state, action: PayloadAction<string>) {
      state.selectedDepartment = action.payload;
      touchTimestamp(state);
    },
    // TO-DO LIST REDUCERS
    addTodoTask(
      state,
      action: PayloadAction<{
        title: string;
        assignee: string;
        department: DepartmentName;
        priority: TaskPriority;
        dueTime: string;
      }>
    ) {
      const newTask: TodoTask = {
        id: `TODO-${Date.now()}`,
        title: action.payload.title,
        assignee: action.payload.assignee,
        department: action.payload.department,
        priority: action.payload.priority,
        dueTime: action.payload.dueTime || '01:00 م',
        completed: false,
      };
      state.todoTasks.unshift(newTask);
      pushToastHelper(
        state,
        'تمت إضافة مهمة جديدة',
        `تمت إضافة "${action.payload.title}" إلى قائمة المهام اليومية.`,
        'success'
      );
      touchTimestamp(state);
    },
    toggleTodoTask(state, action: PayloadAction<string>) {
      const task = state.todoTasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        pushToastHelper(
          state,
          task.completed ? 'تم إنجاز المهمة بنجاح' : 'تمت إعادة المهمة لقيد التنفيذ',
          `"${task.title}" (${task.assignee})`,
          task.completed ? 'success' : 'info'
        );
        touchTimestamp(state);
      }
    },
    editTodoTask(
      state,
      action: PayloadAction<{
        id: string;
        title: string;
        assignee: string;
        priority: TaskPriority;
        dueTime: string;
      }>
    ) {
      const task = state.todoTasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.title = action.payload.title;
        task.assignee = action.payload.assignee;
        task.priority = action.payload.priority;
        task.dueTime = action.payload.dueTime;
        pushToastHelper(
          state,
          'تم تعديل المهمة بنجاح',
          `تم تحديث بيانات المهمة "${task.title}".`,
          'info'
        );
        touchTimestamp(state);
      }
    },
    deleteTodoTask(state, action: PayloadAction<string>) {
      const target = state.todoTasks.find((t) => t.id === action.payload);
      state.todoTasks = state.todoTasks.filter((t) => t.id !== action.payload);
      if (target) {
        pushToastHelper(
          state,
          'تم حذف المهمة',
          `تم حذف "${target.title}" من قائمة المهام اليومية.`,
          'warning'
        );
      }
      touchTimestamp(state);
    },
    clearCompletedTodos(state) {
      const completedCount = state.todoTasks.filter((t) => t.completed).length;
      if (completedCount > 0) {
        state.todoTasks = state.todoTasks.filter((t) => !t.completed);
        pushToastHelper(
          state,
          'تم تنظيف المهام المنجزة',
          `تم إزالة ${completedCount} مهام مكتملة من القائمة.`,
          'info'
        );
        touchTimestamp(state);
      }
    },
    // QUICK ACTION REDUCERS
    addNewEmployee(
      state,
      action: PayloadAction<{
        name: string;
        role: string;
        department: DepartmentName;
        jobCategory: JobCategoryName;
        project: string;
        gender: GenderType;
        status: 'active' | 'probation';
        salary: number;
        phone: string;
      }>
    ) {
      const payload = action.payload;
      const newEmp: Employee = {
        id: `EMP-${Date.now()}`,
        code: `EEC-${2420 + state.employeeList.length}`,
        name: payload.name,
        role: payload.role,
        department: payload.department,
        jobCategory: payload.jobCategory,
        project: payload.project,
        gender: payload.gender,
        status: payload.status,
        joinDate: new Date().toISOString().split('T')[0],
        salary: payload.salary,
        rating: 4,
        attendanceRate: 97.0,
        phone: payload.phone || '01000000000',
      };

      state.employeeList.unshift(newEmp);
      state.totalEmployees += 1;
      if (payload.status === 'active') {
        state.activeEmployees += 1;
      } else {
        state.probationEmployees += 1;
      }
      state.departments[payload.department] =
        (state.departments[payload.department] || 0) + 1;
      state.jobCategories[payload.jobCategory] =
        (state.jobCategories[payload.jobCategory] || 0) + 1;
      if (payload.gender === 'male') {
        state.genderDistribution.male += 1;
      } else {
        state.genderDistribution.female += 1;
      }

      state.notifications.unshift({
        id: `notif-${Date.now()}`,
        title: `تم إضافة الموظف "${payload.name}" إلى ${payload.department}`,
        time: 'الآن',
        read: false,
      });

      pushToastHelper(
        state,
        'تم إضافة الموظف الجديد بنجاح',
        `تم قيد "${payload.name}" في ${payload.department} وتحديث إجمالي القوة العاملة إلى ${state.totalEmployees} موظف.`,
        'success'
      );

      touchTimestamp(state);
    },
    recordLeaveRequest(
      state,
      action: PayloadAction<{
        employeeName: string;
        department: DepartmentName;
        type: 'سنوية' | 'مرضية' | 'عارضة' | 'بدون راتب';
        startDate: string;
        days: number;
        status: 'approved' | 'pending';
      }>
    ) {
      const req: LeaveRequest = {
        id: `LV-${Date.now().toString().slice(-4)}`,
        ...action.payload,
      };
      state.leaveRequests.unshift(req);
      state.leaves.totalRequests += 1;
      if (action.payload.status === 'approved') {
        state.leaves.approved += 1;
      } else {
        state.leaves.pending += 1;
      }
      state.notifications.unshift({
        id: `notif-${Date.now()}`,
        title: `تم تسجيل طلب إجازة (${action.payload.type}) للموظف ${action.payload.employeeName}`,
        time: 'الآن',
        read: false,
      });

      pushToastHelper(
        state,
        action.payload.status === 'approved'
          ? 'تم تسجيل واعتماد طلب الإجازة'
          : 'تم إرسال طلب الإجازة للمراجعة',
        `إجازة ${action.payload.type} لمدة ${action.payload.days} أيام للموظف ${action.payload.employeeName} (${action.payload.department}).`,
        action.payload.status === 'approved' ? 'success' : 'info'
      );

      touchTimestamp(state);
    },
    updateLeaveStatus(
      state,
      action: PayloadAction<{ id: string; newStatus: 'approved' | 'rejected' }>
    ) {
      const target = state.leaveRequests.find((l) => l.id === action.payload.id);
      if (target && target.status === 'pending') {
        target.status = action.payload.newStatus;
        state.leaves.pending = Math.max(0, state.leaves.pending - 1);
        if (action.payload.newStatus === 'approved') {
          state.leaves.approved += 1;
          pushToastHelper(
            state,
            'تم اعتماد طلب الإجازة',
            `تمت الموافقة على إجازة الموظف ${target.employeeName} وتحديث الرصيد.`,
            'success'
          );
        } else {
          state.leaves.rejected += 1;
          pushToastHelper(
            state,
            'تم رفض طلب الإجازة',
            `تم رفض طلب الإجازة المقدم من ${target.employeeName}.`,
            'warning'
          );
        }
        touchTimestamp(state);
      }
    },
    recordAttendanceBatch(
      state,
      action: PayloadAction<{
        presentAdded: number;
        absentAdded: number;
        lateAdded: number;
        earlyLeaveAdded: number;
      }>
    ) {
      state.attendance.presentDays += action.payload.presentAdded;
      state.attendance.absentDays += action.payload.absentAdded;
      state.attendance.lateDays += action.payload.lateAdded;
      state.attendance.earlyLeaveDays += action.payload.earlyLeaveAdded;

      const total = state.attendance.presentDays + state.attendance.absentDays;
      if (total > 0) {
        state.attendance.rate = Number(
          ((state.attendance.presentDays / total) * 100).toFixed(1)
        );
      }
      state.notifications.unshift({
        id: `notif-${Date.now()}`,
        title: `تم تحديث سجل الحضور والانصراف (+${action.payload.presentAdded} يوم حضور)`,
        time: 'الآن',
        read: false,
      });

      pushToastHelper(
        state,
        'تم تسجيل الحضور والانصراف بنجاح',
        `تمت إضافة ${action.payload.presentAdded} يوم حضور، ومعدل الحضور الحالي ${state.attendance.rate}%.`,
        'success'
      );

      touchTimestamp(state);
    },
    recordPerformanceReview(
      state,
      action: PayloadAction<{
        employeeName: string;
        score: 1 | 2 | 3 | 4 | 5;
      }>
    ) {
      const emp = state.employeeList.find(
        (e) => e.name === action.payload.employeeName
      );
      if (emp) {
        emp.rating = action.payload.score;
      }
      const nextAvg = Number(
        ((state.performance.averageRating * 50 + action.payload.score) / 51).toFixed(
          1
        )
      );
      state.performance.averageRating = Math.min(5, Math.max(1, nextAvg));
      state.notifications.unshift({
        id: `notif-${Date.now()}`,
        title: `تم اعتماد تقييم الأداء للموظف ${action.payload.employeeName} (${action.payload.score}/5)`,
        time: 'الآن',
        read: false,
      });

      pushToastHelper(
        state,
        'تم حفظ واعتماد تقييم الأداء',
        `حصل ${action.payload.employeeName} على تقييم (${action.payload.score} / 5) وتم تحديث المتوسط العام إلى ${state.performance.averageRating}.`,
        'success'
      );

      touchTimestamp(state);
    },
    registerTrainingProgram(
      state,
      action: PayloadAction<{
        title: string;
        department: DepartmentName;
        instructor: string;
        date: string;
        enrolledCount: number;
      }>
    ) {
      state.trainingPrograms.unshift({
        id: `TR-${Date.now().toString().slice(-3)}`,
        ...action.payload,
        status: 'مجدول',
      });
      state.notifications.unshift({
        id: `notif-${Date.now()}`,
        title: `تم إدراج برنامج تدريبي جديد: "${action.payload.title}"`,
        time: 'الآن',
        read: false,
      });

      pushToastHelper(
        state,
        'تم تسجيل البرنامج التدريبي بنجاح',
        `دورة "${action.payload.title}" لعدد ${action.payload.enrolledCount} متدرب في ${action.payload.department}.`,
        'success'
      );

      touchTimestamp(state);
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach((n) => {
        n.read = true;
      });
      touchTimestamp(state);
    },
    resetToReferenceDefaults(state) {
      const currentTheme = state.theme;
      Object.assign(state, {
        ...defaultHRState,
        theme: currentTheme,
        lastSavedAt: new Date().toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
      pushToastHelper(
        state,
        'تمت استعادة البيانات الافتراضية',
        'تمت إعادة كافة إحصائيات لوحة التحكم إلى القيم المرجعية الأصلية.',
        'info'
      );
    },
  },
});

export const {
  addToast,
  removeToast,
  toggleTheme,
  setTheme,
  setActiveTab,
  setActiveQuickAction,
  setSelectedYear,
  setSelectedProject,
  setSelectedDepartment,
  addTodoTask,
  toggleTodoTask,
  editTodoTask,
  deleteTodoTask,
  clearCompletedTodos,
  addNewEmployee,
  recordLeaveRequest,
  updateLeaveStatus,
  recordAttendanceBatch,
  recordPerformanceReview,
  registerTrainingProgram,
  markAllNotificationsRead,
  resetToReferenceDefaults,
} = hrSlice.actions;

export const HR_STORAGE_KEY = STORAGE_KEY;
export default hrSlice.reducer;

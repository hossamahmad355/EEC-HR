import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  UserPlus,
  Plane,
  CalendarCheck,
  FileText,
  Star,
  GraduationCap,
  TrendingUp,
  Printer,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  addNewEmployee,
  addToast,
  recordAttendanceBatch,
  recordLeaveRequest,
  recordPerformanceReview,
  registerTrainingProgram,
  setActiveQuickAction,
} from '../store/hrSlice';
import { DepartmentName, GenderType, JobCategoryName } from '../types/hr';

const DEPARTMENTS: DepartmentName[] = [
  'إدارة المشاريع',
  'الإدارة الهندسية',
  'المكتب الفني',
  'الإدارة المالية',
  'المشتريات',
  'الشؤون الإدارية',
  'إدارات أخرى',
];

const JOB_CATEGORIES: JobCategoryName[] = [
  'إدارة عليا',
  'وظائف إشرافية',
  'وظائف فنية',
  'وظائف إدارية',
];

export const QuickActionModals: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    activeQuickAction,
    employeeList,
    totalEmployees,
    attendance,
    leaves,
    performance,
  } = useAppSelector((state) => state.hr);

  // Add Employee form state
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('مهندس تنفيذ مدني');
  const [empDept, setEmpDept] = useState<DepartmentName>('إدارة المشاريع');
  const [empCat, setEmpCat] = useState<JobCategoryName>('وظائف فنية');
  const [empProject, setEmpProject] = useState('مشروع أبراج العلمين الجديدة');
  const [empGender, setEmpGender] = useState<GenderType>('male');
  const [empStatus, setEmpStatus] = useState<'active' | 'probation'>('active');
  const [empSalary, setEmpSalary] = useState(24000);
  const [empPhone, setEmpPhone] = useState('01023456789');

  // Leave form state
  const [leaveEmpName, setLeaveEmpName] = useState(
    employeeList[0]?.name || 'م. أحمد محمود عبد الرحمن'
  );
  const [leaveDept, setLeaveDept] = useState<DepartmentName>('إدارة المشاريع');
  const [leaveType, setLeaveType] = useState<'سنوية' | 'مرضية' | 'عارضة' | 'بدون راتب'>(
    'سنوية'
  );
  const [leaveStart, setLeaveStart] = useState('2026-04-20');
  const [leaveDays, setLeaveDays] = useState(3);
  const [leaveStatus, setLeaveStatus] = useState<'approved' | 'pending'>('approved');

  // Attendance form state
  const [presentAdd, setPresentAdd] = useState(35);
  const [absentAdd, setAbsentAdd] = useState(1);
  const [lateAdd, setLateAdd] = useState(2);
  const [earlyAdd, setEarlyAdd] = useState(1);

  // Performance form state
  const [perfEmpName, setPerfEmpName] = useState(
    employeeList[0]?.name || 'م. أحمد محمود عبد الرحمن'
  );
  const [perfScore, setPerfScore] = useState<1 | 2 | 3 | 4 | 5>(5);

  // Training form state
  const [trainTitle, setTrainTitle] = useState(
    'إدارة المخاطر الهندسية والجدول الزمني Primavera P6'
  );
  const [trainDept, setTrainDept] = useState<DepartmentName>('إدارة المشاريع');
  const [trainInstructor, setTrainInstructor] = useState('د. ممدوح الشاذلي');
  const [trainDate, setTrainDate] = useState('2026-05-15');
  const [trainCount, setTrainCount] = useState(25);

  // Payslip preview state
  const [payslipEmpId, setPayslipEmpId] = useState(employeeList[0]?.id || 'EMP-1001');

  const selectedPayslipEmp =
    employeeList.find((e) => e.id === payslipEmpId) || employeeList[0];

  const closeModal = () => dispatch(setActiveQuickAction(null));

  if (!activeQuickAction) return null;

  return (
    <AnimatePresence>
      <motion.div
        dir="rtl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.18 }}
          className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-right relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. ADD NEW EMPLOYEE MODAL */}
          {activeQuickAction === 'add-employee' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!empName.trim()) return;
                dispatch(
                  addNewEmployee({
                    name: empName.trim(),
                    role: empRole,
                    department: empDept,
                    jobCategory: empCat,
                    project: empProject,
                    gender: empGender,
                    status: empStatus,
                    salary: Number(empSalary) || 20000,
                    phone: empPhone,
                  })
                );
                setEmpName('');
                closeModal();
              }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      إضافة موظف جديد للشركة
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      يتم تحديث إجمالي الموظفين وتوزيع الإدارات والفئات الوظيفية فور الحفظ
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الاسم الرباعي للموظف *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: م. خالد وليد الشربيني"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    المسمى الوظيفي
                  </label>
                  <input
                    type="text"
                    required
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الإدارة
                  </label>
                  <select
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value as DepartmentName)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الفئة الوظيفية
                  </label>
                  <select
                    value={empCat}
                    onChange={(e) => setEmpCat(e.target.value as JobCategoryName)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {JOB_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    المشروع التابع له
                  </label>
                  <input
                    type="text"
                    value={empProject}
                    onChange={(e) => setEmpProject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الجنس
                  </label>
                  <select
                    value={empGender}
                    onChange={(e) => setEmpGender(e.target.value as GenderType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    حالة التعيين
                  </label>
                  <select
                    value={empStatus}
                    onChange={(e) =>
                      setEmpStatus(e.target.value as 'active' | 'probation')
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="active">موظف فعال</option>
                    <option value="probation">تحت التجربة</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الراتب الأساسي (ج.م)
                  </label>
                  <input
                    type="number"
                    value={empSalary}
                    onChange={(e) => setEmpSalary(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="text"
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#5b21b6] hover:bg-[#4c1d95] text-white shadow-md cursor-pointer"
                >
                  حفظ وإضافة الموظف
                </button>
              </div>
            </form>
          )}

          {/* 2. RECORD LEAVE MODAL */}
          {activeQuickAction === 'record-leave' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                dispatch(
                  recordLeaveRequest({
                    employeeName: leaveEmpName,
                    department: leaveDept,
                    type: leaveType,
                    startDate: leaveStart,
                    days: Number(leaveDays) || 1,
                    status: leaveStatus,
                  })
                );
                closeModal();
              }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      تسجيل طلب إجازة جديد
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      تحديث فوري لبطاقة الإجازات في لوحة التحكم
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الموظف
                  </label>
                  <select
                    value={leaveEmpName}
                    onChange={(e) => setLeaveEmpName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {employeeList.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} — ({emp.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الإدارة
                  </label>
                  <select
                    value={leaveDept}
                    onChange={(e) => setLeaveDept(e.target.value as DepartmentName)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نوع الإجازة
                  </label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="سنوية">إجازة سنوية</option>
                    <option value="مرضية">إجازة مرضية</option>
                    <option value="عارضة">إجازة عارضة</option>
                    <option value="بدون راتب">إجازة بدون راتب</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تاريخ البداية
                  </label>
                  <input
                    type="date"
                    value={leaveStart}
                    onChange={(e) => setLeaveStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    عدد الأيام
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={leaveDays}
                    onChange={(e) => setLeaveDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    حالة الطلب
                  </label>
                  <select
                    value={leaveStatus}
                    onChange={(e) =>
                      setLeaveStatus(e.target.value as 'approved' | 'pending')
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="approved">معتمدة فوراً</option>
                    <option value="pending">قيد المراجعة</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#5b21b6] hover:bg-[#4c1d95] text-white shadow-md cursor-pointer"
                >
                  اعتماد وتسجيل الإجازة
                </button>
              </div>
            </form>
          )}

          {/* 3. RECORD ATTENDANCE MODAL */}
          {activeQuickAction === 'record-attendance' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                dispatch(
                  recordAttendanceBatch({
                    presentAdded: Number(presentAdd) || 0,
                    absentAdded: Number(absentAdd) || 0,
                    lateAdded: Number(lateAdd) || 0,
                    earlyLeaveAdded: Number(earlyAdd) || 0,
                  })
                );
                closeModal();
              }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      تسجيل الحضور والانصراف اليومي
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      إدخال سجلات البصمة اليومية للمواقع والمقر الرئيسي
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                    إضافة أيام حضور
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={presentAdd}
                    onChange={(e) => setPresentAdd(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-rose-600 dark:text-rose-400 mb-1">
                    إضافة حالات غياب
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={absentAdd}
                    onChange={(e) => setAbsentAdd(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-amber-600 dark:text-amber-400 mb-1">
                    إضافة حالات تأخير
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={lateAdd}
                    onChange={(e) => setLateAdd(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-blue-600 dark:text-blue-400 mb-1">
                    إضافة انصراف مبكر
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={earlyAdd}
                    onChange={(e) => setEarlyAdd(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer"
                >
                  تحديث سجل الحضور
                </button>
              </div>
            </form>
          )}

          {/* 4. ISSUE PAYSLIP MODAL */}
          {activeQuickAction === 'issue-payslip' && selectedPayslipEmp && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      إصدار بيان مفردات راتب (Payslip)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      الشركة المصرية الهندسية للمقاولات (EEC)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اختر الموظف لإصدار البيان:
                </label>
                <select
                  value={payslipEmpId}
                  onChange={(e) => setPayslipEmpId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                >
                  {employeeList.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.code} — {e.name} ({e.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-purple-200/70 dark:border-slate-700 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">الكود الوظيفي:</span>
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                    {selectedPayslipEmp.code}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">المسمى والإدارة:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedPayslipEmp.role} · {selectedPayslipEmp.department}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">الراتب الأساسي:</span>
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                    {selectedPayslipEmp.salary.toLocaleString('en-US')} ج.م
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">
                    بدل طبيعة عمل وموقع (20%):
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    +{Math.round(selectedPayslipEmp.salary * 0.2).toLocaleString('en-US')} ج.م
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">
                    استقطاعات تأمينات وضرائب (11%):
                  </span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                    -{Math.round(selectedPayslipEmp.salary * 0.11).toLocaleString('en-US')} ج.م
                  </span>
                </div>
                <div className="flex justify-between pt-1 text-base font-black text-purple-800 dark:text-purple-300">
                  <span>صافي الراتب المستحق:</span>
                  <span className="tabular-nums">
                    {Math.round(selectedPayslipEmp.salary * 1.09).toLocaleString('en-US')} ج.م
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  إغلاق
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dispatch(
                      addToast({
                        title: 'تم إصدار واعتماد بيان الراتب',
                        description: `تم إصدار قسيمة راتب الموظف ${selectedPayslipEmp.name} بصافي مستحق ${Math.round(
                          selectedPayslipEmp.salary * 1.09
                        ).toLocaleString('en-US')} ج.م.`,
                        variant: 'success',
                      })
                    );
                    closeModal();
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-extrabold bg-[#5b21b6] hover:bg-[#4c1d95] text-white shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>اعتماد وإصدار البيان</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. EVALUATE PERFORMANCE MODAL */}
          {activeQuickAction === 'evaluate-performance' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                dispatch(
                  recordPerformanceReview({
                    employeeName: perfEmpName,
                    score: perfScore,
                  })
                );
                closeModal();
              }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      تقييم الأداء الدوري للموظفين
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      نموذج التقييم الهندسي والإداري المعتمد
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اختر الموظف
                  </label>
                  <select
                    value={perfEmpName}
                    onChange={(e) => setPerfEmpName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {employeeList.map((e) => (
                      <option key={e.id} value={e.name}>
                        {e.name} — ({e.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                    درجة التقييم (من 1 إلى 5)
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {([5, 4, 3, 2, 1] as const).map((val) => {
                      const labels: Record<number, string> = {
                        5: 'ممتاز (5)',
                        4: 'جيد جداً (4)',
                        3: 'جيد (3)',
                        2: 'مقبول (2)',
                        1: 'تطوير (1)',
                      };
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setPerfScore(val)}
                          className={`py-2.5 px-2 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                            perfScore === val
                              ? 'bg-[#5b21b6] text-white border-[#5b21b6] shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {labels[val]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#5b21b6] hover:bg-[#4c1d95] text-white shadow-md cursor-pointer"
                >
                  اعتماد التقييم
                </button>
              </div>
            </form>
          )}

          {/* 6. REGISTER TRAINING MODAL */}
          {activeQuickAction === 'register-training' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                dispatch(
                  registerTrainingProgram({
                    title: trainTitle,
                    department: trainDept,
                    instructor: trainInstructor,
                    date: trainDate,
                    enrolledCount: Number(trainCount) || 15,
                  })
                );
                closeModal();
              }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      تسجيل برنامج تدريبي جديد
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      تطوير الكفاءات الهندسية والإدارية بشركة EEC
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    عنوان الدورة التدريبية
                  </label>
                  <input
                    type="text"
                    required
                    value={trainTitle}
                    onChange={(e) => setTrainTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الإدارة المستهدفة
                  </label>
                  <select
                    value={trainDept}
                    onChange={(e) => setTrainDept(e.target.value as DepartmentName)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    المحاضر / المركز التدريبي
                  </label>
                  <input
                    type="text"
                    value={trainInstructor}
                    onChange={(e) => setTrainInstructor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تاريخ الانعقاد
                  </label>
                  <input
                    type="date"
                    value={trainDate}
                    onChange={(e) => setTrainDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    عدد المتدربين المرشحين
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={trainCount}
                    onChange={(e) => setTrainCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#5b21b6] hover:bg-[#4c1d95] text-white shadow-md cursor-pointer"
                >
                  إدراج البرنامج التدريبي
                </button>
              </div>
            </form>
          )}

          {/* 7. EXECUTIVE HR REPORT MODAL */}
          {activeQuickAction === 'hr-report' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      الملخص التنفيذي لتقرير الموارد البشرية (EEC)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      مؤشرات الأداء الرئيسية المحدثة لحظياً لعام 2026
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                  <span className="text-slate-500 dark:text-slate-400 block">
                    إجمالي القوة العاملة
                  </span>
                  <span className="text-xl font-black text-purple-900 dark:text-purple-200 tabular-nums">
                    {totalEmployees} موظف
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-slate-500 dark:text-slate-400 block">
                    نسبة الانضباط والحضور
                  </span>
                  <span className="text-xl font-black text-emerald-800 dark:text-emerald-200 tabular-nums">
                    {attendance.rate}%
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <span className="text-slate-500 dark:text-slate-400 block">
                    الإجازات المعتمدة / الإجمالي
                  </span>
                  <span className="text-xl font-black text-blue-900 dark:text-blue-200 tabular-nums">
                    {leaves.approved} / {leaves.totalRequests}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  <span className="text-slate-500 dark:text-slate-400 block">
                    متوسط تقييم الأداء العام
                  </span>
                  <span className="text-xl font-black text-amber-900 dark:text-amber-200 tabular-nums">
                    {performance.averageRating} / 5
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  إغلاق
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dispatch(
                      addToast({
                        title: 'تم تصدير تقرير الموارد البشرية بنجاح',
                        description: `تم إعداد التقرير التنفيذي الشامل لـ ${totalEmployees} موظف وحفظه بنجاح.`,
                        variant: 'info',
                      })
                    );
                    closeModal();
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#5b21b6] hover:bg-[#4c1d95] text-white shadow-md cursor-pointer"
                >
                  تصدير التقرير الكامل
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  Sun,
  Moon,
  FileText,
  GraduationCap,
  Award,
  Briefcase,
  Coins,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  resetToReferenceDefaults,
  setActiveQuickAction,
  setActiveTab,
  toggleTheme,
  updateLeaveStatus,
} from '../store/hrSlice';
import { SIDEBAR_ITEMS } from './Sidebar';

export const SubPagesView: React.FC = () => {
  const dispatch = useAppDispatch();
  const hr = useAppSelector((state) => state.hr);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('الكل');

  const currentNav = SIDEBAR_ITEMS.find((i) => i.id === hr.activeTab);
  const Icon = currentNav?.icon || Building2;

  const filteredEmployees = hr.employeeList.filter((emp) => {
    const matchesSearch =
      emp.name.includes(searchQuery) ||
      emp.role.includes(searchQuery) ||
      emp.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'الكل' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div dir="rtl" className="space-y-4">
      {/* Top Breadcrumb & Return to Dashboard Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-purple-200/80 dark:border-purple-800/60 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-[#5b21b6] dark:text-purple-300 flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#1e1b4b] dark:text-white">
              {currentNav?.label}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              الشركة المصرية الهندسية للمقاولات (EEC) · تزامن مباشر مع لوحة التحكم
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch(setActiveQuickAction('add-employee'))}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5b21b6] hover:bg-[#4c1d95] text-white text-xs font-extrabold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة موظف جديد</span>
          </button>
          <button
            type="button"
            onClick={() => dispatch(setActiveTab('dashboard'))}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 text-purple-900 dark:text-purple-200 text-xs font-extrabold border border-purple-200 dark:border-purple-700 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للوحة التحكم</span>
          </button>
        </div>
      </div>

      {/* 1. EMPLOYEES DIRECTORY VIEW */}
      {(hr.activeTab === 'employees' || hr.activeTab === 'recruitment') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-purple-200/80 dark:border-purple-800/60 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، الكود الوظيفي، أو المسمى الوظيفي..."
                className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
            >
              <option value="الكل">جميع الإدارات ({hr.totalEmployees})</option>
              {Object.keys(hr.departments).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-3 font-bold">الكود</th>
                  <th className="py-3 px-3 font-bold">اسم الموظف</th>
                  <th className="py-3 px-3 font-bold">المسمى الوظيفي</th>
                  <th className="py-3 px-3 font-bold">الإدارة</th>
                  <th className="py-3 px-3 font-bold">المشروع</th>
                  <th className="py-3 px-3 font-bold">الراتب</th>
                  <th className="py-3 px-3 font-bold">التقييم</th>
                  <th className="py-3 px-3 font-bold">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-purple-50/40 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3 font-bold text-purple-700 dark:text-purple-300 tabular-nums">
                      {emp.code}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">
                      {emp.name}
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{emp.role}</td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                      {emp.department}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{emp.project}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white tabular-nums">
                      {emp.salary.toLocaleString('en-US')} ج.م
                    </td>
                    <td className="py-3 px-3 font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                      {emp.rating} / 5
                    </td>
                    <td className="py-3 px-3 font-bold">
                      {emp.status === 'active' && (
                        <span className="text-emerald-600 dark:text-emerald-400">فعال</span>
                      )}
                      {emp.status === 'probation' && (
                        <span className="text-amber-600 dark:text-amber-400">تحت التجربة</span>
                      )}
                      {emp.status === 'transferred' && (
                        <span className="text-purple-600 dark:text-purple-400">منقول حديثاً</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. ORG STRUCTURE VIEW */}
      {hr.activeTab === 'org-structure' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(hr.departments).map(([deptName, count]) => (
            <div
              key={deptName}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-purple-200/80 dark:border-purple-800/60 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {deptName}
                </h3>
                <span className="text-xl font-black text-[#5b21b6] dark:text-purple-300 tabular-nums">
                  {count} موظف
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                نسبة القوة العاملة من الإجمالي:{' '}
                <strong className="text-slate-800 dark:text-slate-200 tabular-nums">
                  {((count / Math.max(1, hr.totalEmployees)) * 100).toFixed(1)}%
                </strong>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 3. LEAVES MANAGEMENT VIEW */}
      {hr.activeTab === 'leaves' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-purple-200/80 dark:border-purple-800/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              سجل طلبات الإجازات ({hr.leaves.totalRequests} إجمالي الطلبات)
            </h3>
            <button
              type="button"
              onClick={() => dispatch(setActiveQuickAction('record-leave'))}
              className="px-4 py-2 rounded-xl bg-[#5b21b6] text-white text-xs font-extrabold cursor-pointer"
            >
              + تسجيل طلب إجازة
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {hr.leaveRequests.map((req) => (
              <div
                key={req.id}
                className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm"
              >
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white">
                    {req.employeeName}{' '}
                    <span className="text-slate-400 font-normal">· {req.department}</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                    نوع الإجازة: {req.type} · المدة: {req.days} أيام · تبدأ في: {req.startDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {req.status === 'pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(updateLeaveStatus({ id: req.id, newStatus: 'approved' }))
                        }
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                      >
                        اعتماد
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(updateLeaveStatus({ id: req.id, newStatus: 'rejected' }))
                        }
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                      >
                        رفض
                      </button>
                    </>
                  ) : req.status === 'approved' ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> معتمدة
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> مرفوضة
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TRAINING VIEW */}
      {hr.activeTab === 'training' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hr.trainingPrograms.map((tr) => (
            <div
              key={tr.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-purple-200/80 dark:border-purple-800/60 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                  {tr.department}
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {tr.status}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {tr.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                المحاضر: {tr.instructor} · تاريخ الانعقاد: {tr.date} · المتدربون: {tr.enrolledCount}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 5. SETTINGS VIEW */}
      {hr.activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-purple-200/80 dark:border-purple-800/60 shadow-xs space-y-5">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            إعدادات النظام والمظهر والتخزين المحلي
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  الوضع الليلي / الفاتح
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  الوضع الحالي: {hr.theme === 'dark' ? 'الوضع الليلي الداكن' : 'الوضع الفاتح'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => dispatch(toggleTheme())}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5b21b6] text-white text-xs font-bold cursor-pointer"
              >
                {hr.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>تبديل المظهر</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  استعادة البيانات المرجعية الأصلية
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  آخر حفظ تلقائي في المتصفح: {hr.lastSavedAt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => dispatch(resetToReferenceDefaults())}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة الضبط</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. OTHER OPERATIONAL TABS (Attendance, Payroll, Performance, Documents, Reports) */}
      {['attendance', 'payroll', 'performance', 'documents', 'reports'].includes(hr.activeTab) && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-purple-200/80 dark:border-purple-800/60 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">إجمالي الموظفين</span>
              <p className="text-2xl font-black text-slate-950 dark:text-white tabular-nums mt-1">
                {hr.totalEmployees}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">أيام الحضور المعتمدة</span>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums mt-1">
                {hr.attendance.presentDays.toLocaleString('en-US')}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">متوسط تقييم الأداء</span>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-300 tabular-nums mt-1">
                {hr.performance.averageRating} / 5
              </p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">معدل الحضور الشهري</span>
              <p className="text-2xl font-black text-blue-700 dark:text-blue-300 tabular-nums mt-1">
                {hr.attendance.rate}%
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => dispatch(setActiveQuickAction('record-attendance'))}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold cursor-pointer"
            >
              تسجيل دفعة حضور جديدة
            </button>
            <button
              type="button"
              onClick={() => dispatch(setActiveQuickAction('issue-payslip'))}
              className="px-4 py-2 rounded-xl bg-[#5b21b6] text-white text-xs font-extrabold cursor-pointer"
            >
              إصدار بيان راتب
            </button>
            <button
              type="button"
              onClick={() => dispatch(setActiveQuickAction('evaluate-performance'))}
              className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-extrabold cursor-pointer"
            >
              إدخال تقييم أداء
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

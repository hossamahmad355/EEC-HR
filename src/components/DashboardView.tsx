import React, { useMemo } from 'react';
import {
  TrendingUp,
  Users,
  User,
  Hourglass,
  ArrowLeftRight,
  LogOut,
  CalendarCheck,
  Building2,
  Briefcase,
  Calendar,
  Plane,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarClock,
  UserPlus,
  FileText,
  GraduationCap,
  Zap,
  ChevronDown,
  BarChart3,
  Download,
  FileSpreadsheet,
  FileDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  addToast,
  setActiveQuickAction,
  setActiveTab,
  setSelectedDepartment,
  setSelectedProject,
  setSelectedYear,
} from '../store/hrSlice';
import { DepartmentName, JobCategoryName } from '../types/hr';
import { WeeklyAttendanceChart } from './WeeklyAttendanceChart';
import { DailyTodoList } from './DailyTodoList';
import { exportHRDataToExcel, exportHRDataToPDF } from '../utils/exportData';

const DEPARTMENT_LIST: DepartmentName[] = [
  'إدارة المشاريع',
  'الإدارة الهندسية',
  'المكتب الفني',
  'الإدارة المالية',
  'المشتريات',
  'الشؤون الإدارية',
  'إدارات أخرى',
];

const PROJECT_OPTIONS = [
  'جميع المشاريع',
  'مشروع أبراج العلمين الجديدة',
  'مشروع العاصمة الإدارية - الحي الحكومي',
  'مشروع محطة معالجة المياه',
  'مشروع المجمع الصناعي بالعين السخنة',
  'مشروع تطوير الموانئ البحرية',
];

const YEAR_OPTIONS = ['2026', '2025', '2024'];

// Helper to draw SVG donut sector path
function describeArc(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngleDeg: number,
  endAngleDeg: number
) {
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180.0;
  const startOuter = {
    x: cx + outerR * Math.cos(toRad(endAngleDeg)),
    y: cy + outerR * Math.sin(toRad(endAngleDeg)),
  };
  const endOuter = {
    x: cx + outerR * Math.cos(toRad(startAngleDeg)),
    y: cy + outerR * Math.sin(toRad(startAngleDeg)),
  };
  const startInner = {
    x: cx + innerR * Math.cos(toRad(endAngleDeg)),
    y: cy + innerR * Math.sin(toRad(endAngleDeg)),
  };
  const endInner = {
    x: cx + innerR * Math.cos(toRad(startAngleDeg)),
    y: cy + innerR * Math.sin(toRad(startAngleDeg)),
  };
  const largeArc = endAngleDeg - startAngleDeg <= 180 ? '0' : '1';

  return [
    'M',
    startOuter.x,
    startOuter.y,
    'A',
    outerR,
    outerR,
    0,
    largeArc,
    0,
    endOuter.x,
    endOuter.y,
    'L',
    endInner.x,
    endInner.y,
    'A',
    innerR,
    innerR,
    0,
    largeArc,
    1,
    startInner.x,
    startInner.y,
    'Z',
  ].join(' ');
}

export const DashboardView: React.FC = () => {
  const dispatch = useAppDispatch();
  const hr = useAppSelector((state) => state.hr);
  const [showExportMenu, setShowExportMenu] = React.useState(false);
  const exportMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportExcel = () => {
    exportHRDataToExcel(hr);
    setShowExportMenu(false);
    dispatch(
      addToast({
        title: 'تم تصدير ملف Excel بنجاح',
        description: `تم تحميل سجل الحضور والانصراف وقائمة المهام اليومية (${hr.todoTasks.length} مهام) بصيغة .xlsx`,
        variant: 'success',
      })
    );
  };

  const handleExportPDF = () => {
    exportHRDataToPDF(hr);
    setShowExportMenu(false);
    dispatch(
      addToast({
        title: 'جاري تصدير تقرير PDF',
        description: 'تم تجهيز سجل الحضور والمهام اليومية بصيغة PDF جاهزة للحفظ والطباعة.',
        variant: 'info',
      })
    );
  };

  const filterScale = useMemo(() => {
    let scale = 1;
    if (hr.selectedYear === '2025') scale *= 0.92;
    if (hr.selectedYear === '2024') scale *= 0.84;

    if (hr.selectedProject !== 'جميع المشاريع') {
      const idx = PROJECT_OPTIONS.indexOf(hr.selectedProject);
      const weights = [1, 0.34, 0.26, 0.16, 0.14, 0.1];
      scale *= weights[idx] || 0.25;
    }

    if (hr.selectedDepartment !== 'جميع الإدارات') {
      const deptCount =
        hr.departments[hr.selectedDepartment as DepartmentName] || 50;
      scale *= deptCount / Math.max(1, hr.totalEmployees);
    }
    return scale;
  }, [
    hr.selectedYear,
    hr.selectedProject,
    hr.selectedDepartment,
    hr.departments,
    hr.totalEmployees,
  ]);

  const isDefaultFilter =
    hr.selectedYear === '2026' &&
    hr.selectedProject === 'جميع المشاريع' &&
    hr.selectedDepartment === 'جميع الإدارات';

  const scaleVal = (val: number) =>
    isDefaultFilter ? val : Math.max(1, Math.round(val * filterScale));

  const totalEmp = scaleVal(hr.totalEmployees);
  const activeEmp = scaleVal(hr.activeEmployees);
  const probationEmp = isDefaultFilter
    ? hr.probationEmployees
    : Math.max(0, totalEmp - activeEmp);
  const transferredEmp = isDefaultFilter
    ? hr.recentlyTransferred
    : Math.max(1, Math.round(hr.recentlyTransferred * filterScale));
  const terminatedEmp = isDefaultFilter
    ? hr.terminatedThisYear
    : Math.max(1, Math.round(hr.terminatedThisYear * filterScale));

  const activePct = ((activeEmp / Math.max(1, totalEmp)) * 100).toFixed(1);
  const probationPct = ((probationEmp / Math.max(1, totalEmp)) * 100).toFixed(1);

  const maleCount = scaleVal(hr.genderDistribution.male);
  const femaleCount = isDefaultFilter
    ? hr.genderDistribution.female
    : Math.max(1, totalEmp - maleCount);
  const malePct = ((maleCount / Math.max(1, maleCount + femaleCount)) * 100).toFixed(1);
  const femalePct = (100 - parseFloat(malePct)).toFixed(1);

  const jobCatConfig: Array<{
    name: JobCategoryName;
    color: string;
    startAngle: number;
    endAngle: number;
  }> = [
    {
      name: 'وظائف إشرافية',
      color: '#eab308',
      startAngle: 0,
      endAngle: 83.16,
    },
    {
      name: 'وظائف فنية',
      color: '#2563eb',
      startAngle: 83.16,
      endAngle: 211.68,
    },
    {
      name: 'وظائف إدارية',
      color: '#16a34a',
      startAngle: 211.68,
      endAngle: 323.64,
    },
    {
      name: 'إدارة عليا',
      color: '#7e22ce',
      startAngle: 323.64,
      endAngle: 360,
    },
  ];

  const legendOrder: Array<{ name: JobCategoryName; badgeClass: string }> = [
    { name: 'إدارة عليا', badgeClass: 'bg-gradient-to-b from-purple-500 to-purple-800' },
    { name: 'وظائف إشرافية', badgeClass: 'bg-gradient-to-b from-amber-300 to-amber-600' },
    { name: 'وظائف فنية', badgeClass: 'bg-gradient-to-b from-blue-400 to-blue-700' },
    { name: 'وظائف إدارية', badgeClass: 'bg-gradient-to-b from-emerald-400 to-emerald-700' },
  ];

  const maxDeptCount = Math.max(
    ...DEPARTMENT_LIST.map((d) => scaleVal(hr.departments[d] || 0)),
    128
  );

  return (
    <div dir="rtl" className="w-full space-y-3.5 text-right">
      {/* SUB-HEADER BAR: Title on Right, Balanced Filter Dropdowns on Left */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-1.5 py-1">
        {/* Right (Start in RTL): Custom Chart Icon + Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-white/90 dark:bg-purple-950/90 text-[#5b21b6] dark:text-purple-300 flex items-center justify-center shadow-xs border border-purple-200/90 dark:border-purple-800/70">
            <BarChart3 className="w-5 h-5 stroke-[2.4]" />
          </div>
          <h2 className="text-lg sm:text-xl md:text-[22px] font-extrabold text-[#1e1b4b] dark:text-white tracking-tight whitespace-nowrap">
            لوحة تحكم الموارد البشرية
          </h2>
        </div>

        {/* Left (End in RTL): 3 Uniformly Proportioned Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs sm:text-[14px] font-extrabold text-[#1e1b4b] dark:text-slate-200 whitespace-nowrap">
              السنة
            </label>
            <div className="relative w-[115px]">
              <select
                value={hr.selectedYear}
                onChange={(e) => dispatch(setSelectedYear(e.target.value))}
                className="w-full appearance-none bg-gradient-to-b from-white via-[#fcfaff] to-[#efeafc] dark:from-slate-800 dark:to-slate-900 text-[#1e1b4b] dark:text-slate-100 text-xs sm:text-[13.5px] font-extrabold rounded-xl pl-7 pr-3.5 py-1.5 border border-purple-300/80 dark:border-purple-800/80 shadow-2xs hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-center tabular-nums transition-colors"
              >
                {YEAR_OPTIONS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#5b21b6] dark:text-purple-300 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
            </div>
          </div>

          {/* Project Filter (Controlled width with truncation so long project names never stretch the bar) */}
          <div className="flex items-center gap-2">
            <label className="text-xs sm:text-[14px] font-extrabold text-[#1e1b4b] dark:text-slate-200 whitespace-nowrap">
              المشروع
            </label>
            <div className="relative w-[155px] sm:w-[165px]">
              <select
                value={hr.selectedProject}
                onChange={(e) => dispatch(setSelectedProject(e.target.value))}
                className="w-full truncate appearance-none bg-gradient-to-b from-white via-[#fcfaff] to-[#efeafc] dark:from-slate-800 dark:to-slate-900 text-[#1e1b4b] dark:text-slate-100 text-xs sm:text-[13px] font-extrabold rounded-xl pl-7 pr-3.5 py-1.5 border border-purple-300/80 dark:border-purple-800/80 shadow-2xs hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-right transition-colors"
              >
                {PROJECT_OPTIONS.map((proj) => (
                  <option key={proj} value={proj}>
                    {proj}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#5b21b6] dark:text-purple-300 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
            </div>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs sm:text-[14px] font-extrabold text-[#1e1b4b] dark:text-slate-200 whitespace-nowrap">
              الإدارة
            </label>
            <div className="relative w-[150px] sm:w-[160px]">
              <select
                value={hr.selectedDepartment}
                onChange={(e) => dispatch(setSelectedDepartment(e.target.value))}
                className="w-full truncate appearance-none bg-gradient-to-b from-white via-[#fcfaff] to-[#efeafc] dark:from-slate-800 dark:to-slate-900 text-[#1e1b4b] dark:text-slate-100 text-xs sm:text-[13px] font-extrabold rounded-xl pl-7 pr-3.5 py-1.5 border border-purple-300/80 dark:border-purple-800/80 shadow-2xs hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-right transition-colors"
              >
                <option value="جميع الإدارات">جميع الإدارات</option>
                {DEPARTMENT_LIST.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#5b21b6] dark:text-purple-300 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
            </div>
          </div>

          {/* Export Button (تصدير PDF / Excel) */}
          <div className="relative" ref={exportMenuRef}>
            <button
              type="button"
              onClick={() => setShowExportMenu((prev) => !prev)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-l from-[#5b21b6] to-[#6d28d9] hover:from-[#4c1d95] hover:to-[#5b21b6] text-white text-xs sm:text-[13.5px] font-extrabold shadow-sm border border-purple-400/40 transition-all active:scale-98 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4 stroke-[2.4]" />
              <span>تصدير</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  showExportMenu ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  dir="rtl"
                  className="absolute left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-purple-200 dark:border-purple-800/80 p-2 z-40 text-right"
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                      تصدير سجل الحضور والمهام
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      يشمل بيانات الحضور والانصراف وقائمة المهام اليومية
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-extrabold text-slate-800 dark:text-slate-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div className="text-right">
                      <span className="block">تصدير إلى ملف Excel (.xlsx)</span>
                      <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                        جداول الحضور + المهام + الموظفين
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportPDF}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-extrabold text-slate-800 dark:text-slate-100 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors cursor-pointer mt-0.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-[#5b21b6] dark:text-purple-300 flex items-center justify-center shrink-0">
                      <FileDown className="w-4 h-4" />
                    </div>
                    <div className="text-right">
                      <span className="block">تصدير إلى ملف PDF</span>
                      <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                        تقرير رسمي منسق جاهز للطباعة والحفظ
                      </span>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ROW 1: 6 KPI SUMMARY CARDS — Properly contained, zero icon overflow, balanced RTL alignment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Card 1: إجمالي الموظفين */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => dispatch(setActiveTab('employees'))}
          className="overflow-hidden bg-gradient-to-b from-white via-[#fcfaff] to-[#f2edfb] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-2xl px-3 py-3 border border-purple-200/90 dark:border-purple-800/60 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-2.5 cursor-pointer"
        >
          <div className="min-w-0 flex-1 flex flex-col items-center justify-center text-center">
            <p className="w-full truncate text-[12px] xl:text-[12.5px] font-extrabold text-[#1e1b4b] dark:text-slate-200 leading-snug">
              إجمالي الموظفين
            </p>
            <p className="text-2xl xl:text-[26px] font-black text-slate-950 dark:text-white tabular-nums leading-none my-1.5">
              {totalEmp.toLocaleString('en-US')}
            </p>
            <p
              dir="ltr"
              className="text-[11.5px] font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums flex items-center justify-center gap-0.5 leading-none"
            >
              <span>↑</span>
              <span>{hr.totalGrowthPct}%</span>
            </p>
          </div>
          <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-full bg-[#ede4ff] dark:bg-purple-950/90 border border-purple-300/60 dark:border-purple-700/60 text-[#6d28d9] dark:text-purple-300 flex items-center justify-center shrink-0 shadow-2xs">
            <Users className="w-5 h-5 xl:w-6 xl:h-6 stroke-[2]" />
          </div>
        </motion.div>

        {/* Card 2: الموظفين الفعالين */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => dispatch(setActiveTab('employees'))}
          className="overflow-hidden bg-gradient-to-b from-white via-[#fcfaff] to-[#f2edfb] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-2xl px-3 py-3 border border-purple-200/90 dark:border-purple-800/60 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-2.5 cursor-pointer"
        >
          <div className="min-w-0 flex-1 flex flex-col items-center justify-center text-center">
            <p className="w-full truncate text-[12px] xl:text-[12.5px] font-extrabold text-[#1e1b4b] dark:text-slate-200 leading-snug">
              الموظفين الفعالين
            </p>
            <p className="text-2xl xl:text-[26px] font-black text-slate-950 dark:text-white tabular-nums leading-none my-1.5">
              {activeEmp.toLocaleString('en-US')}
            </p>
            <p
              dir="ltr"
              className="text-[11.5px] font-extrabold text-slate-700 dark:text-slate-300 tabular-nums leading-none"
            >
              ({activePct}%)
            </p>
          </div>
          <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-full bg-[#dcfce7] dark:bg-emerald-950/80 border border-emerald-300/70 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
            <User className="w-5 h-5 xl:w-6 xl:h-6 stroke-[2.2]" />
          </div>
        </motion.div>

        {/* Card 3: الموظفين تحت التجربة */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => dispatch(setActiveTab('employees'))}
          className="overflow-hidden bg-gradient-to-b from-white via-[#fcfaff] to-[#f2edfb] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-2xl px-3 py-3 border border-purple-200/90 dark:border-purple-800/60 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-2.5 cursor-pointer"
        >
          <div className="min-w-0 flex-1 flex flex-col items-center justify-center text-center">
            <p className="w-full truncate text-[11.5px] xl:text-[12px] font-extrabold text-[#1e1b4b] dark:text-slate-200 leading-snug">
              الموظفين تحت التجربة
            </p>
            <p className="text-2xl xl:text-[26px] font-black text-slate-950 dark:text-white tabular-nums leading-none my-1.5">
              {probationEmp}
            </p>
            <p
              dir="ltr"
              className="text-[11.5px] font-extrabold text-slate-700 dark:text-slate-300 tabular-nums leading-none"
            >
              ({probationPct}%)
            </p>
          </div>
          <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-full bg-[#fef3c7] dark:bg-amber-950/80 border border-amber-300/70 dark:border-amber-700/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 shadow-2xs">
            <Hourglass className="w-5 h-5 xl:w-6 xl:h-6 stroke-[2]" />
          </div>
        </motion.div>

        {/* Card 4: المنقولون حديثاً */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => dispatch(setActiveTab('org-structure'))}
          className="overflow-hidden bg-gradient-to-b from-white via-[#fcfaff] to-[#f2edfb] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-2xl px-3 py-3 border border-purple-200/90 dark:border-purple-800/60 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-2.5 cursor-pointer"
        >
          <div className="min-w-0 flex-1 flex flex-col items-center justify-center text-center">
            <p className="w-full truncate text-[12px] xl:text-[12.5px] font-extrabold text-[#1e1b4b] dark:text-slate-200 leading-snug">
              المنقولون حديثاً
            </p>
            <p className="text-2xl xl:text-[26px] font-black text-slate-950 dark:text-white tabular-nums leading-none my-1.5">
              {transferredEmp}
            </p>
            <p className="text-[11.5px] font-extrabold text-slate-800 dark:text-slate-300 leading-none">
              هذا الشهر
            </p>
          </div>
          <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-full bg-[#ede4ff] dark:bg-purple-950/90 border border-purple-300/60 dark:border-purple-700/60 text-[#6d28d9] dark:text-purple-300 flex items-center justify-center shrink-0 shadow-2xs">
            <ArrowLeftRight className="w-5 h-5 xl:w-6 xl:h-6 stroke-[2]" />
          </div>
        </motion.div>

        {/* Card 5: المنتهية خدماتهم */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => dispatch(setActiveTab('employees'))}
          className="overflow-hidden bg-gradient-to-b from-white via-[#fcfaff] to-[#f2edfb] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-2xl px-3 py-3 border border-purple-200/90 dark:border-purple-800/60 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-2.5 cursor-pointer"
        >
          <div className="min-w-0 flex-1 flex flex-col items-center justify-center text-center">
            <p className="w-full truncate text-[12px] xl:text-[12.5px] font-extrabold text-[#1e1b4b] dark:text-slate-200 leading-snug">
              المنتهية خدماتهم
            </p>
            <p className="text-2xl xl:text-[26px] font-black text-slate-950 dark:text-white tabular-nums leading-none my-1.5">
              {terminatedEmp}
            </p>
            <p className="text-[11.5px] font-extrabold text-slate-800 dark:text-slate-300 leading-none">
              هذا العام
            </p>
          </div>
          <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-full bg-[#ffe4e6] dark:bg-rose-950/80 border border-rose-300/70 dark:border-rose-700/60 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0 shadow-2xs">
            <LogOut className="w-5 h-5 xl:w-6 xl:h-6 stroke-[2]" />
          </div>
        </motion.div>

        {/* Card 6: معدل الحضور */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => dispatch(setActiveTab('attendance'))}
          className="overflow-hidden bg-gradient-to-b from-white via-[#fcfaff] to-[#f2edfb] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-2xl px-3 py-3 border border-purple-200/90 dark:border-purple-800/60 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-2.5 cursor-pointer"
        >
          <div className="min-w-0 flex-1 flex flex-col items-center justify-center text-center">
            <p className="w-full truncate text-[12px] xl:text-[12.5px] font-extrabold text-[#1e1b4b] dark:text-slate-200 leading-snug">
              معدل الحضور
            </p>
            <p className="text-2xl xl:text-[26px] font-black text-slate-950 dark:text-white tabular-nums leading-none my-1.5">
              {hr.attendance.rate}%
            </p>
            <p
              dir="ltr"
              className="text-[11.5px] font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums flex items-center justify-center gap-0.5 leading-none"
            >
              <span>↑</span>
              <span>{hr.attendance.rateTrend}</span>
            </p>
          </div>
          <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-full bg-[#dcfce7] dark:bg-emerald-950/80 border border-emerald-300/70 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
            <CalendarCheck className="w-5 h-5 xl:w-6 xl:h-6 stroke-[2]" />
          </div>
        </motion.div>
      </div>

      {/* ROW 2: 3 ANALYTICAL CHARTS (RTL Order: Right = Departments, Center = Job Categories, Left = Gender) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Card 1 (Right, 4 cols): توزيع الموظفين حسب الإدارات */}
        <div className="lg:col-span-4 bg-gradient-to-b from-white to-[#f6f3fd] dark:from-slate-900 dark:to-slate-900/90 rounded-2xl p-4 border border-purple-200/80 dark:border-purple-800/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-purple-100 dark:border-slate-800">
              <h3 className="text-base sm:text-[17px] font-extrabold text-[#1e1b4b] dark:text-white">
                توزيع الموظفين حسب الإدارات
              </h3>
              <Building2 className="w-6 h-6 text-[#5b21b6] dark:text-purple-400 stroke-[2]" />
            </div>

            <div className="space-y-2.5">
              {DEPARTMENT_LIST.map((dept, index) => {
                const count = scaleVal(hr.departments[dept] || 0);
                const widthPct = Math.min(100, Math.round((count / maxDeptCount) * 100));
                const isSelected = hr.selectedDepartment === dept;
                return (
                  <div
                    key={dept}
                    onClick={() =>
                      dispatch(
                        setSelectedDepartment(
                          hr.selectedDepartment === dept ? 'جميع الإدارات' : dept
                        )
                      )
                    }
                    className={`group flex items-center gap-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-purple-100/70 dark:bg-purple-950/60 px-1.5'
                        : 'hover:bg-purple-50/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {/* Right: Department Label */}
                    <span className="w-[105px] sm:w-[115px] text-right text-xs sm:text-[13.5px] font-bold text-slate-900 dark:text-slate-200 shrink-0 truncate">
                      {dept}
                    </span>

                    {/* Middle: Progress bar filling from Right to Left */}
                    <div className="flex-1 h-4 rounded-md bg-purple-100/70 dark:bg-slate-800 overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPct}%` }}
                        transition={{ duration: 0.45, delay: index * 0.04 }}
                        className="h-full rounded-md bg-gradient-to-l from-[#5b21b6] via-[#6d28d9] to-[#8b5cf6]"
                      />
                    </div>

                    {/* Left: Employee Count */}
                    <span className="w-9 text-left text-xs sm:text-[14px] font-extrabold text-slate-900 dark:text-white tabular-nums shrink-0">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 2 (Center, 5 cols): توزيع الموظفين حسب الفئة الوظيفية */}
        <div className="lg:col-span-5 bg-gradient-to-b from-white to-[#f6f3fd] dark:from-slate-900 dark:to-slate-900/90 rounded-2xl p-4 border border-purple-200/80 dark:border-purple-800/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-purple-100 dark:border-slate-800">
            <h3 className="text-base sm:text-[17px] font-extrabold text-[#1e1b4b] dark:text-white">
              توزيع الموظفين حسب الفئة الوظيفية
            </h3>
            <Briefcase className="w-6 h-6 text-[#5b21b6] dark:text-purple-400 stroke-[2]" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto py-1">
            {/* Right in RTL: Legend List */}
            <div className="flex-1 w-full space-y-3">
              {legendOrder.map((item) => {
                const count = scaleVal(hr.jobCategories[item.name] || 0);
                const pct = ((count / Math.max(1, totalEmp)) * 100).toFixed(1);
                return (
                  <div
                    key={item.name}
                    onClick={() => dispatch(setActiveTab('employees'))}
                    className="flex items-center justify-between gap-2 px-2 py-1 rounded-xl hover:bg-purple-50/70 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-4 h-4 rounded-sm shadow-2xs shrink-0 ${item.badgeClass}`}
                      />
                      <span className="text-xs sm:text-[14px] font-extrabold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {item.name}
                      </span>
                    </div>
                    <div
                      dir="ltr"
                      className="text-xs sm:text-[14px] font-extrabold text-slate-900 dark:text-white tabular-nums whitespace-nowrap"
                    >
                      <span>{count}</span>{' '}
                      <span className="text-slate-600 dark:text-slate-400 font-bold">
                        ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Left in RTL: Donut Chart */}
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xs">
                {jobCatConfig.map((seg) => {
                  const pathData = describeArc(
                    100,
                    100,
                    88,
                    50,
                    seg.startAngle + 1,
                    seg.endAngle - 1
                  );
                  const midAngle = ((seg.startAngle + seg.endAngle) / 2 - 90) * (Math.PI / 180);
                  const labelR = 69;
                  const lx = 100 + labelR * Math.cos(midAngle);
                  const ly = 100 + labelR * Math.sin(midAngle);
                  const countVal = scaleVal(hr.jobCategories[seg.name] || 0);
                  const pctVal = ((countVal / Math.max(1, totalEmp)) * 100).toFixed(1);

                  return (
                    <g key={seg.name}>
                      <path
                        d={pathData}
                        fill={seg.color}
                        className="transition-opacity hover:opacity-90 cursor-pointer"
                        onClick={() => dispatch(setActiveTab('employees'))}
                      />
                      <text
                        x={lx}
                        y={ly + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11.5"
                        fontWeight="800"
                        className="pointer-events-none tabular-nums"
                      >
                        {pctVal}%
                      </text>
                    </g>
                  );
                })}
                <circle
                  cx="100"
                  cy="100"
                  r="47"
                  className="fill-white dark:fill-slate-900"
                />
              </svg>

              {/* Center Total Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-none">
                  إجمالي
                </span>
                <span className="text-2xl font-black text-slate-950 dark:text-white tabular-nums leading-tight my-0.5">
                  {totalEmp}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-none">
                  موظف
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 (Left, 3 cols): التوزيع حسب الجنس */}
        <div className="lg:col-span-3 bg-gradient-to-b from-white to-[#f6f3fd] dark:from-slate-900 dark:to-slate-900/90 rounded-2xl p-4 border border-purple-200/80 dark:border-purple-800/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-purple-100 dark:border-slate-800">
            <h3 className="text-base sm:text-[17px] font-extrabold text-[#1e1b4b] dark:text-white">
              التوزيع حسب الجنس
            </h3>
            <Users className="w-6 h-6 text-[#5b21b6] dark:text-purple-400 stroke-[2]" />
          </div>

          {/* Male & Female Sub-Cards in RTL */}
          <div className="grid grid-cols-2 gap-2.5 my-auto">
            {/* Male Sub-Card (Right in RTL) */}
            <div className="rounded-2xl bg-[#e8f1ff] dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/50 p-3 flex items-center justify-between gap-1.5">
              <div className="text-center flex-1">
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-blue-200">
                  ذكور
                </p>
                <p className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tabular-nums leading-tight">
                  {maleCount}
                </p>
                <p
                  dir="ltr"
                  className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-blue-300 tabular-nums"
                >
                  ({malePct}%)
                </p>
              </div>
              <svg viewBox="0 0 64 64" className="w-12 h-12 shrink-0">
                <circle cx="32" cy="18" r="11" fill="#1d7dfa" />
                <path
                  d="M12,56 C12,41 20,33 32,33 C44,33 52,41 52,56 Z"
                  fill="#1d7dfa"
                />
                <polygon points="30,34 34,34 35,48 32,52 29,48" fill="#ffffff" />
              </svg>
            </div>

            {/* Female Sub-Card (Left in RTL) */}
            <div className="rounded-2xl bg-[#fce8f4] dark:bg-pink-950/50 border border-pink-200/60 dark:border-pink-800/50 p-3 flex items-center justify-between gap-1.5">
              <div className="text-center flex-1">
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-pink-200">
                  إناث
                </p>
                <p className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tabular-nums leading-tight">
                  {femaleCount}
                </p>
                <p
                  dir="ltr"
                  className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-pink-300 tabular-nums"
                >
                  ({femalePct}%)
                </p>
              </div>
              <svg viewBox="0 0 64 64" className="w-12 h-12 shrink-0">
                <circle cx="32" cy="18" r="11" fill="#ec4899" />
                <path
                  d="M14,56 C15,41 22,33 32,33 C42,33 49,41 50,56 Z"
                  fill="#ec4899"
                />
                <path d="M27,33 L32,41 L37,33 Z" fill="#fce8f4" />
              </svg>
            </div>
          </div>

          {/* Stacked Progress Pill Bar */}
          <div className="mt-3.5 h-7 w-full rounded-xl overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${malePct}%` }}
              className="bg-gradient-to-l from-[#2563eb] to-[#1d7dfa] text-white text-xs font-extrabold flex items-center justify-center tabular-nums transition-all duration-300"
            >
              {malePct}%
            </div>
            <div
              style={{ width: `${femalePct}%` }}
              className="bg-gradient-to-l from-[#ec4899] to-[#f43f5e] text-white text-xs font-extrabold flex items-center justify-center tabular-nums transition-all duration-300"
            >
              {femalePct}%
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: 3 OPERATIONAL & PERFORMANCE CARDS (RTL: Right = Attendance, Center = Leaves, Left = Performance) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Card 1 (Right, 4 cols): الحضور والانصراف (هذا الشهر) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-white to-[#f6f3fd] dark:from-slate-900 dark:to-slate-900/90 rounded-2xl p-4 border border-purple-200/80 dark:border-purple-800/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-purple-100 dark:border-slate-800">
            <h3 className="text-base sm:text-[17px] font-extrabold text-[#1e1b4b] dark:text-white">
              الحضور والانصراف (هذا الشهر)
            </h3>
            <Calendar className="w-6 h-6 text-[#5b21b6] dark:text-purple-400 stroke-[2]" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
            {/* Right in RTL: 4 Attendance Metric Rows */}
            <div className="flex-1 w-full divide-y divide-purple-100 dark:divide-slate-800">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-[13.5px] font-bold text-slate-800 dark:text-slate-200">
                    أيام الحضور
                  </span>
                </div>
                <span className="text-sm sm:text-[15px] font-black text-slate-950 dark:text-white tabular-nums">
                  {scaleVal(hr.attendance.presentDays).toLocaleString('en-US')}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span className="text-xs sm:text-[13.5px] font-bold text-slate-800 dark:text-slate-200">
                    أيام الغياب
                  </span>
                </div>
                <span className="text-sm sm:text-[15px] font-black text-slate-950 dark:text-white tabular-nums">
                  {scaleVal(hr.attendance.absentDays).toLocaleString('en-US')}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="text-xs sm:text-[13.5px] font-bold text-slate-800 dark:text-slate-200">
                    التأخير
                  </span>
                </div>
                <span className="text-sm sm:text-[15px] font-black text-slate-950 dark:text-white tabular-nums">
                  {scaleVal(hr.attendance.lateDays).toLocaleString('en-US')}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="text-xs sm:text-[13.5px] font-bold text-slate-800 dark:text-slate-200">
                    الانصراف المبكر
                  </span>
                </div>
                <span className="text-sm sm:text-[15px] font-black text-slate-950 dark:text-white tabular-nums">
                  {scaleVal(hr.attendance.earlyLeaveDays).toLocaleString('en-US')}
                </span>
              </div>
            </div>

            {/* Left in RTL: Circular Green Ring Gauge */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-emerald-100 dark:text-emerald-950"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={
                    2 * Math.PI * 48 * (1 - Math.min(100, hr.attendance.rate) / 100)
                  }
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-950 dark:text-white tabular-nums">
                  {hr.attendance.rate}%
                </span>
                <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mt-0.5">
                  معدل الحضور
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 (Center, 4 cols): الإجازات */}
        <div className="lg:col-span-4 bg-gradient-to-b from-white to-[#f6f3fd] dark:from-slate-900 dark:to-slate-900/90 rounded-2xl p-4 border border-purple-200/80 dark:border-purple-800/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-purple-100 dark:border-slate-800">
            <h3 className="text-base sm:text-[17px] font-extrabold text-[#1e1b4b] dark:text-white">
              الإجازات
            </h3>
            <Plane className="w-6 h-6 text-[#5b21b6] dark:text-purple-400 stroke-[2]" />
          </div>

          <div className="divide-y divide-purple-100 dark:divide-slate-800 my-auto">
            <div
              onClick={() => dispatch(setActiveTab('leaves'))}
              className="flex items-center justify-between py-2.5 px-2 hover:bg-purple-50/60 dark:hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-5 h-5 text-[#6d28d9] dark:text-purple-400 shrink-0" />
                <span className="text-xs sm:text-[14px] font-extrabold text-slate-900 dark:text-slate-100">
                  إجمالي طلبات الإجازات
                </span>
              </div>
              <span className="text-base sm:text-[17px] font-black text-slate-950 dark:text-white tabular-nums">
                {scaleVal(hr.leaves.totalRequests)}
              </span>
            </div>

            <div
              onClick={() => dispatch(setActiveTab('leaves'))}
              className="flex items-center justify-between py-2.5 px-2 hover:bg-purple-50/60 dark:hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-[14px] font-extrabold text-slate-900 dark:text-slate-100">
                  المعتمدة
                </span>
              </div>
              <span className="text-base sm:text-[17px] font-black text-slate-950 dark:text-white tabular-nums">
                {scaleVal(hr.leaves.approved)}
              </span>
            </div>

            <div
              onClick={() => dispatch(setActiveTab('leaves'))}
              className="flex items-center justify-between py-2.5 px-2 hover:bg-purple-50/60 dark:hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-xs sm:text-[14px] font-extrabold text-slate-900 dark:text-slate-100">
                  قيد المراجعة
                </span>
              </div>
              <span className="text-base sm:text-[17px] font-black text-slate-950 dark:text-white tabular-nums">
                {scaleVal(hr.leaves.pending)}
              </span>
            </div>

            <div
              onClick={() => dispatch(setActiveTab('leaves'))}
              className="flex items-center justify-between py-2.5 px-2 hover:bg-purple-50/60 dark:hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <span className="text-xs sm:text-[14px] font-extrabold text-slate-900 dark:text-slate-100">
                  المرفوضة
                </span>
              </div>
              <span className="text-base sm:text-[17px] font-black text-slate-950 dark:text-white tabular-nums">
                {scaleVal(hr.leaves.rejected)}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3 (Left, 4 cols): تقييم الأداء */}
        <div className="lg:col-span-4 bg-gradient-to-b from-white to-[#f6f3fd] dark:from-slate-900 dark:to-slate-900/90 rounded-2xl p-4 border border-purple-200/80 dark:border-purple-800/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-purple-100 dark:border-slate-800">
            <h3 className="text-base sm:text-[17px] font-extrabold text-[#1e1b4b] dark:text-white">
              تقييم الأداء
            </h3>
            <Star className="w-6 h-6 text-[#5b21b6] dark:text-purple-400 stroke-[2]" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
            {/* Right in RTL: 5 Performance Distribution Rows */}
            <div className="flex-1 w-full divide-y divide-purple-100 dark:divide-slate-800">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs sm:text-[13.5px] font-extrabold text-slate-900 dark:text-slate-100">
                  ممتاز (5)
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold tabular-nums">
                  {hr.performance.excellentPct}%
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs sm:text-[13.5px] font-extrabold text-slate-900 dark:text-slate-100">
                  جيد جداً (4)
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/90 text-blue-800 dark:text-blue-300 text-xs font-extrabold tabular-nums">
                  {hr.performance.veryGoodPct}%
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs sm:text-[13.5px] font-extrabold text-slate-900 dark:text-slate-100">
                  جيد (3)
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/90 text-amber-800 dark:text-amber-300 text-xs font-extrabold tabular-nums">
                  {hr.performance.goodPct}%
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs sm:text-[13.5px] font-extrabold text-slate-900 dark:text-slate-100">
                  مقبول (2)
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/90 text-orange-800 dark:text-orange-300 text-xs font-extrabold tabular-nums">
                  {hr.performance.acceptablePct}%
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs sm:text-[13.5px] font-extrabold text-slate-900 dark:text-slate-100">
                  بحاجة إلى تطوير (1)
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/90 text-rose-800 dark:text-rose-300 text-xs font-extrabold tabular-nums">
                  {hr.performance.needsImprovementPct}%
                </span>
              </div>
            </div>

            {/* Left in RTL: Circular Purple/Gold Ring Gauge (4.3 / 5) */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <defs>
                  <linearGradient id="perfRingGradRtl" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7e22ce" />
                    <stop offset="45%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                </defs>
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-amber-100 dark:text-slate-800"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="url(#perfRingGradRtl)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={
                    2 * Math.PI * 48 * (1 - hr.performance.averageRating / 5)
                  }
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span
                  dir="ltr"
                  className="text-xl font-black text-slate-950 dark:text-white tabular-nums"
                >
                  {hr.performance.averageRating} / 5
                </span>
                <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mt-0.5">
                  متوسط التقييم
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3.5: WEEKLY ATTENDANCE RECHARTS + DAILY TO-DO LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        <div className="lg:col-span-7">
          <WeeklyAttendanceChart filterScale={filterScale} />
        </div>
        <div className="lg:col-span-5">
          <DailyTodoList />
        </div>
      </div>

      {/* ROW 4: BOTTOM QUICK ACTIONS BAR (Right = إجراءات سريعة ⚡, Left = 7 Action Buttons in RTL) */}
      <div className="bg-gradient-to-r from-[#f5f1fd] via-white to-[#f5f1fd] dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900 rounded-2xl p-3 border border-purple-200/90 dark:border-purple-800/60 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        {/* Right Label (Start in RTL): ⚡ إجراءات سريعة */}
        <div className="flex items-center gap-1.5 pr-1 pl-2 shrink-0">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-400 shrink-0" />
          <span className="text-base sm:text-[18px] font-black text-[#1e1b4b] dark:text-amber-300 whitespace-nowrap">
            إجراءات سريعة
          </span>
        </div>

        {/* 7 Action Buttons flowing from Right to Left */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 flex-1">
          <button
            type="button"
            onClick={() => dispatch(setActiveQuickAction('add-employee'))}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-b from-white to-[#f3effc] dark:from-slate-800 dark:to-slate-800/90 hover:from-purple-50 hover:to-purple-100/70 dark:hover:from-purple-950/60 dark:hover:to-purple-900/40 border border-purple-200/90 dark:border-purple-700/70 shadow-2xs transition-all active:scale-98 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#6d28d9] dark:text-purple-400 shrink-0 stroke-[2.3]" />
            <span className="text-xs sm:text-[13.5px] font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
              إضافة موظف جديد
            </span>
          </button>

          <button
            type="button"
            onClick={() => dispatch(setActiveQuickAction('record-leave'))}
            className="flex-1 min-w-[115px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-b from-white to-[#f3effc] dark:from-slate-800 dark:to-slate-800/90 hover:from-purple-50 hover:to-purple-100/70 dark:hover:from-purple-950/60 dark:hover:to-purple-900/40 border border-purple-200/90 dark:border-purple-700/70 shadow-2xs transition-all active:scale-98 cursor-pointer"
          >
            <Plane className="w-4 h-4 text-[#6d28d9] dark:text-purple-400 shrink-0 stroke-[2.3]" />
            <span className="text-xs sm:text-[13.5px] font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
              تسجيل إجازة
            </span>
          </button>

          <button
            type="button"
            onClick={() => dispatch(setActiveQuickAction('record-attendance'))}
            className="flex-1 min-w-[115px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-b from-white to-[#f3effc] dark:from-slate-800 dark:to-slate-800/90 hover:from-purple-50 hover:to-purple-100/70 dark:hover:from-purple-950/60 dark:hover:to-purple-900/40 border border-purple-200/90 dark:border-purple-700/70 shadow-2xs transition-all active:scale-98 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4 text-[#6d28d9] dark:text-purple-400 shrink-0 stroke-[2.3]" />
            <span className="text-xs sm:text-[13.5px] font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
              تسجيل حضور
            </span>
          </button>

          <button
            type="button"
            onClick={() => dispatch(setActiveQuickAction('issue-payslip'))}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-b from-white to-[#f3effc] dark:from-slate-800 dark:to-slate-800/90 hover:from-purple-50 hover:to-purple-100/70 dark:hover:from-purple-950/60 dark:hover:to-purple-900/40 border border-purple-200/90 dark:border-purple-700/70 shadow-2xs transition-all active:scale-98 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#6d28d9] dark:text-purple-400 shrink-0 stroke-[2.3]" />
            <span className="text-xs sm:text-[13.5px] font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
              إصدار بيان راتب
            </span>
          </button>

          <button
            type="button"
            onClick={() => dispatch(setActiveQuickAction('evaluate-performance'))}
            className="flex-1 min-w-[110px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-b from-white to-[#f3effc] dark:from-slate-800 dark:to-slate-800/90 hover:from-purple-50 hover:to-purple-100/70 dark:hover:from-purple-950/60 dark:hover:to-purple-900/40 border border-purple-200/90 dark:border-purple-700/70 shadow-2xs transition-all active:scale-98 cursor-pointer"
          >
            <Star className="w-4 h-4 text-[#6d28d9] dark:text-purple-400 shrink-0 stroke-[2.3]" />
            <span className="text-xs sm:text-[13.5px] font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
              تقييم أداء
            </span>
          </button>

          <button
            type="button"
            onClick={() => dispatch(setActiveQuickAction('register-training'))}
            className="flex-1 min-w-[115px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-b from-white to-[#f3effc] dark:from-slate-800 dark:to-slate-800/90 hover:from-purple-50 hover:to-purple-100/70 dark:hover:from-purple-950/60 dark:hover:to-purple-900/40 border border-purple-200/90 dark:border-purple-700/70 shadow-2xs transition-all active:scale-98 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-[#6d28d9] dark:text-purple-400 shrink-0 stroke-[2.3]" />
            <span className="text-xs sm:text-[13.5px] font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
              تسجيل تدريب
            </span>
          </button>

          <button
            type="button"
            onClick={() => dispatch(setActiveQuickAction('hr-report'))}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-b from-white to-[#f3effc] dark:from-slate-800 dark:to-slate-800/90 hover:from-purple-50 hover:to-purple-100/70 dark:hover:from-purple-950/60 dark:hover:to-purple-900/40 border border-purple-200/90 dark:border-purple-700/70 shadow-2xs transition-all active:scale-98 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-[#6d28d9] dark:text-purple-400 shrink-0 stroke-[2.3]" />
            <span className="text-xs sm:text-[13.5px] font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
              تقرير الموارد البشرية
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

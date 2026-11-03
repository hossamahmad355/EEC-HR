import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { CalendarClock, BarChart2, Activity } from 'lucide-react';
import { useAppSelector } from '../store/store';

interface WeeklyDayPoint {
  day: string;
  attendanceRate: number;
  departureRate: number;
  lateRate: number;
  presentCount: number;
  earlyLeaveCount: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomArabicTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const data: WeeklyDayPoint = payload[0]?.payload;

  return (
    <div
      dir="rtl"
      className="rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 shadow-xl border border-purple-200 dark:border-purple-800 text-right min-w-[200px]"
    >
      <p className="text-xs sm:text-sm font-extrabold text-[#1e1b4b] dark:text-white pb-1.5 mb-2 border-b border-purple-100 dark:border-slate-800">
        يوم {label}
      </p>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#6d28d9]" />
            معدل الحضور:
          </span>
          <span className="font-black text-slate-950 dark:text-white tabular-nums">
            {data.attendanceRate}% ({data.presentCount} موظف)
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            انتظام الانصراف:
          </span>
          <span className="font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
            {data.departureRate}%
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
            تأخير / انصراف مبكر:
          </span>
          <span className="font-black text-amber-600 dark:text-amber-400 tabular-nums">
            {data.lateRate}% ({data.earlyLeaveCount} حالة)
          </span>
        </div>
      </div>
    </div>
  );
};

interface WeeklyAttendanceChartProps {
  filterScale: number;
}

export const WeeklyAttendanceChart: React.FC<WeeklyAttendanceChartProps> = ({
  filterScale,
}) => {
  const { theme, attendance, totalEmployees, selectedDepartment, selectedProject } =
    useAppSelector((state) => state.hr);
  const [chartMode, setChartMode] = useState<'composed' | 'area'>('composed');

  const isDark = theme === 'dark';

  // Generate realistic weekly attendance & departure data synchronized with Redux attendance rate
  const weeklyData: WeeklyDayPoint[] = useMemo(() => {
    const baseRate = attendance.rate; // default 96.4%
    const delta = baseRate - 96.4;
    const scaledTotal = Math.max(12, Math.round(totalEmployees * filterScale));

    const days = [
      { day: 'السبت', attOffset: -0.6, depOffset: -0.9, lateBase: 4.2 },
      { day: 'الأحد', attOffset: 0.8, depOffset: 0.5, lateBase: 2.8 },
      { day: 'الإثنين', attOffset: 1.1, depOffset: 0.9, lateBase: 2.4 },
      { day: 'الثلاثاء', attOffset: 0.5, depOffset: 0.3, lateBase: 3.1 },
      { day: 'الأربعاء', attOffset: -0.2, depOffset: -0.4, lateBase: 3.6 },
      { day: 'الخميس', attOffset: -1.4, depOffset: -2.1, lateBase: 5.4 },
    ];

    return days.map((d) => {
      const attRate = Number(
        Math.min(99.8, Math.max(82, baseRate + d.attOffset)).toFixed(1)
      );
      const depRate = Number(
        Math.min(99.5, Math.max(80, baseRate - 1.2 + d.depOffset + delta * 0.5)).toFixed(1)
      );
      const lateRate = Number(
        Math.max(0.8, (100 - depRate) * 0.65).toFixed(1)
      );
      const presentCount = Math.round((scaledTotal * attRate) / 100);
      const earlyLeaveCount = Math.max(1, Math.round((scaledTotal * lateRate) / 100));

      return {
        day: d.day,
        attendanceRate: attRate,
        departureRate: depRate,
        lateRate,
        presentCount,
        earlyLeaveCount,
      };
    });
  }, [attendance.rate, totalEmployees, filterScale]);

  const weeklyAvgDeparture = useMemo(() => {
    const sum = weeklyData.reduce((acc, item) => acc + item.departureRate, 0);
    return (sum / weeklyData.length).toFixed(1);
  }, [weeklyData]);

  return (
    <div
      dir="rtl"
      className="bg-gradient-to-b from-white to-[#f6f3fd] dark:from-slate-900 dark:to-slate-900/90 rounded-2xl p-4 border border-purple-200/80 dark:border-purple-800/60 shadow-xs"
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-purple-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-[#5b21b6] dark:text-purple-300 flex items-center justify-center border border-purple-200/70 dark:border-purple-800/60">
            <CalendarClock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-[16.5px] font-extrabold text-[#1e1b4b] dark:text-white">
              معدلات الحضور والانصراف الأسبوعية للموظفين
            </h3>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400">
              متابعة يومية لنسب الحضور في الموعد وانتظام الانصراف ({selectedDepartment} · {selectedProject})
            </p>
          </div>
        </div>

        {/* Right/Left Controls: Legend & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Custom Legend Indicators */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#6d28d9]" />
              <span className="text-slate-700 dark:text-slate-300">
                معدل الحضور ({attendance.rate}%)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500" />
              <span className="text-slate-700 dark:text-slate-300">
                انتظام الانصراف ({weeklyAvgDeparture}%)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-700 dark:text-slate-300">
                التأخير والانصراف المبكر
              </span>
            </div>
          </div>

          {/* Chart Style Switcher (Composed vs Area) */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-purple-100/70 dark:bg-slate-800 border border-purple-200/70 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setChartMode('composed')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                chartMode === 'composed'
                  ? 'bg-white dark:bg-slate-900 text-[#5b21b6] dark:text-purple-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>أعمدة ومؤشر</span>
            </button>
            <button
              type="button"
              onClick={() => setChartMode('area')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                chartMode === 'area'
                  ? 'bg-white dark:bg-slate-900 text-[#5b21b6] dark:text-purple-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>منحنى مساحي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recharts Viewport */}
      <div dir="ltr" className="w-full h-[230px] sm:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'composed' ? (
            <ComposedChart
              data={weeklyData}
              margin={{ top: 10, right: 16, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="purpleBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#4c1d95" />
                </linearGradient>
                <linearGradient id="emeraldBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? '#1e293b' : '#ede9fe'}
              />
              <XAxis
                dataKey="day"
                reversed
                tick={{
                  fill: isDark ? '#cbd5e1' : '#1e1b4b',
                  fontSize: 12,
                  fontWeight: 700,
                }}
                axisLine={{ stroke: isDark ? '#334155' : '#ddd6fe' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                domain={[80, 100]}
                unit="%"
                tick={{
                  fill: isDark ? '#94a3b8' : '#475569',
                  fontSize: 11,
                  fontWeight: 700,
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 15]}
                unit="%"
                tick={{
                  fill: isDark ? '#fbbf24' : '#d97706',
                  fontSize: 11,
                  fontWeight: 700,
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomArabicTooltip />} />
              <Bar
                yAxisId="left"
                dataKey="attendanceRate"
                name="معدل الحضور"
                fill="url(#purpleBarGrad)"
                radius={[8, 8, 0, 0]}
                barSize={26}
              />
              <Bar
                yAxisId="left"
                dataKey="departureRate"
                name="انتظام الانصراف"
                fill="url(#emeraldBarGrad)"
                radius={[8, 8, 0, 0]}
                barSize={26}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="lateRate"
                name="التأخير والانصراف المبكر"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4.5, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          ) : (
            <AreaChart
              data={weeklyData}
              margin={{ top: 10, right: 16, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="attAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.04} />
                </linearGradient>
                <linearGradient id="depAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? '#1e293b' : '#ede9fe'}
              />
              <XAxis
                dataKey="day"
                reversed
                tick={{
                  fill: isDark ? '#cbd5e1' : '#1e1b4b',
                  fontSize: 12,
                  fontWeight: 700,
                }}
                axisLine={{ stroke: isDark ? '#334155' : '#ddd6fe' }}
                tickLine={false}
              />
              <YAxis
                domain={[80, 100]}
                unit="%"
                tick={{
                  fill: isDark ? '#94a3b8' : '#475569',
                  fontSize: 11,
                  fontWeight: 700,
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomArabicTooltip />} />
              <Area
                type="monotone"
                dataKey="attendanceRate"
                name="معدل الحضور"
                stroke="#6d28d9"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#attAreaGrad)"
              />
              <Area
                type="monotone"
                dataKey="departureRate"
                name="انتظام الانصراف"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#depAreaGrad)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Home,
  Network,
  Users,
  CalendarCheck2,
  Plane,
  Coins,
  TrendingUp,
  GraduationCap,
  UserSearch,
  FileText,
  BarChart3,
  Settings,
  ArrowLeft,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavigationTab } from '../types/hr';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setActiveTab } from '../store/hrSlice';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.FC<{ className?: string }>;
}

export const SIDEBAR_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
  { id: 'org-structure', label: 'الهيكل التنظيمي', icon: Network },
  { id: 'employees', label: 'الموظفون', icon: Users },
  { id: 'attendance', label: 'الحضور والانصراف', icon: CalendarCheck2 },
  { id: 'leaves', label: 'الإجازات', icon: Plane },
  { id: 'payroll', label: 'المرتبات', icon: Coins },
  { id: 'performance', label: 'التقييم والأداء', icon: TrendingUp },
  { id: 'training', label: 'التدريب والتطوير', icon: GraduationCap },
  { id: 'recruitment', label: 'التوظيف', icon: UserSearch },
  { id: 'documents', label: 'المستندات', icon: FileText },
  { id: 'reports', label: 'التقارير', icon: BarChart3 },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.hr.activeTab);

  const handleSelect = (id: NavigationTab) => {
    dispatch(setActiveTab(id));
    onCloseMobile();
  };

  const renderSidebarContent = () => (
    <div
      dir="rtl"
      className="flex flex-col justify-between h-full w-full px-3 pt-4 pb-4 select-none text-white"
    >
      {/* Top 12 Navigation Items in RTL (Icon on Right, Label on Left/Right) */}
      <nav className="space-y-0.5">
        {SIDEBAR_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <React.Fragment key={item.id}>
              <button
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`group relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-l from-[#fef08a] via-[#f9d978] to-[#f6c453] text-[#2d1259] font-extrabold shadow-md'
                    : 'text-white/90 hover:text-white hover:bg-white/10 font-semibold'
                }`}
              >
                <span
                  className={`text-[14.5px] leading-snug tracking-tight whitespace-nowrap ${
                    isActive ? 'font-extrabold text-[#260e4c]' : 'font-semibold'
                  }`}
                >
                  {item.label}
                </span>
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? 'text-[#3c1874] stroke-[2.3]' : 'text-purple-100/90'
                  }`}
                />
              </button>
              {idx < SIDEBAR_ITEMS.length - 1 && !isActive && (
                <div className="mx-2 border-b border-white/10" />
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Bottom Portal Return Button ("العودة إلى البوابة <-") */}
      <div className="pt-4 mt-2">
        <button
          type="button"
          onClick={() => handleSelect('dashboard')}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-gradient-to-l from-[#4e2a8e] to-[#3b206e] hover:from-[#5e34a8] hover:to-[#492885] border border-purple-300/40 shadow-inner text-white transition-all active:scale-98 cursor-pointer group"
        >
          <span className="text-xs sm:text-[13.5px] font-bold tracking-tight">
            العودة إلى البوابة
          </span>
          <ArrowLeft className="w-4 h-4 text-purple-200 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Right Sidebar (RTL) */}
      <aside className="hidden lg:flex w-[212px] xl:w-[224px] shrink-0 bg-gradient-to-b from-[#3d1e73] via-[#2e165b] to-[#210d41] dark:from-[#180b33] dark:via-[#130829] dark:to-[#0c051c] flex-col justify-between min-h-[calc(100vh-82px)]">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Right Drawer Sidebar (RTL) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
              onClick={onCloseMobile}
            />
            <motion.aside
              initial={{ x: 260 }}
              animate={{ x: 0 }}
              exit={{ x: 260 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-[250px] z-50 bg-gradient-to-b from-[#3d1e73] via-[#2e165b] to-[#210d41] shadow-2xl lg:hidden flex flex-col"
            >
              <div
                dir="rtl"
                className="flex items-center justify-between px-4 py-3 border-b border-white/15"
              >
                <span className="text-sm font-bold text-amber-300">القائمة الرئيسية</span>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{renderSidebarContent()}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

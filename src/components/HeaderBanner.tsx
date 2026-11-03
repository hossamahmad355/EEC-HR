import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  HelpCircle,
  ChevronDown,
  Sun,
  Moon,
  CheckCheck,
  RotateCcw,
  Menu,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  markAllNotificationsRead,
  resetToReferenceDefaults,
  setActiveTab,
  toggleTheme,
} from '../store/hrSlice';

interface HeaderBannerProps {
  onToggleMobileMenu: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({ onToggleMobileMenu }) => {
  const dispatch = useAppDispatch();
  const { theme, notifications, lastSavedAt } = useAppSelector((state) => state.hr);

  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header
        dir="rtl"
        className="relative w-full h-auto min-h-[82px] bg-gradient-to-l from-[#2c1654] via-[#432375] to-[#e9e4f8] dark:from-[#160b2e] dark:via-[#231247] dark:to-[#1e1b38] overflow-visible select-none border-b border-purple-300/30 dark:border-purple-900/50 z-30"
      >
        {/* Background Construction Skyline & Golden S-Curve SVG (Flipped horizontally for RTL) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg
            viewBox="0 0 1440 96"
            preserveAspectRatio="none"
            className="w-full h-full -scale-x-100"
          >
            <defs>
              <linearGradient id="leftPurpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={theme === 'dark' ? '#14092b' : '#2a1452'} />
                <stop offset="100%" stopColor={theme === 'dark' ? '#2c1656' : '#4b2784'} />
              </linearGradient>
              <linearGradient id="skySunriseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={theme === 'dark' ? '#3b1f5e' : '#7b52ab'} stopOpacity="0.85" />
                <stop offset="28%" stopColor={theme === 'dark' ? '#5c346e' : '#f6ad7b'} stopOpacity="0.75" />
                <stop offset="55%" stopColor={theme === 'dark' ? '#2e2252' : '#dcd2f5'} stopOpacity="0.9" />
                <stop offset="100%" stopColor={theme === 'dark' ? '#191433' : '#ece7fa'} stopOpacity="1" />
              </linearGradient>
              <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme === 'dark' ? '#eab308' : '#7c2d12'} stopOpacity="0.85" />
                <stop offset="100%" stopColor={theme === 'dark' ? '#78350f' : '#431407'} stopOpacity="0.95" />
              </linearGradient>
            </defs>

            <rect x="400" y="0" width="1040" height="96" fill="url(#skySunriseGrad)" />

            <circle
              cx="670"
              cy="68"
              r="55"
              fill={theme === 'dark' ? '#f59e0b' : '#fef08a'}
              opacity={theme === 'dark' ? '0.22' : '0.65'}
            />

            <g opacity={theme === 'dark' ? '0.55' : '0.82'}>
              <rect x="520" y="42" width="28" height="54" fill="#6b4c7b" opacity="0.45" />
              <rect x="552" y="34" width="35" height="62" fill="#5b3e6e" opacity="0.55" />
              <rect x="745" y="45" width="32" height="51" fill="#7c5889" opacity="0.4" />
              <rect x="782" y="55" width="25" height="41" fill="#8b6b99" opacity="0.35" />

              <rect x="595" y="28" width="44" height="68" fill="url(#buildingGrad)" />
              {[34, 42, 50, 58, 66, 74, 82].map((y) => (
                <line
                  key={y}
                  x1="597"
                  y1={y}
                  x2="637"
                  y2={y}
                  stroke="#fde68a"
                  strokeWidth="1.2"
                  opacity="0.55"
                />
              ))}
              {[605, 615, 625].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="28"
                  x2={x}
                  y2="96"
                  stroke="#fde68a"
                  strokeWidth="1"
                  opacity="0.4"
                />
              ))}

              <rect x="655" y="22" width="52" height="74" fill="url(#buildingGrad)" />
              {[28, 36, 44, 52, 60, 68, 76, 84].map((y) => (
                <line
                  key={y}
                  x1="658"
                  y1={y}
                  x2="704"
                  y2={y}
                  stroke="#fef08a"
                  strokeWidth="1.3"
                  opacity="0.6"
                />
              ))}
              {[668, 681, 694].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="22"
                  x2={x}
                  y2="96"
                  stroke="#fef08a"
                  strokeWidth="1"
                  opacity="0.4"
                />
              ))}

              <line x1="572" y1="8" x2="572" y2="96" stroke="#d97706" strokeWidth="2.5" />
              <line x1="530" y1="14" x2="635" y2="14" stroke="#d97706" strokeWidth="2.2" />
              <line x1="572" y1="6" x2="545" y2="14" stroke="#f59e0b" strokeWidth="1.2" />
              <line x1="572" y1="6" x2="615" y2="14" stroke="#f59e0b" strokeWidth="1.2" />
              <line x1="620" y1="14" x2="620" y2="32" stroke="#b45309" strokeWidth="1.2" />

              <line x1="718" y1="5" x2="718" y2="96" stroke="#d97706" strokeWidth="2.8" />
              <line x1="665" y1="11" x2="785" y2="11" stroke="#d97706" strokeWidth="2.2" />
              <line x1="718" y1="3" x2="685" y2="11" stroke="#f59e0b" strokeWidth="1.2" />
              <line x1="718" y1="3" x2="765" y2="11" stroke="#f59e0b" strokeWidth="1.2" />
              <line x1="762" y1="11" x2="762" y2="29" stroke="#b45309" strokeWidth="1.2" />

              <line x1="815" y1="22" x2="815" y2="96" stroke="#d97706" strokeWidth="1.8" opacity="0.7" />
              <line x1="785" y1="26" x2="855" y2="26" stroke="#d97706" strokeWidth="1.5" opacity="0.7" />
            </g>

            <path
              d="M 0,0 L 495,0 C 460,32 455,68 415,96 L 0,96 Z"
              fill="url(#leftPurpleGrad)"
            />

            <path
              d="M 490,0 C 455,32 450,68 408,96 L 424,96 C 466,68 472,32 508,0 Z"
              fill="url(#goldRibbon)"
            />
            <path
              d="M 508,0 C 472,32 466,68 424,96 L 432,96 C 474,68 480,32 516,0 Z"
              fill="#7e22ce"
              opacity="0.45"
            />
          </svg>
        </div>

        {/* Foreground Header Content in RTL (Right = Brand, Left = HR Title & Controls) */}
        <div className="relative z-10 max-w-[1920px] mx-auto px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 min-h-[82px]">
          {/* RIGHT ZONE (Start in RTL): EEC Circular Logo + Company Name */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="القائمة الجانبية"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* EEC Circular Emblem */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center shrink-0 ring-2 ring-purple-300/50">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="47"
                  fill="#ffffff"
                  stroke="#1e1b4b"
                  strokeWidth="2.5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  fill="none"
                  stroke="#1e1b4b"
                  strokeWidth="1.5"
                />
                <g fill="#1e1b4b">
                  <rect x="33" y="42" width="7" height="22" rx="1" />
                  <rect x="42" y="32" width="8" height="32" rx="1" />
                  <rect x="52" y="37" width="7" height="27" rx="1" />
                  <rect x="61" y="46" width="6" height="18" rx="1" />
                  <line x1="46" y1="35" x2="46" y2="62" stroke="#ffffff" strokeWidth="1.2" />
                  <line x1="55.5" y1="40" x2="55.5" y2="62" stroke="#ffffff" strokeWidth="1.2" />
                  <path d="M 28,64 L 72,64" stroke="#1e1b4b" strokeWidth="2.2" />
                </g>
                <text
                  x="50"
                  y="75"
                  textAnchor="middle"
                  fill="#1e1b4b"
                  fontSize="10.5"
                  fontWeight="800"
                  fontFamily="sans-serif"
                >
                  EEC
                </text>
                <path id="topArcRtl" d="M 13,50 A 37,37 0 1,1 87,50" fill="none" />
                <text fontSize="6.2" fontWeight="700" fill="#1e1b4b" textAnchor="middle">
                  <textPath href="#topArcRtl" startOffset="50%">
                    الشركة المصرية الهندسية للمقاولات
                  </textPath>
                </text>
                <path id="bottomArcRtl" d="M 12,54 A 39,39 0 0,0 88,54" fill="none" />
                <text fontSize="5.4" fontWeight="700" fill="#1e1b4b" textAnchor="middle">
                  <textPath href="#bottomArcRtl" startOffset="50%">
                    Egyptian Engineering Co.
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Company Name Text */}
            <div className="text-right">
              <h1 className="text-base sm:text-xl md:text-[22px] font-extrabold text-white tracking-tight leading-snug drop-shadow-sm whitespace-nowrap">
                الشركة المصرية الهندسية للمقاولات
              </h1>
              <p
                dir="ltr"
                className="text-xs sm:text-sm md:text-[15px] font-medium text-purple-100/95 tracking-wide whitespace-nowrap text-right"
              >
                Egyptian Engineering Company (EEC)
              </p>
            </div>
          </div>

          {/* LEFT ZONE (End in RTL): HR Title + Golden People Icon + Notifications + Help + Theme + User Pill */}
          <div className="flex items-center gap-2.5 sm:gap-4 mr-auto">
            {/* HR Department Title & Golden Emblem */}
            <div className="hidden xl:flex items-center gap-3">
              <div className="text-right">
                <h2 className="text-xl md:text-[25px] font-extrabold bg-gradient-to-l from-[#3b1c71] via-[#5b21b6] to-[#4c1d95] dark:from-purple-200 dark:via-amber-200 dark:to-white bg-clip-text text-transparent leading-tight">
                  إدارة الموارد البشرية
                </h2>
                <p
                  dir="ltr"
                  className="text-xs md:text-[13.5px] font-bold text-[#1e1b4b] dark:text-purple-200 tracking-tight leading-tight text-right"
                >
                  Human Resources Management
                </p>
              </div>

              {/* Golden 3-People Emblem */}
              <div className="w-12 h-11 flex items-center justify-center shrink-0 drop-shadow-sm">
                <svg viewBox="0 0 64 52" className="w-12 h-11">
                  <defs>
                    <linearGradient id="goldPeopleRtl" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="55%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#92400e" />
                    </linearGradient>
                    <linearGradient id="goldPeopleLightRtl" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fde68a" />
                      <stop offset="60%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                  </defs>
                  <circle cx="16" cy="18" r="7" fill="url(#goldPeopleRtl)" />
                  <path
                    d="M4,42 C4,33 10,28 16,28 C22,28 28,33 28,42 Z"
                    fill="url(#goldPeopleRtl)"
                  />
                  <circle cx="48" cy="18" r="7" fill="url(#goldPeopleRtl)" />
                  <path
                    d="M36,42 C36,33 42,28 48,28 C54,28 60,33 60,42 Z"
                    fill="url(#goldPeopleRtl)"
                  />
                  <circle cx="32" cy="14" r="8.5" fill="url(#goldPeopleLightRtl)" />
                  <path
                    d="M17,46 C17,34 23.5,28 32,28 C40.5,28 47,34 47,46 Z"
                    fill="url(#goldPeopleLightRtl)"
                  />
                </svg>
              </div>
            </div>

            {/* Action Icons Bar */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Theme Switcher Button (Light / Dark) */}
              <button
                type="button"
                onClick={() => dispatch(toggleTheme())}
                title={theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الليلي'}
                className="relative w-9 h-9 rounded-full bg-white/80 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-[#4c1d95] dark:text-amber-300 shadow-sm border border-purple-300/60 dark:border-purple-700 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-[#4c1d95]" />
                )}
              </button>

              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setShowNotifs((prev) => !prev)}
                  className="relative w-9 h-9 rounded-full bg-white/80 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-[#5b21b6] dark:text-purple-300 shadow-sm border border-purple-300/60 dark:border-purple-700 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                  title="الإشعارات"
                >
                  <Bell className="w-5 h-5 fill-[#5b21b6] dark:fill-purple-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 text-[9px] font-bold text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div
                    dir="rtl"
                    className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-purple-200 dark:border-purple-800/80 p-4 z-50 text-right"
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        الإشعارات والتنبيهات ({unreadCount} غير مقروء)
                      </span>
                      <button
                        type="button"
                        onClick={() => dispatch(markAllNotificationsRead())}
                        className="text-xs font-semibold text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        تحديد الكل كمقروء
                      </button>
                    </div>
                    <div className="space-y-2.5 max-h-64 overflow-y-auto">
                      {notifications.map((item) => (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-xl border text-right transition-colors ${
                            item.read
                              ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              : 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60 text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          <p className="text-xs font-semibold leading-relaxed">{item.title}</p>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>الحفظ التلقائي مفعل (آخر حفظ: {lastSavedAt})</span>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(resetToReferenceDefaults());
                          setShowNotifs(false);
                        }}
                        className="text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        استعادة القيم الأصلية
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Help Icon */}
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="w-8 h-8 rounded-full bg-[#4c2882] hover:bg-[#3b1c71] text-white flex items-center justify-center shadow-sm transition-transform active:scale-95 cursor-pointer"
                title="دليل النظام والمساعدة"
              >
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* User Profile Pill Dropdown ("مدير الموارد البشرية") */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="flex items-center gap-2 pr-2 pl-3 py-1.5 rounded-full bg-gradient-to-l from-[#4a257d] to-[#6838a8] hover:from-[#3d1d6b] hover:to-[#5b2d99] text-white shadow-md border border-white/40 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-white text-[#4a257d] flex items-center justify-center shadow-inner shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
                    مدير الموارد البشرية
                  </span>
                  <ChevronDown className="w-4 h-4 opacity-90 shrink-0" />
                </button>

                {showProfileMenu && (
                  <div
                    dir="rtl"
                    className="absolute left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-purple-200 dark:border-purple-800/80 p-3 z-50 text-right"
                  >
                    <div className="pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        م. طارق عبد العزيز
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        مدير قطاع الموارد البشرية · EEC
                      </p>
                    </div>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(setActiveTab('settings'));
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-right px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors cursor-pointer"
                      >
                        إعدادات الحساب والصلاحيات
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(setActiveTab('reports'));
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-right px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors cursor-pointer"
                      >
                        التقارير التنفيذية الشهرية
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(resetToReferenceDefaults());
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-right px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        إعادة ضبط البيانات الافتراضية
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {showHelpModal && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    بوابة إدارة الموارد البشرية - EEC
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    الإصدار المؤسسي المتكامل لعام 2026
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                إغلاق
              </button>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/50 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-700 dark:text-purple-400 shrink-0 mt-0.5" />
                <p>
                  <strong>تزامن فوري وحفظ تلقائي:</strong> جميع العمليات (إضافة موظف، اعتماد إجازة، تسجيل حضور، أو تغيير الفلاتر) يتم تحديثها لحظياً عبر Redux Toolkit وحفظها تلقائياً في المتصفح.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/50 flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>تنسيق عربي متكامل (RTL):</strong> الواجهة مصممة بالكامل من اليمين إلى اليسار مع دعم الوضع الليلي والفاتح.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

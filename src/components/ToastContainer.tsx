import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { removeToast } from '../store/hrSlice';
import { ToastItem } from '../types/hr';

const SingleToast: React.FC<{ item: ToastItem }> = ({ item }) => {
  const dispatch = useAppDispatch();
  const duration = item.duration || 4500;

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(item.id));
    }, duration);
    return () => clearTimeout(timer);
  }, [dispatch, item.id, duration]);

  const variantStyles = {
    success: {
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200/90 dark:border-emerald-800/80',
      bar: 'bg-gradient-to-l from-emerald-500 to-teal-500',
      Icon: CheckCircle2,
    },
    info: {
      iconBg: 'bg-purple-100 dark:bg-purple-950/90 text-[#6d28d9] dark:text-purple-300',
      border: 'border-purple-200/90 dark:border-purple-800/80',
      bar: 'bg-gradient-to-l from-[#5b21b6] to-purple-500',
      Icon: Info,
    },
    warning: {
      iconBg: 'bg-amber-100 dark:bg-amber-950/90 text-amber-600 dark:text-amber-400',
      border: 'border-amber-200/90 dark:border-amber-800/80',
      bar: 'bg-gradient-to-l from-amber-500 to-orange-500',
      Icon: AlertTriangle,
    },
  }[item.variant];

  const IconComponent = variantStyles.Icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -40, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      dir="rtl"
      role="status"
      aria-live="polite"
      className={`pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-xl border ${variantStyles.border} text-right`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${variantStyles.iconBg}`}
        >
          <IconComponent className="w-5 h-5 stroke-[2.3]" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
            {item.title}
          </h4>
          <p className="text-[11.5px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch(removeToast(item.id))}
          aria-label="إغلاق الإشعار"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Animated Countdown Progress Bar */}
      <div className="absolute bottom-0 right-0 left-0 h-1 bg-slate-100 dark:bg-slate-800">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`h-full ${variantStyles.bar}`}
        />
      </div>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const toasts = useAppSelector((state) => state.hr.toasts);

  return (
    <div
      dir="rtl"
      className="fixed bottom-4 left-4 z-[60] flex flex-col gap-2.5 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <SingleToast key={t.id} item={t} />
        ))}
      </AnimatePresence>
    </div>
  );
};

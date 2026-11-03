/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAppSelector } from './store/store';
import { HeaderBanner } from './components/HeaderBanner';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SubPagesView } from './components/SubPagesView';
import { QuickActionModals } from './components/QuickActionModals';
import { ToastContainer } from './components/ToastContainer';

export default function App() {
  const { theme, activeTab } = useAppSelector((state) => state.hr);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync dark mode class and RTL attributes on <html>
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('dir', 'rtl');
    root.setAttribute('lang', 'ar');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-[#31185f] dark:bg-[#0f0722] text-slate-900 dark:text-slate-100 flex flex-col overflow-x-hidden transition-colors duration-200"
    >
      {/* Top EEC Construction & HR Header Banner (RTL) */}
      <HeaderBanner onToggleMobileMenu={() => setMobileMenuOpen(true)} />

      {/* Main Workspace Frame: Right Purple Sidebar + Left Rounded Lavender/Dark Canvas */}
      <div className="flex-1 flex w-full max-w-[1920px] mx-auto">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area with rounded top-right corner where it meets the RTL sidebar */}
        <main className="flex-1 min-w-0 bg-gradient-to-bl from-[#ede9f8] via-[#e6e0f6] to-[#ded6f4] dark:from-[#131126] dark:via-[#16132d] dark:to-[#110e22] lg:rounded-tr-[28px] p-3 sm:p-4 md:p-5 shadow-2xl border-t border-r border-white/60 dark:border-purple-900/40 transition-colors duration-200">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {activeTab === 'dashboard' ? <DashboardView /> : <SubPagesView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Interactive Modals for the 7 Quick Actions */}
      <QuickActionModals />

      {/* Global Animated Toast Notifications Stack */}
      <ToastContainer />
    </div>
  );
}

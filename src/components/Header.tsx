import React from 'react';
import { Moon, Sun, Smartphone, Monitor, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    isDarkMode,
    toggleDarkMode,
    viewMode,
    setViewMode,
    currentMonth,
    currentYear,
    setMonthYear,
  } = useApp();

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setMonthYear(12, currentYear - 1);
    } else {
      setMonthYear(currentMonth - 1, currentYear);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setMonthYear(1, currentYear + 1);
    } else {
      setMonthYear(currentMonth + 1, currentYear);
    }
  };

  const monthLabel = new Date(currentYear, currentMonth - 1).toLocaleString('default', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <span className="text-base font-black">₹</span>
          </div>
          <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-base">
            Student Expense Tracker
          </span>
        </div>

        {/* Zone 2: Month Selector & Viewport Toggle */}
        <div className="flex items-center gap-2">
          {/* Month Stepper */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-800/70">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-slate-100"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs font-bold text-slate-700 dark:text-slate-200">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-slate-100"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Desktop Preview Mode Toggle (hidden on small mobile screens) */}
          <div className="hidden items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-800/70 md:flex">
            <button
              type="button"
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                viewMode === 'mobile'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Mobile Device Frame View"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('fluid')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                viewMode === 'fluid'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Fluid Full Screen View"
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Full</span>
            </button>
          </div>
        </div>

        {/* Zone 3: Theme Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { X, ShieldCheck, HelpCircle, BookOpen, Target, PiggyBank, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HelpAndPrivacyModal: React.FC = () => {
  const { isHelpModalOpen, setIsHelpModalOpen } = useApp();

  if (!isHelpModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={() => setIsHelpModalOpen(false)}
      />

      {/* Dialog */}
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Help & Student Privacy
              </h3>
              <p className="text-xs text-slate-500">How Student Expense Tracker works</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsHelpModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-slate-600 dark:text-slate-300">
          {/* Privacy */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5 dark:border-emerald-950/40 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              <h4 className="font-bold">100% Offline & Private</h4>
            </div>
            <p className="mt-1 leading-relaxed text-emerald-700 dark:text-emerald-400">
              All records, category budgets, and savings goals reside solely in your device&apos;s local browser storage. No financial data is sent to external servers or advertisers.
            </p>
          </div>

          {/* Budgeting */}
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <Target className="h-4 w-4 text-indigo-600" />
              <h4>Category Budgets & Overall Targets</h4>
            </div>
            <p className="mt-1 leading-relaxed">
              You can set limits for individual categories (like Food, Travel, or Entertainment). When spending reaches your configured warning threshold (e.g. 80%), a badge alerts you before you run out of funds.
            </p>
          </div>

          {/* Daily Spend */}
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <h4>Recommended Daily Spend vs. Strict Limit</h4>
            </div>
            <p className="mt-1 leading-relaxed">
              The daily target tells you how much you can comfortably spend each remaining day of the month without running a deficit. It automatically adjusts whenever you add or edit an expense.
            </p>
          </div>

          {/* Savings */}
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <PiggyBank className="h-4 w-4 text-emerald-600" />
              <h4>Savings Goals Separation</h4>
            </div>
            <p className="mt-1 leading-relaxed">
              Money set aside for goals (exam fees, laptop funds, emergency buffers) is maintained completely separate from ordinary daily expenses so your expense tracking is never double-counted.
            </p>
          </div>

          {/* Integer Paise Arithmetic */}
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <Database className="h-4 w-4 text-amber-600" />
              <h4>Integer Paise Arithmetic</h4>
            </div>
            <p className="mt-1 leading-relaxed">
              All currency figures are represented as integer paise (e.g. ₹150.50 = 15050 paise) under the hood. This eliminates JavaScript floating-point rounding inaccuracies.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-100 pt-3 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setIsHelpModalOpen(false)}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

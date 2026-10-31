import React, { useState } from 'react';
import {
  User,
  Moon,
  Sun,
  Bell,
  Download,
  RotateCcw,
  Trash2,
  Shield,
  HelpCircle,
  Coins,
  Check,
  Building,
  Target,
  FileSpreadsheet,
  Clock,
  Tag,
  Mail,
  PieChart,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportTransactionsToCSV } from '../utils/csvExport';
import { formatRupee, paiseToRupees } from '../utils/calculations';

export const SettingsView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    isDarkMode,
    toggleDarkMode,
    currentBudget,
    setIsBudgetModalOpen,
    setIsCategoryBudgetModalOpen,
    setIsRecurringModalOpen,
    setIsPresetModalOpen,
    setIsHelpModalOpen,
    allExpenses,
    resetDemoData,
    clearAllExpenses,
    showToast,
  } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email || 'student@campus.edu.in');
  const [college, setCollege] = useState(userProfile.college);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, college });
    setIsEditingProfile(false);
  };

  const handleExportCSV = () => {
    const res = exportTransactionsToCSV(allExpenses);
    if (res.success) {
      showToast(`Exported all ${allExpenses.length} transactions to CSV!`);
    } else {
      showToast(res.error || 'Failed to export CSV', 'error');
    }
  };

  const handleResetData = () => {
    if (confirm('Reset to initial sample college student expenses, budgets, and savings goals?')) {
      resetDemoData();
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to delete all transactions and budgets? This cannot be undone.')) {
      clearAllExpenses();
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personalize your student finance tracker
        </p>
      </div>

      {/* Student Profile Card (Priority 6) */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-md shadow-indigo-600/30">
              {userProfile.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {userProfile.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {userProfile.college}
              </p>
              <p className="text-[11px] text-slate-400">
                {userProfile.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Student Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    College / Hostel
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Student Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95"
              >
                <Check className="h-3.5 w-3.5" />
                Save Profile
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Budget & Category Management */}
      <div className="space-y-2 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Budget & Allocations
        </h3>

        {/* Overall Target */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Monthly Target Budget
              </p>
              <p className="text-xs text-slate-500">
                Currently {formatRupee(currentBudget)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsBudgetModalOpen(true)}
            className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Change
          </button>
        </div>

        {/* Category-Specific Budgets */}
        <div className="flex items-center justify-between border-t border-slate-100 py-2 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
              <PieChart className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Category Allocations
              </p>
              <p className="text-xs text-slate-500">Set limits for food, transit, books</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCategoryBudgetModalOpen(true)}
            className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Manage
          </button>
        </div>

        {/* Budget Warning Threshold */}
        <div className="flex items-center justify-between border-t border-slate-100 py-2 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Warning Threshold
              </p>
              <p className="text-xs text-slate-500">Trigger warnings when nearing limit</p>
            </div>
          </div>
          <select
            value={userProfile.warningThresholdPercent}
            onChange={(e) =>
              updateUserProfile({ warningThresholdPercent: parseInt(e.target.value, 10) })
            }
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="70">At 70% used</option>
            <option value="75">At 75% used</option>
            <option value="80">At 80% used</option>
            <option value="85">At 85% used</option>
            <option value="90">At 90% used</option>
          </select>
        </div>
      </div>

      {/* Student Automation & Tools */}
      <div className="space-y-2 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Student Automation & Templates
        </h3>

        {/* Recurring Bills */}
        <button
          type="button"
          onClick={() => setIsRecurringModalOpen(true)}
          className="flex w-full items-center justify-between py-2 text-left hover:opacity-80"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Recurring Campus Expenses
              </p>
              <p className="text-xs text-slate-500">
                Monthly mess fees, hostel rent, recharge reminders
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Open</span>
        </button>

        {/* Custom Presets */}
        <button
          type="button"
          onClick={() => setIsPresetModalOpen(true)}
          className="flex w-full items-center justify-between border-t border-slate-100 py-2 text-left hover:opacity-80 dark:border-slate-800"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Tag className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Customizable Quick-Add Shortcuts
              </p>
              <p className="text-xs text-slate-500">
                Configure 1-tap buttons for common items
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Edit</span>
        </button>
      </div>

      {/* App Display & Theme */}
      <div className="space-y-2 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Appearance & Theme
        </h3>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Dark Mode
              </p>
              <p className="text-xs text-slate-500">Night theme for low-light studying</p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Data Management & Export */}
      <div className="space-y-2 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Data Management
        </h3>

        {/* CSV Export */}
        <button
          type="button"
          onClick={handleExportCSV}
          className="flex w-full items-center justify-between py-2 text-left hover:opacity-80"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Export to CSV
              </p>
              <p className="text-xs text-slate-500">
                Download spreadsheet with all transaction records
              </p>
            </div>
          </div>
          <Download className="h-4 w-4 text-slate-400" />
        </button>

        {/* Reset Demo Data */}
        <button
          type="button"
          onClick={handleResetData}
          className="flex w-full items-center justify-between border-t border-slate-100 py-2 text-left hover:opacity-80 dark:border-slate-800"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <RotateCcw className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Restore Campus Demo Data
              </p>
              <p className="text-xs text-slate-500">
                Repopulate realistic student sample expenses, goals, and recurring items
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Restore
          </span>
        </button>

        {/* Clear All */}
        <button
          type="button"
          onClick={handleClearData}
          className="flex w-full items-center justify-between border-t border-slate-100 py-2 text-left hover:opacity-80 dark:border-slate-800"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
              <Trash2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                Clear All Expense Records
              </p>
              <p className="text-xs text-slate-500">Permanently delete stored transactions</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-red-600">Clear</span>
        </button>
      </div>

      {/* About & Help Trigger */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 text-xs text-slate-500 shadow-xs dark:border-slate-800/90 dark:bg-slate-900 dark:text-slate-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-slate-900 dark:text-slate-100">
              Offline-First Privacy Architecture
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsHelpModalOpen(true)}
            className="flex items-center gap-1 font-bold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Help Guide</span>
          </button>
        </div>

        <p className="mt-1.5 leading-relaxed">
          All financial balances and expense records are stored locally on your device in integer paise. Zero third-party trackers, zero server uploads. Designed with care for college students.
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
          <span>Student Expense Tracker v2.0.0</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Offline Storage Active
          </span>
        </div>
      </div>
    </div>
  );
};

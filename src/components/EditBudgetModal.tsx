import React, { useState, useEffect } from 'react';
import { X, Target, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { paiseToRupees, rupeesToPaise, formatRupee } from '../utils/calculations';

export const EditBudgetModal: React.FC = () => {
  const {
    isBudgetModalOpen,
    setIsBudgetModalOpen,
    currentBudget,
    updateBudget,
    currentMonth,
    currentYear,
  } = useApp();

  const [inputRupees, setInputRupees] = useState('');

  useEffect(() => {
    if (isBudgetModalOpen) {
      setInputRupees(paiseToRupees(currentBudget).toString());
    }
  }, [isBudgetModalOpen, currentBudget]);

  if (!isBudgetModalOpen) return null;

  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputRupees);
    if (isNaN(val) || val < 0) {
      alert('Please enter a valid positive budget amount.');
      return;
    }
    updateBudget(rupeesToPaise(val));
  };

  const quickPresets = [3000, 4500, 6000, 8000, 10000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsBudgetModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Set Monthly Budget
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{monthName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsBudgetModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target Budget (in INR ₹)
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="50"
                value={inputRupees}
                onChange={(e) => setInputRupees(e.target.value)}
                placeholder="6000"
                autoFocus
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-9 pr-4 text-xl font-extrabold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[11px] font-medium text-slate-400">
              Quick Student Presets:
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {quickPresets.map((amt) => {
                const isSelected = parseFloat(inputRupees) === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setInputRupees(amt.toString())}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {formatRupee(amt * 100)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsBudgetModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 active:scale-95"
            >
              <Check className="h-3.5 w-3.5" />
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

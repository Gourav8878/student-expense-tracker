import React, { useState, useEffect } from 'react';
import { X, Check, PieChart, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, getCategoryMeta } from '../constants/categories';
import { ExpenseCategory } from '../types';
import { paiseToRupees, rupeesToPaise, formatRupee } from '../utils/calculations';
import { renderCategoryIcon } from './ExpenseItem';

export const CategoryBudgetModal: React.FC = () => {
  const {
    isCategoryBudgetModalOpen,
    setIsCategoryBudgetModalOpen,
    categoryBudgets,
    updateCategoryBudgets,
    currentBudget,
    updateBudget,
    categoryBudgetDetails,
    currentMonth,
    currentYear,
  } = useApp();

  const [allocations, setAllocations] = useState<Partial<Record<ExpenseCategory, string>>>({});

  useEffect(() => {
    if (isCategoryBudgetModalOpen) {
      const initial: Partial<Record<ExpenseCategory, string>> = {};
      CATEGORIES.forEach((cat) => {
        const val = categoryBudgets[cat.id] || 0;
        initial[cat.id] = val > 0 ? paiseToRupees(val).toString() : '';
      });
      setAllocations(initial);
    }
  }, [isCategoryBudgetModalOpen, categoryBudgets]);

  if (!isCategoryBudgetModalOpen) return null;

  const handleInputChange = (cat: ExpenseCategory, text: string) => {
    setAllocations((prev) => ({ ...prev, [cat]: text }));
  };

  // Calculate sum of category budgets
  const totalAllocatedPaise = Object.entries(allocations).reduce((sum, [_, val]) => {
    const numeric = parseFloat(val as string);
    return sum + (isNaN(numeric) || numeric < 0 ? 0 : rupeesToPaise(numeric));
  }, 0);

  const budgetDifference = totalAllocatedPaise - currentBudget;
  const isOverAllocated = budgetDifference > 0;
  const isUnderAllocated = budgetDifference < 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const result: Partial<Record<ExpenseCategory, number>> = {};
    CATEGORIES.forEach((cat) => {
      const strVal = allocations[cat.id];
      const numeric = parseFloat(strVal || '0');
      if (!isNaN(numeric) && numeric > 0) {
        result[cat.id] = rupeesToPaise(numeric);
      }
    });

    updateCategoryBudgets(result);
  };

  const handleSyncOverallBudget = () => {
    if (totalAllocatedPaise > 0) {
      updateBudget(totalAllocatedPaise);
    }
  };

  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={() => setIsCategoryBudgetModalOpen(false)}
      />

      {/* Dialog */}
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <PieChart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Category Budgets
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Allocate limits for {monthName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCategoryBudgetModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Budget Allocation Summary Pill */}
        <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              Total Category Allocations:
            </span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">
              {formatRupee(totalAllocatedPaise)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              Overall Monthly Budget:
            </span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
              {formatRupee(currentBudget)}
            </span>
          </div>

          {isOverAllocated && (
            <div className="mt-2.5 flex items-center justify-between gap-2 rounded-xl bg-amber-50 p-2 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>Categories exceed overall budget by {formatRupee(budgetDifference)}</span>
              </div>
              <button
                type="button"
                onClick={handleSyncOverallBudget}
                className="shrink-0 font-bold underline"
              >
                Expand Budget
              </button>
            </div>
          )}

          {isUnderAllocated && (
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Unallocated Buffer: {formatRupee(Math.abs(budgetDifference))}</span>
            </div>
          )}
        </div>

        {/* Categories List */}
        <form onSubmit={handleSave} className="mt-4 space-y-3">
          <div className="max-h-[50vh] space-y-2.5 overflow-y-auto pr-1">
            {CATEGORIES.map((cat) => {
              const currentVal = allocations[cat.id] || '';
              const detail = categoryBudgetDetails.find((d) => d.category === cat.id);
              const spent = detail?.spentPaise || 0;
              const numericAlloc = (parseFloat(currentVal) || 0) * 100;
              const isOver = numericAlloc > 0 && spent > numericAlloc;

              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800/80 dark:bg-slate-900"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      {renderCategoryIcon(cat.icon, 'w-4 h-4')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                        {cat.label}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Spent: <span className="font-semibold">{formatRupee(spent)}</span>
                        {isOver && (
                          <span className="ml-1 text-red-500 font-bold">(Over limit)</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="relative w-28 shrink-0">
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      placeholder="0"
                      value={currentVal}
                      onChange={(e) => handleInputChange(cat.id, e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white py-1.5 pl-6 pr-2 text-right text-xs font-bold text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-3 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCategoryBudgetModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 active:scale-95"
            >
              <Check className="h-3.5 w-3.5" />
              Save Allocations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

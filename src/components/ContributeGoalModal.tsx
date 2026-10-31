import React, { useState } from 'react';
import { X, Check, Plus, Minus, PiggyBank } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { rupeesToPaise, formatRupee, paiseToRupees } from '../utils/calculations';

export const ContributeGoalModal: React.FC = () => {
  const {
    isContributeModalOpen,
    setIsContributeModalOpen,
    contributeGoalTarget,
    setContributeGoalTarget,
    contributeToGoal,
  } = useApp();

  const [amountRupees, setAmountRupees] = useState('');
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');

  if (!isContributeModalOpen || !contributeGoalTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = parseFloat(amountRupees);
    if (isNaN(numeric) || numeric <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const paiseDelta = rupeesToPaise(numeric) * (mode === 'deposit' ? 1 : -1);
    contributeToGoal(contributeGoalTarget.id, paiseDelta);
  };

  const quickAmounts = [100, 200, 500, 1000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={() => {
          setIsContributeModalOpen(false);
          setContributeGoalTarget(null);
        }}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Savings Contribution
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {contributeGoalTarget.title}
            </h3>
            <p className="text-xs text-slate-500">
              Saved {formatRupee(contributeGoalTarget.savedAmount)} of {formatRupee(contributeGoalTarget.targetAmount)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsContributeModalOpen(false);
              setContributeGoalTarget(null);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Deposit vs Withdraw Toggle */}
        <div className="mt-4 flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setMode('deposit')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors ${
              mode === 'deposit'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            + Add Funds
          </button>
          <button
            type="button"
            onClick={() => setMode('withdraw')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors ${
              mode === 'withdraw'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            - Withdraw Funds
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Amount to {mode === 'deposit' ? 'Add' : 'Withdraw'} (₹)
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="10"
                step="10"
                value={amountRupees}
                onChange={(e) => setAmountRupees(e.target.value)}
                placeholder="500"
                autoFocus
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-8 pr-3.5 text-base font-extrabold text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                required
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmountRupees(amt.toString())}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                ₹{amt}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 leading-snug">
            💡 Note: Goal contributions are managed separately from everyday spending to prevent double-counting expenses.
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsContributeModalOpen(false);
                setContributeGoalTarget(null);
              }}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-md active:scale-95 ${
                mode === 'deposit'
                  ? 'bg-emerald-600 shadow-emerald-600/25 hover:bg-emerald-700'
                  : 'bg-amber-600 shadow-amber-600/25 hover:bg-amber-700'
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              {mode === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

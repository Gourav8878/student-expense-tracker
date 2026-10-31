import React from 'react';
import { Pencil, TrendingUp, Wallet, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupee } from '../utils/calculations';

export const BudgetCard: React.FC = () => {
  const { metrics, setIsBudgetModalOpen } = useApp();
  const { budgetPaise, spentPaise, remainingPaise, percentage } = metrics;
  const isOverBudget = remainingPaise < 0;

  // Clamped percentage for circular ring calculation
  const ringProgress = Math.min(100, Math.max(0, percentage));
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (ringProgress / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 text-white shadow-xl shadow-indigo-600/20">
      {/* Background glow & subtle pattern */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-purple-500/20 blur-xl" />

      {/* Header with edit button */}
      <div className="relative flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
            Monthly Target
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {formatRupee(budgetPaise)}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsBudgetModalOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95"
          title="Edit Monthly Budget"
          aria-label="Edit Monthly Budget"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      {/* Spent and Remaining Tiles */}
      <div className="relative mt-5 grid grid-cols-2 gap-3">
        {/* Spent Tile */}
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-300">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-indigo-100">Spent</p>
            <p className="truncate text-base font-bold text-white">
              {formatRupee(spentPaise)}
            </p>
          </div>
        </div>

        {/* Remaining Tile */}
        <div
          className={`flex items-center gap-3 rounded-2xl p-3.5 backdrop-blur-sm ${
            isOverBudget ? 'bg-red-500/20 border border-red-400/30' : 'bg-white/10'
          }`}
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              isOverBudget
                ? 'bg-red-500/30 text-red-200'
                : 'bg-emerald-500/20 text-emerald-300'
            }`}
          >
            {isOverBudget ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <Wallet className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-indigo-100">
              {isOverBudget ? 'Overspent' : 'Remaining'}
            </p>
            <p
              className={`truncate text-base font-bold ${
                isOverBudget ? 'text-red-200' : 'text-emerald-200'
              }`}
            >
              {isOverBudget
                ? `-${formatRupee(Math.abs(remainingPaise))}`
                : formatRupee(remainingPaise)}
            </p>
          </div>
        </div>
      </div>

      {/* Usage Progress Indicator */}
      <div className="relative mt-4 flex items-center justify-between rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-13 w-13 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 52 52">
              <circle
                cx="26"
                cy="26"
                r={radius}
                className="stroke-white/20"
                strokeWidth="4.5"
                fill="none"
              />
              <circle
                cx="26"
                cy="26"
                r={radius}
                className={
                  isOverBudget
                    ? 'stroke-red-400'
                    : percentage > 80
                    ? 'stroke-amber-400'
                    : 'stroke-emerald-400'
                }
                strokeWidth="4.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute text-xs font-bold tracking-tight text-white">
              {percentage}%
            </span>
          </div>

          <div>
            <p className="text-xs font-medium text-indigo-100">Budget Consumed</p>
            <p className="text-sm font-semibold text-white">
              {percentage > 100
                ? `${percentage}% used (${formatRupee(Math.abs(remainingPaise))} over limit)`
                : `${percentage}% of monthly limit used`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsBudgetModalOpen(true)}
          className="shrink-0 text-xs font-semibold text-indigo-200 underline decoration-indigo-300/40 underline-offset-4 hover:text-white"
        >
          Change
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  BarChart3,
  SlidersHorizontal,
  History,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Compass,
  PieChart,
  PiggyBank,
  Check,
  CalendarCheck,
  Bell,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BudgetCard } from '../components/BudgetCard';
import { ExpenseItem, renderCategoryIcon } from '../components/ExpenseItem';
import { EmptyState } from '../components/EmptyState';
import { formatRupee, calculateSavingsGoalMetrics } from '../utils/calculations';
import { getCategoryMeta } from '../constants/categories';

export const HomeView: React.FC = () => {
  const {
    userProfile,
    metrics,
    recentExpenses,
    setActiveTab,
    setIsBudgetModalOpen,
    setIsCategoryBudgetModalOpen,
    setIsSavingsModalOpen,
    setIsContributeModalOpen,
    setContributeGoalTarget,
    setIsRecurringModalOpen,
    setEditingExpense,
    categoryBudgetDetails,
    savingsGoals,
    recurringExpenses,
    markRecurringAsPaid,
    currentMonth,
    currentYear,
  } = useApp();

  const {
    remainingPaise,
    dailyTargetPaise,
    dailyTargetType,
    remainingDays,
    statusMessage,
    statusSeverity,
  } = metrics;

  const todayDateFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const monthTag = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
  const todayDay = new Date().getDate();

  // Upcoming unpaid recurring expenses within next 7 days
  const upcomingRecurring = recurringExpenses.filter((item) => {
    if (item.lastPaidMonthYear === monthTag) return false;
    // due between today and next 7 days
    const diff = item.dueDay - todayDay;
    return diff >= 0 && diff <= 7;
  });

  // Filter categories that have an active budget allocation
  const allocatedCategoryDetails = categoryBudgetDetails.filter((d) => d.allocatedPaise > 0);

  return (
    <div className="space-y-5 pb-6">
      {/* Greeting & Header section */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Campus Finance Assistant</span>
          </div>
          <h1 className="mt-0.5 text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
            Hey, {userProfile.name.split(' ')[0]}! 👋
          </h1>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="h-3 w-3" />
            <span>{todayDateFormatted}</span>
            <span aria-hidden="true">·</span>
            <span>{userProfile.college}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white font-bold text-indigo-600 shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400"
          title="Student Settings"
        >
          {userProfile.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
        </button>
      </div>

      {/* Upcoming Recurring Bill Alert Banner (Priority 7) */}
      {upcomingRecurring.length > 0 && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/90 p-3.5 dark:border-indigo-900/60 dark:bg-indigo-950/50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  Upcoming Bill Due Soon
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {upcomingRecurring[0].title} — {formatRupee(upcomingRecurring[0].amount)}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Due on {upcomingRecurring[0].dueDay}th of this month ({upcomingRecurring[0].dueDay - todayDay === 0 ? 'Today!' : `in ${upcomingRecurring[0].dueDay - todayDay} days`})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => markRecurringAsPaid(upcomingRecurring[0].id)}
              className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>Mark Paid</span>
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Budget Status Alert Banner */}
      <div
        className={`flex items-center gap-3 rounded-2xl p-3.5 text-xs font-medium transition-all ${
          statusSeverity === 'danger'
            ? 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300'
            : statusSeverity === 'warning'
            ? 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300'
            : 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300'
        }`}
      >
        <div className="shrink-0">
          {statusSeverity === 'danger' ? (
            <AlertTriangle className="h-4 w-4" />
          ) : statusSeverity === 'warning' ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
        </div>
        <p className="flex-1 leading-snug">{statusMessage}</p>
      </div>

      {/* Monthly Budget Card */}
      <BudgetCard />

      {/* Student Daily Spending Target card (Priority 3) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800/90 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                dailyTargetType === 'target'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                  : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
              }`}
            >
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Recommended Daily Pace
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  {formatRupee(dailyTargetPaise)}
                  <span className="text-xs font-normal text-slate-500"> / day</span>
                </h3>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <Clock className="h-3 w-3" />
            <span>{remainingDays} days left</span>
          </div>
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          {dailyTargetType === 'target'
            ? `💡 Recommended pace (not a hard cap): staying under ${formatRupee(dailyTargetPaise)} daily leaves you with a surplus at month-end.`
            : `⚠️ Monthly budget exhausted. Recommended discretionary spending is ₹0/day until the next month.`}
        </p>
      </div>

      {/* Category Budgets Overview Card (Priority 1) */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4.5 shadow-sm dark:border-slate-800/90 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Category Budgets
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsCategoryBudgetModalOpen(true)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            {allocatedCategoryDetails.length > 0 ? 'Edit Limits' : 'Set Category Budgets'}
          </button>
        </div>

        {allocatedCategoryDetails.length === 0 ? (
          <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-center text-xs text-slate-500 dark:bg-slate-800/60">
            <p>No category limits configured yet.</p>
            <button
              type="button"
              onClick={() => setIsCategoryBudgetModalOpen(true)}
              className="mt-1.5 font-bold text-indigo-600 underline dark:text-indigo-400"
            >
              Allocate budget by category
            </button>
          </div>
        ) : (
          <div className="mt-3 space-y-2.5">
            {allocatedCategoryDetails.slice(0, 4).map((detail) => {
              const meta = getCategoryMeta(detail.category);
              const progressClamped = Math.min(100, detail.percentage);
              return (
                <div key={detail.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: meta.color }}
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {meta.label}
                      </span>
                      {detail.isOverBudget && (
                        <span className="text-[10px] font-bold text-red-500">(Over limit)</span>
                      )}
                      {detail.isWarning && (
                        <span className="text-[10px] font-bold text-amber-500">(Near limit)</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {formatRupee(detail.spentPaise)}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {' '}/ {formatRupee(detail.allocatedPaise)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        detail.isOverBudget
                          ? 'bg-red-500'
                          : detail.isWarning
                          ? 'bg-amber-500'
                          : 'bg-indigo-600 dark:bg-indigo-500'
                      }`}
                      style={{ width: `${progressClamped}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {allocatedCategoryDetails.length > 4 && (
              <button
                type="button"
                onClick={() => setIsCategoryBudgetModalOpen(true)}
                className="mt-1 text-center w-full text-[11px] font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                + View all {allocatedCategoryDetails.length} category budgets
              </button>
            )}
          </div>
        )}
      </div>

      {/* Savings Goals Section (Priority 4) */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4.5 shadow-sm dark:border-slate-800/90 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Student Savings Goals
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsSavingsModalOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            <Plus className="h-3 w-3" />
            <span>New Goal</span>
          </button>
        </div>

        {savingsGoals.length === 0 ? (
          <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-center text-xs text-slate-500 dark:bg-slate-800/60">
            <p>No savings goals created yet.</p>
            <button
              type="button"
              onClick={() => setIsSavingsModalOpen(true)}
              className="mt-1 font-bold text-emerald-600 underline dark:text-emerald-400"
            >
              Start saving for semester fees or a trip
            </button>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {savingsGoals.map((goal) => {
              const { target, saved, remaining, percentage, isCompleted, daysRemaining } =
                calculateSavingsGoalMetrics(goal);

              return (
                <div
                  key={goal.id}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {goal.category || 'Savings'}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {goal.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setContributeGoalTarget(goal);
                        setIsContributeModalOpen(true);
                      }}
                      className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95"
                    >
                      + Add Funds
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">
                      {formatRupee(saved)}
                    </span>
                    <span className="text-slate-500">
                      Target: {formatRupee(target)} ({percentage}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {isCompleted ? '🎉 Goal Completed!' : `${formatRupee(remaining)} remaining`}
                    </span>
                    {daysRemaining !== null && (
                      <span>
                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Target date passed'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Action Shortcuts */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Quick Actions
        </h3>
        <div className="mt-2.5 grid grid-cols-4 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-2.5 text-center shadow-xs transition-all hover:border-indigo-300 hover:shadow-sm active:scale-95 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Plus className="h-5 w-5" />
            </div>
            <span className="mt-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Add Expense
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsCategoryBudgetModalOpen(true)}
            className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-2.5 text-center shadow-xs transition-all hover:border-indigo-300 hover:shadow-sm active:scale-95 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
              <PieChart className="h-5 w-5" />
            </div>
            <span className="mt-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Categories
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsRecurringModalOpen(true)}
            className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-2.5 text-center shadow-xs transition-all hover:border-indigo-300 hover:shadow-sm active:scale-95 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <span className="mt-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Recurring
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-2.5 text-center shadow-xs transition-all hover:border-indigo-300 hover:shadow-sm active:scale-95 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <History className="h-5 w-5" />
            </div>
            <span className="mt-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              History
            </span>
          </button>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Recent Transactions
          </h3>
          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-2.5 space-y-2">
          {recentExpenses.length === 0 ? (
            <EmptyState
              title="No Expenses Yet"
              subtitle="Record your first chai, mess meal, or campus stationary to start tracking."
              buttonTitle="Add First Expense"
              onButtonPress={() => setActiveTab('add')}
            />
          ) : (
            recentExpenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onEdit={setEditingExpense}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

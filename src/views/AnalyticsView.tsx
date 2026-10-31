import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  PieChart as PieIcon,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getCategorySummaries,
  getWeeklyBreakdown,
  generateSmartInsights,
  formatRupee,
} from '../utils/calculations';
import { getCategoryMeta } from '../constants/categories';
import { EmptyState } from '../components/EmptyState';
import { renderCategoryIcon } from '../components/ExpenseItem';

export const AnalyticsView: React.FC = () => {
  const {
    expenses,
    previousMonthExpenses,
    previousMonthTotalPaise,
    metrics,
    categoryBudgetDetails,
    currentBudget,
    currentMonth,
    currentYear,
    setActiveTab,
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

  // Category Summaries for current month
  const categorySummaries = useMemo(() => {
    return getCategorySummaries(expenses);
  }, [expenses]);

  // Weekly breakdown (4 weeks)
  const weeklyData = useMemo(() => {
    return getWeeklyBreakdown(expenses, currentMonth, currentYear);
  }, [expenses, currentMonth, currentYear]);

  const maxWeeklyPaise = Math.max(...weeklyData, 100000);

  // Financial Highlights
  const totalSpentPaise = metrics.spentPaise;
  const highestCategory = categorySummaries[0] || null;
  const largestExpense = useMemo(() => {
    if (expenses.length === 0) return null;
    return [...expenses].sort((a, b) => b.amount - a.amount)[0];
  }, [expenses]);

  // Days elapsed in current month for daily average
  const now = new Date();
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const daysElapsed =
    now.getFullYear() === currentYear && now.getMonth() + 1 === currentMonth
      ? Math.max(1, now.getDate())
      : daysInMonth;

  const averageDailySpendPaise = Math.round(totalSpentPaise / daysElapsed);

  // Month-over-Month comparison (Priority 2 & 5)
  const momDiffPaise = totalSpentPaise - previousMonthTotalPaise;
  const momPercentChange =
    previousMonthTotalPaise > 0
      ? Math.round((Math.abs(momDiffPaise) / previousMonthTotalPaise) * 100)
      : 0;

  // Smart Insights generated dynamically from real data
  const smartInsights = useMemo(() => {
    return generateSmartInsights(
      expenses,
      previousMonthExpenses,
      metrics,
      categoryBudgetDetails
    );
  }, [expenses, previousMonthExpenses, metrics, categoryBudgetDetails]);

  // SVG Donut Calculations
  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  const donutSegments = categorySummaries.map((cat) => {
    const meta = getCategoryMeta(cat.category);
    const fraction = totalSpentPaise > 0 ? cat.totalPaise / totalSpentPaise : 0;
    const strokeDasharray = `${circumference * fraction} ${circumference * (1 - fraction)}`;
    const strokeDashoffset = -circumference * accumulatedPercent;
    accumulatedPercent += fraction;

    return {
      category: cat.category,
      label: meta.label,
      color: meta.color,
      fraction,
      percentage: cat.percentage,
      totalPaise: cat.totalPaise,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const prevMonthName = new Date(
    currentMonth > 1 ? currentYear : currentYear - 1,
    currentMonth > 1 ? currentMonth - 2 : 11
  ).toLocaleString('default', { month: 'short' });

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Spending Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {monthName} Financial Intelligence
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{monthName}</span>
        </div>
      </div>

      {expenses.length === 0 ? (
        <EmptyState
          title="No Analytics Data for this Month"
          subtitle={`No transactions are logged for ${monthName}. Add your mess fee or snacks to unlock visual analytics.`}
          buttonTitle="Add an Expense"
          onButtonPress={() => setActiveTab('add')}
        />
      ) : (
        <>
          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Total Spent */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Expenses
              </span>
              <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {formatRupee(totalSpentPaise)}
              </p>
              <span className="text-[11px] text-slate-400">
                {metrics.percentage}% of {formatRupee(currentBudget)}
              </span>
            </div>

            {/* Daily Average */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Avg. Daily Spend
              </span>
              <p className="mt-1 text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                {formatRupee(averageDailySpendPaise)}
              </p>
              <span className="text-[11px] text-slate-400">
                over {daysElapsed} days
              </span>
            </div>

            {/* Top Category */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Highest Category
              </span>
              <p className="mt-1 truncate text-base font-extrabold text-slate-900 dark:text-slate-100">
                {highestCategory ? getCategoryMeta(highestCategory.category).label : 'N/A'}
              </p>
              <span className="text-[11px] text-slate-400">
                {highestCategory ? `${highestCategory.percentage}% of total` : '-'}
              </span>
            </div>

            {/* Largest Expense */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Largest Expense
              </span>
              <p className="mt-1 text-lg font-extrabold text-amber-600 dark:text-amber-400">
                {largestExpense ? formatRupee(largestExpense.amount) : '₹0'}
              </p>
              <span className="truncate text-[11px] text-slate-400">
                {largestExpense?.title || 'None'}
              </span>
            </div>
          </div>

          {/* Month-over-Month Comparison Card (Priority 2 & 5) */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Month-over-Month Comparison
                </h3>
                <p className="text-xs text-slate-500">
                  {monthName} vs. {prevMonthName}
                </p>
              </div>

              <div
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold ${
                  momDiffPaise > 0
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    : momDiffPaise < 0
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {momDiffPaise > 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                <span>
                  {momDiffPaise > 0
                    ? `+${momPercentChange}% higher`
                    : momDiffPaise < 0
                    ? `-${momPercentChange}% lower`
                    : 'Equal spend'}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <span className="text-[11px] font-semibold text-slate-400">
                  {monthName} (Current)
                </span>
                <p className="mt-0.5 text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {formatRupee(totalSpentPaise)}
                </p>
                <span className="text-[10px] text-slate-500">
                  {expenses.length} transactions logged
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <span className="text-[11px] font-semibold text-slate-400">
                  {prevMonthName} (Previous)
                </span>
                <p className="mt-0.5 text-base font-extrabold text-slate-700 dark:text-slate-300">
                  {formatRupee(previousMonthTotalPaise)}
                </p>
                <span className="text-[10px] text-slate-500">
                  {previousMonthExpenses.length} historical records
                </span>
              </div>
            </div>
          </div>

          {/* Category-Wise Spending Donut & Legend */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Category Breakdown
              </h3>
              <span className="text-xs text-slate-400">{categorySummaries.length} categories active</span>
            </div>

            <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
              {/* SVG Donut */}
              <div className="relative flex h-48 w-48 shrink-0 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  {donutSegments.map((segment) => (
                    <circle
                      key={segment.category}
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke={segment.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={segment.strokeDasharray}
                      strokeDashoffset={segment.strokeDashoffset}
                      fill="none"
                      className="transition-all duration-300 hover:opacity-85"
                    />
                  ))}
                </svg>

                {/* Donut Center Info */}
                <div className="absolute text-center">
                  <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    {formatRupee(totalSpentPaise)}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400">Total Spent</p>
                </div>
              </div>

              {/* Categorical Breakdown Legend List */}
              <div className="w-full max-w-xs space-y-2">
                {categorySummaries.map((cat) => {
                  const meta = getCategoryMeta(cat.category);
                  return (
                    <div
                      key={cat.category}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: meta.color }}
                        />
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {meta.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-right">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {formatRupee(cat.totalPaise)}
                        </span>
                        <span className="w-8 font-semibold text-slate-400">
                          {cat.percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Weekly Spending Trend Bar Chart */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Weekly Spending Trend
              </h3>
              <span className="text-xs text-slate-400">4-Week Outflow</span>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-3 pt-6">
              {weeklyData.map((weekAmt, idx) => {
                const heightPercent = Math.min(100, Math.max(8, (weekAmt / maxWeeklyPaise) * 100));
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="mb-1 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      {formatRupee(weekAmt)}
                    </span>
                    <div className="flex h-32 w-full max-w-[48px] items-end rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
                      <div
                        className="w-full rounded-xl bg-indigo-600 transition-all duration-500 dark:bg-indigo-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Week {idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {idx === 0
                        ? '1-7'
                        : idx === 1
                        ? '8-14'
                        : idx === 2
                        ? '15-21'
                        : '22+'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Smart Student Finance Insights Card (Priority 2) */}
          <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-violet-50/70 p-5 dark:border-indigo-950/60 dark:bg-gradient-to-br dark:from-slate-900 dark:to-indigo-950/30">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Smart Spending Insights
              </h3>
            </div>

            <div className="mt-3 space-y-2.5">
              {smartInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-2xl border border-white/60 bg-white/70 p-3 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-850"
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        insight.sentiment === 'warning'
                          ? 'bg-amber-500'
                          : insight.sentiment === 'positive'
                          ? 'bg-emerald-500'
                          : 'bg-indigo-500'
                      }`}
                    />
                    <span>{insight.title}</span>
                  </div>
                  <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-300">
                    {insight.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

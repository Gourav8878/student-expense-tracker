import React from 'react';
import {
  UtensilsCrossed,
  Coffee,
  Bus,
  GraduationCap,
  ShoppingBag,
  Film,
  Home,
  Sparkles,
  Receipt,
  HeartPulse,
  MoreHorizontal,
  MoreVertical,
  QrCode,
  Banknote,
  CreditCard,
  Building2,
  CircleDollarSign,
} from 'lucide-react';
import { Expense } from '../types';
import { getCategoryMeta } from '../constants/categories';
import { formatRupee } from '../utils/calculations';

interface ExpenseItemProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
}

export const renderCategoryIcon = (iconName: string, className = 'w-5 h-5') => {
  switch (iconName) {
    case 'UtensilsCrossed':
      return <UtensilsCrossed className={className} />;
    case 'Coffee':
      return <Coffee className={className} />;
    case 'Bus':
      return <Bus className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'Film':
      return <Film className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Receipt':
      return <Receipt className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    default:
      return <MoreHorizontal className={className} />;
  }
};

export const renderPaymentIcon = (method: string, className = 'w-3.5 h-3.5') => {
  switch (method) {
    case 'UPI':
      return <QrCode className={className} />;
    case 'Cash':
      return <Banknote className={className} />;
    case 'Debit Card':
    case 'Credit Card':
      return <CreditCard className={className} />;
    case 'Net Banking':
      return <Building2 className={className} />;
    default:
      return <CircleDollarSign className={className} />;
  }
};

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onEdit, onDelete }) => {
  const meta = getCategoryMeta(expense.category);

  const formattedDate = () => {
    try {
      const parts = expense.date.split('-');
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const today = new Date();
      if (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      ) {
        return 'Today';
      }
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch {
      return expense.date;
    }
  };

  return (
    <div className="group relative flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-indigo-900/50">
      {/* Category Icon and Info */}
      <div
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3.5"
        onClick={() => onEdit?.(expense)}
      >
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105"
          style={{ backgroundColor: `${meta.color}18`, color: meta.color }}
        >
          {renderCategoryIcon(meta.icon, 'w-5 h-5')}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {expense.title}
          </h4>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {meta.label}
            </span>
            <span aria-hidden="true">·</span>
            <span>{formattedDate()}</span>
            {expense.paymentMethod && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  {renderPaymentIcon(expense.paymentMethod, 'w-3 h-3 text-slate-400')}
                  {expense.paymentMethod}
                </span>
              </>
            )}
          </div>
          {expense.notes && (
            <p className="mt-1 line-clamp-1 text-xs text-slate-400 dark:text-slate-500">
              {expense.notes}
            </p>
          )}
        </div>
      </div>

      {/* Amount and Action Menu */}
      <div className="flex shrink-0 items-center gap-3 pl-3">
        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 sm:text-base">
          -{formatRupee(expense.amount)}
        </span>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(expense)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title="Edit expense"
              aria-label="Edit expense"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

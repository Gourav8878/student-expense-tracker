import React, { useState } from 'react';
import { X, Check, Clock, Plus, Trash2, CalendarCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, PAYMENT_METHODS } from '../constants/categories';
import { ExpenseCategory, PaymentMethod, RecurringExpense } from '../types';
import { rupeesToPaise, paiseToRupees, formatRupee } from '../utils/calculations';
import { renderCategoryIcon } from './ExpenseItem';

export const RecurringExpenseModal: React.FC = () => {
  const {
    isRecurringModalOpen,
    setIsRecurringModalOpen,
    recurringExpenses,
    addRecurringExpense,
    deleteRecurringExpense,
    markRecurringAsPaid,
    currentMonth,
    currentYear,
  } = useApp();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [title, setTitle] = useState('');
  const [amountRupees, setAmountRupees] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('bills');
  const [dueDay, setDueDay] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState('');

  if (!isRecurringModalOpen) return null;

  const currentMonthTag = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title.');
      return;
    }
    const num = parseFloat(amountRupees);
    if (isNaN(num) || num <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    addRecurringExpense({
      title: title.trim(),
      amount: rupeesToPaise(num),
      category,
      dueDay: Math.min(31, Math.max(1, dueDay)),
      frequency: 'monthly',
      paymentMethod,
      notes: notes.trim(),
      lastPaidMonthYear: '',
      active: true,
    });

    setTitle('');
    setAmountRupees('');
    setNotes('');
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={() => setIsRecurringModalOpen(false)}
      />

      {/* Dialog */}
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Recurring Campus Expenses
              </h3>
              <p className="text-xs text-slate-500">
                Templates & reminders for monthly mess, rent, recharges
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRecurringModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Existing List */}
        <div className="mt-4 space-y-2.5">
          {recurringExpenses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500 dark:border-slate-800">
              No recurring bills configured yet. Add your mess fee or room Wi-Fi to automate tracking!
            </div>
          ) : (
            recurringExpenses.map((item) => {
              const isPaidThisMonth = item.lastPaidMonthYear === currentMonthTag;
              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: isPaidThisMonth ? '#10B98118' : '#6366F118',
                        color: isPaidThisMonth ? '#10B981' : '#6366F1',
                      }}
                    >
                      {renderCategoryIcon(item.category, 'w-4 h-4')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Due: {item.dueDay}th of each month · {item.paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                      {formatRupee(item.amount)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isPaidThisMonth ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <Check className="h-3 w-3" />
                          Paid this month
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => markRecurringAsPaid(item.id)}
                          className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                        >
                          <CalendarCheck className="h-3 w-3" />
                          Mark Paid
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteRecurringExpense(item.id)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                        title="Remove recurring item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add New Section Toggle */}
        {!isAddingNew ? (
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-indigo-300 p-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50/50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Recurring Bill</span>
          </button>
        ) : (
          <form onSubmit={handleCreate} className="mt-4 space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 dark:border-indigo-950 dark:bg-indigo-950/20">
            <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
              New Recurring Expense Template
            </h4>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Bill Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mess Advance, SIM Recharge"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amountRupees}
                  onChange={(e) => setAmountRupees(e.target.value)}
                  placeholder="299"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Due Day of Month
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={dueDay}
                  onChange={(e) => setDueDay(parseInt(e.target.value, 10) || 1)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  {PAYMENT_METHODS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Save Template
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

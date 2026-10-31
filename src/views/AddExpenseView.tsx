import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowLeft,
  Calendar,
  CreditCard,
  FileText,
  Tag,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, PAYMENT_METHODS } from '../constants/categories';
import { ExpenseCategory, PaymentMethod, QuickAddPreset } from '../types';
import { rupeesToPaise, paiseToRupees } from '../utils/calculations';
import { renderCategoryIcon } from '../components/ExpenseItem';

export const AddExpenseView: React.FC = () => {
  const { addExpense, setActiveTab, quickPresets, setIsPresetModalOpen } = useApp();

  const todayStr = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState('');
  const [amountRupees, setAmountRupees] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [date, setDate] = useState(todayStr);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyPreset = (p: QuickAddPreset) => {
    setTitle(p.title);
    setCategory(p.category);
    setAmountRupees(paiseToRupees(p.amountPaise).toString());
  };

  const handleQuickAddAmount = (addVal: number) => {
    const current = parseFloat(amountRupees) || 0;
    setAmountRupees((current + addVal).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title for the expense.');
      return;
    }

    const num = parseFloat(amountRupees);
    if (isNaN(num) || num <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    if (!date) {
      alert('Please choose a valid date.');
      return;
    }

    setIsSubmitting(true);
    try {
      addExpense({
        title,
        amountPaise: rupeesToPaise(num),
        category,
        date,
        paymentMethod,
        notes,
      });

      // Reset form and return to home
      setTitle('');
      setAmountRupees('');
      setNotes('');
      setActiveTab('home');
    } catch {
      alert('Failed to save expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Record Expense
        </h2>
        <div className="w-9" />
      </div>

      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 p-5 text-center border border-indigo-100 dark:border-indigo-950/60 dark:bg-gradient-to-br dark:from-slate-900 dark:to-indigo-950/40">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
          <Wallet className="h-7 w-7" />
        </div>
        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100">
          Track New Spending
        </h3>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Keeps your monthly & category budgets automatically updated
        </p>
      </div>

      {/* Dynamic Customizable Quick Presets (Priority 7) */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Quick Campus Shortcuts
          </span>
          <button
            type="button"
            onClick={() => setIsPresetModalOpen(true)}
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            <Sliders className="h-3 w-3" />
            <span>Customize</span>
          </button>
        </div>

        <div className="mt-1.5 flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {quickPresets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <span>{p.title}</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                ₹{paiseToRupees(p.amountPaise)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Expense Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Canteen lunch, Xerox printing, Bus ticket"
            required
            className="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Amount (in INR ₹) *
          </label>
          <div className="relative mt-1.5">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
              ₹
            </span>
            <input
              type="number"
              step="any"
              min="0.01"
              value={amountRupees}
              onChange={(e) => setAmountRupees(e.target.value)}
              placeholder="0.00"
              required
              className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-xl font-extrabold text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Quick amount addition buttons */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {[20, 50, 100, 200, 500].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAddAmount(val)}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                +₹{val}
              </button>
            ))}
            {amountRupees && (
              <button
                type="button"
                onClick={() => setAmountRupees('')}
                className="rounded-lg px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Selection Grid */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Category *
            </label>
            <span className="text-[11px] text-slate-400">11 Categories</span>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2.5 rounded-2xl border p-2.5 text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 shadow-sm ring-1 ring-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/60 dark:ring-indigo-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    {renderCategoryIcon(cat.icon, 'w-4 h-4')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-xs font-semibold ${
                        isSelected
                          ? 'text-indigo-900 dark:text-indigo-200'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {cat.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date & Payment Method */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Date *
            </label>
            <div className="relative mt-1.5">
              <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Payment Method
            </label>
            <div className="relative mt-1.5">
              <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full appearance-none rounded-2xl border border-slate-300 bg-white py-2.5 pl-10 pr-8 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notes (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Notes / Split Info (Optional)
          </label>
          <div className="relative mt-1.5">
            <FileText className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Split with Rahul, borrowed ₹50"
              className="w-full rounded-2xl border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
        >
          <CheckCircle2 className="h-5 w-5" />
          <span>{isSubmitting ? 'Recording...' : 'Save Expense'}</span>
        </button>
      </form>
    </div>
  );
};

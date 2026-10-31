import React, { useState } from 'react';
import { X, Check, PiggyBank, Target, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { rupeesToPaise, formatRupee } from '../utils/calculations';

export const SavingsGoalModal: React.FC = () => {
  const { isSavingsModalOpen, setIsSavingsModalOpen, addSavingsGoal } = useApp();

  const [title, setTitle] = useState('');
  const [targetAmountRupees, setTargetAmountRupees] = useState('');
  const [initialSavedRupees, setInitialSavedRupees] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Academic');

  if (!isSavingsModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a goal name.');
      return;
    }
    const targetNum = parseFloat(targetAmountRupees);
    if (isNaN(targetNum) || targetNum <= 0) {
      alert('Please enter a valid positive target amount.');
      return;
    }
    const savedNum = parseFloat(initialSavedRupees) || 0;

    addSavingsGoal({
      title: title.trim(),
      targetAmount: rupeesToPaise(targetNum),
      savedAmount: rupeesToPaise(savedNum),
      targetDate: targetDate || undefined,
      category,
      color:
        category === 'Academic'
          ? '#8B5CF6'
          : category === 'Travel'
          ? '#3B82F6'
          : category === 'Gadget'
          ? '#EC4899'
          : '#10B981',
    });

    setTitle('');
    setTargetAmountRupees('');
    setInitialSavedRupees('0');
    setTargetDate('');
    setIsSavingsModalOpen(false);
  };

  const studentGoalPresets = [
    { title: 'Semester Exam Fee', amt: '2000', cat: 'Academic' },
    { title: 'Diwali Trip Home Train', amt: '3500', cat: 'Travel' },
    { title: 'Hostel Emergency Stash', amt: '5000', cat: 'Emergency' },
    { title: 'Coding Laptop Upgrade', amt: '25000', cat: 'Gadget' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={() => setIsSavingsModalOpen(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <PiggyBank className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                New Savings Goal
              </h3>
              <p className="text-xs text-slate-500">Plan campus savings for upcoming needs</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSavingsModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mt-4">
          <span className="text-[11px] font-semibold text-slate-400">Popular Student Goals:</span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {studentGoalPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTitle(preset.title);
                  setTargetAmountRupees(preset.amt);
                  setCategory(preset.cat);
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
              >
                {preset.title} (₹{preset.amt})
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Goal Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Semester Registration, Project Hardware"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target (₹) *
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={targetAmountRupees}
                onChange={(e) => setTargetAmountRupees(e.target.value)}
                placeholder="5000"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Already Saved (₹)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={initialSavedRupees}
                onChange={(e) => setInitialSavedRupees(e.target.value)}
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Academic">Academic / Fees</option>
                <option value="Travel">Travel / Vacation</option>
                <option value="Emergency">Emergency Buffer</option>
                <option value="Gadget">Gadget / Tech</option>
                <option value="General">General Savings</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Date (Optional)
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsSavingsModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700 active:scale-95"
            >
              <Check className="h-3.5 w-3.5" />
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

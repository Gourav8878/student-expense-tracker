import React, { useState } from 'react';
import { X, Plus, Trash2, Tag, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../constants/categories';
import { ExpenseCategory } from '../types';
import { rupeesToPaise, formatRupee } from '../utils/calculations';
import { renderCategoryIcon } from './ExpenseItem';

export const CustomPresetModal: React.FC = () => {
  const { isPresetModalOpen, setIsPresetModalOpen, quickPresets, addQuickPreset, deleteQuickPreset } = useApp();

  const [title, setTitle] = useState('');
  const [amountRupees, setAmountRupees] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('snacks');

  if (!isPresetModalOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Enter template title');
      return;
    }
    const num = parseFloat(amountRupees);
    if (isNaN(num) || num <= 0) {
      alert('Enter a valid amount');
      return;
    }

    addQuickPreset({
      title: title.trim(),
      amountPaise: rupeesToPaise(num),
      category,
    });

    setTitle('');
    setAmountRupees('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={() => setIsPresetModalOpen(false)}
      />

      {/* Dialog */}
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Quick-Add Presets
              </h3>
              <p className="text-xs text-slate-500">
                1-tap campus expense shortcuts for speed
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPresetModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Existing Presets List */}
        <div className="mt-4 space-y-2">
          {quickPresets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-2.5 dark:border-slate-800/80 dark:bg-slate-800/60"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                  {renderCategoryIcon(preset.category, 'w-3.5 h-3.5 text-slate-600 dark:text-slate-300')}
                </span>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {preset.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                  {formatRupee(preset.amountPaise)}
                </span>
                <button
                  type="button"
                  onClick={() => deleteQuickPreset(preset.id)}
                  className="p-1 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Preset Form */}
        <form onSubmit={handleAdd} className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/40">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Create Custom Shortcut
          </span>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (e.g. Chai, Print)"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            />
            <input
              type="number"
              min="1"
              step="1"
              value={amountRupees}
              onChange={(e) => setAmountRupees(e.target.value)}
              placeholder="Amount (₹)"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
        </form>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setIsPresetModalOpen(false)}
            className="rounded-xl px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

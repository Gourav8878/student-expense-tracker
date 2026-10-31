import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupee } from '../utils/calculations';

export const DeleteConfirmModal: React.FC = () => {
  const { deletingExpense, setDeletingExpense, deleteExpense } = useApp();

  if (!deletingExpense) return null;

  const handleConfirm = () => {
    deleteExpense(deletingExpense.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={() => setDeletingExpense(null)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
          Delete Transaction?
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Are you sure you want to delete &ldquo;
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {deletingExpense.title}
          </span>
          &rdquo; for{' '}
          <span className="font-bold text-slate-900 dark:text-slate-100">
            {formatRupee(deletingExpense.amount)}
          </span>
          ? This will update your monthly budget and analytics.
        </p>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setDeletingExpense(null)}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/25 hover:bg-red-700 active:scale-95"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

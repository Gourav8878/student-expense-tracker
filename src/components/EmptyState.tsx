import React from 'react';
import { Receipt, Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  buttonTitle,
  onButtonPress,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/60 p-8 text-center dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
        {icon || <Receipt className="h-8 w-8" />}
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        {subtitle}
      </p>
      {buttonTitle && onButtonPress && (
        <button
          type="button"
          onClick={onButtonPress}
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          {buttonTitle}
        </button>
      )}
    </div>
  );
};

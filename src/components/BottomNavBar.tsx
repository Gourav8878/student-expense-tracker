import React from 'react';
import { Home, BarChart3, Plus, ReceiptText, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'add', label: 'Add', icon: <Plus className="h-6 w-6 text-white" /> },
    { id: 'transactions', label: 'Transactions', icon: <ReceiptText className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="sticky bottom-0 z-40 w-full border-t border-slate-200/80 bg-white/95 px-3 py-2 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/95"
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isAdd = item.id === 'add';

          if (isAdd) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab('add')}
                className="relative -top-3 flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/35 transition-transform hover:scale-105 active:scale-95"
                title="Add Expense"
                aria-label="Add Expense"
              >
                {item.icon}
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center rounded-xl px-2 py-1 transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </div>
              <span
                className={`mt-1 text-[11px] font-medium leading-none tracking-tight ${
                  isActive ? 'font-bold' : ''
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

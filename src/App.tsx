import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeView } from './views/HomeView';
import { AnalyticsView } from './views/AnalyticsView';
import { AddExpenseView } from './views/AddExpenseView';
import { TransactionsView } from './views/TransactionsView';
import { SettingsView } from './views/SettingsView';
import { EditBudgetModal } from './components/EditBudgetModal';
import { EditExpenseModal } from './components/EditExpenseModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { CategoryBudgetModal } from './components/CategoryBudgetModal';
import { SavingsGoalModal } from './components/SavingsGoalModal';
import { ContributeGoalModal } from './components/ContributeGoalModal';
import { RecurringExpenseModal } from './components/RecurringExpenseModal';
import { CustomPresetModal } from './components/CustomPresetModal';
import { HelpAndPrivacyModal } from './components/HelpAndPrivacyModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, viewMode, toast } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'add':
        return <AddExpenseView />;
      case 'transactions':
        return <TransactionsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* Top Bar Contract Header */}
      <Header />

      {/* Main Container Area */}
      <main className="flex-1 px-2 py-3 sm:px-4 sm:py-6">
        <div
          className={`mx-auto transition-all duration-300 ${
            viewMode === 'mobile'
              ? 'max-w-[430px] rounded-[36px] border border-slate-300/80 bg-slate-50 shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-950'
              : 'max-w-4xl rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900'
          }`}
        >
          {/* Simulated Mobile Device Notch / Status Pill in Mobile Mode on desktop */}
          {viewMode === 'mobile' && (
            <div className="hidden border-b border-slate-200/50 bg-slate-100/60 px-6 py-2 text-[11px] font-semibold text-slate-400 dark:border-slate-800/50 dark:bg-slate-900/40 sm:flex sm:items-center sm:justify-between">
              <span>9:41</span>
              <div className="h-4 w-20 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>100% 🔋</span>
            </div>
          )}

          {/* Active Screen View */}
          <div className="p-4 sm:p-5 min-h-[580px]">
            {renderActiveView()}
          </div>

          {/* Bottom Navigation Bar */}
          <BottomNavBar />
        </div>
      </main>

      {/* Modals & Dialogs */}
      <EditBudgetModal />
      <EditExpenseModal />
      <DeleteConfirmModal />
      <CategoryBudgetModal />
      <SavingsGoalModal />
      <ContributeGoalModal />
      <RecurringExpenseModal />
      <CustomPresetModal />
      <HelpAndPrivacyModal />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          <div
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold text-white shadow-xl ${
              toast.type === 'error'
                ? 'bg-red-600 shadow-red-600/30'
                : toast.type === 'info'
                ? 'bg-slate-800 shadow-slate-900/30 dark:bg-slate-700'
                : 'bg-emerald-600 shadow-emerald-600/30'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : toast.type === 'info' ? (
              <Info className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Expense,
  ExpenseCategory,
  PaymentMethod,
  UserProfile,
  ActiveTab,
  CategoryBudgetDetail,
  SavingsGoal,
  RecurringExpense,
  QuickAddPreset,
} from '../types';
import { storageService } from '../services/storageService';
import {
  calculateBudgetMetrics,
  calculateCategoryBudgetDetails,
  BudgetMetrics,
} from '../utils/calculations';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentMonth: number;
  currentYear: number;
  setMonthYear: (month: number, year: number) => void;
  expenses: Expense[];
  allExpenses: Expense[];
  previousMonthExpenses: Expense[];
  previousMonthTotalPaise: number;
  recentExpenses: Expense[];
  currentBudget: number; // in Paise
  categoryBudgets: Partial<Record<ExpenseCategory, number>>;
  updateCategoryBudgets: (budgets: Partial<Record<ExpenseCategory, number>>) => void;
  categoryBudgetDetails: CategoryBudgetDetail[];
  metrics: BudgetMetrics;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  viewMode: 'mobile' | 'fluid';
  setViewMode: (mode: 'mobile' | 'fluid') => void;
  // CRUD - Expenses
  addExpense: (data: {
    title: string;
    amountPaise: number;
    category: ExpenseCategory;
    date: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => void;
  updateExpense: (
    id: string,
    data: {
      title: string;
      amountPaise: number;
      category: ExpenseCategory;
      date: string;
      paymentMethod: PaymentMethod;
      notes?: string;
    }
  ) => void;
  deleteExpense: (id: string) => void;
  updateBudget: (amountPaise: number, categoryBudgets?: Partial<Record<ExpenseCategory, number>>) => void;
  resetDemoData: () => void;
  clearAllExpenses: () => void;
  // Savings Goals
  savingsGoals: SavingsGoal[];
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSavingsGoal: (id: string, updates: Partial<Omit<SavingsGoal, 'id' | 'createdAt'>>) => void;
  deleteSavingsGoal: (id: string) => void;
  contributeToGoal: (id: string, amountPaiseDelta: number) => void;
  // Recurring Expenses
  recurringExpenses: RecurringExpense[];
  addRecurringExpense: (item: Omit<RecurringExpense, 'id' | 'createdAt'>) => void;
  updateRecurringExpense: (id: string, updates: Partial<Omit<RecurringExpense, 'id' | 'createdAt'>>) => void;
  deleteRecurringExpense: (id: string) => void;
  markRecurringAsPaid: (id: string) => void;
  // Quick Presets
  quickPresets: QuickAddPreset[];
  addQuickPreset: (preset: Omit<QuickAddPreset, 'id'>) => void;
  deleteQuickPreset: (id: string) => void;
  // Modals
  isBudgetModalOpen: boolean;
  setIsBudgetModalOpen: (open: boolean) => void;
  isCategoryBudgetModalOpen: boolean;
  setIsCategoryBudgetModalOpen: (open: boolean) => void;
  isSavingsModalOpen: boolean;
  setIsSavingsModalOpen: (open: boolean) => void;
  isContributeModalOpen: boolean;
  setIsContributeModalOpen: (open: boolean) => void;
  contributeGoalTarget: SavingsGoal | null;
  setContributeGoalTarget: (goal: SavingsGoal | null) => void;
  isRecurringModalOpen: boolean;
  setIsRecurringModalOpen: (open: boolean) => void;
  isPresetModalOpen: boolean;
  setIsPresetModalOpen: (open: boolean) => void;
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;
  editingExpense: Expense | null;
  setEditingExpense: (expense: Expense | null) => void;
  deletingExpense: Expense | null;
  setDeletingExpense: (expense: Expense | null) => void;
  // Feedback
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [viewMode, setViewMode] = useState<'mobile' | 'fluid'>('mobile');

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('student_theme_dark');
    return saved !== null ? saved === 'true' : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('student_theme_dark', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => storageService.getUserProfile());

  const updateUserProfile = (patch: Partial<UserProfile>) => {
    const updated = storageService.updateUserProfile(patch);
    setUserProfile(updated);
    showToast('Profile preferences updated.');
  };

  // Expenses & Budgets
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [currentBudget, setCurrentBudget] = useState<number>(650000);
  const [categoryBudgets, setCategoryBudgets] = useState<Partial<Record<ExpenseCategory, number>>>({});

  // Savings & Recurring & Presets
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [quickPresets, setQuickPresets] = useState<QuickAddPreset[]>([]);

  // Modals state
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isCategoryBudgetModalOpen, setIsCategoryBudgetModalOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [contributeGoalTarget, setContributeGoalTarget] = useState<SavingsGoal | null>(null);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  // Toast
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2800);
  }, []);

  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    storageService.init();
    const rawAll = storageService.getExpenses({ sortBy: 'newest' });
    setAllExpenses(rawAll);

    const b = storageService.getBudget(currentMonth, currentYear);
    setCurrentBudget(b.amount);
    setCategoryBudgets(b.categoryBudgets);

    setSavingsGoals(storageService.getSavingsGoals());
    setRecurringExpenses(storageService.getRecurringExpenses());
    setQuickPresets(storageService.getQuickPresets());
  }, [currentMonth, currentYear, refreshTrigger]);

  const setMonthYear = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  // Month filtered expenses
  const monthExpenses = useMemo(() => {
    const monthStr = String(currentMonth).padStart(2, '0');
    const prefix = `${currentYear}-${monthStr}`;
    return allExpenses.filter((e) => e.date.startsWith(prefix));
  }, [allExpenses, currentMonth, currentYear]);

  // Previous month expenses
  const previousMonthExpenses = useMemo(() => {
    const prevM = currentMonth > 1 ? currentMonth - 1 : 12;
    const prevY = currentMonth > 1 ? currentYear : currentYear - 1;
    const monthStr = String(prevM).padStart(2, '0');
    const prefix = `${prevY}-${monthStr}`;
    return allExpenses.filter((e) => e.date.startsWith(prefix));
  }, [allExpenses, currentMonth, currentYear]);

  const previousMonthTotalPaise = useMemo(() => {
    return previousMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [previousMonthExpenses]);

  // Total spent in this month
  const totalMonthSpentPaise = useMemo(() => {
    return monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [monthExpenses]);

  // Recent 5 expenses (all time)
  const recentExpenses = useMemo(() => {
    return allExpenses.slice(0, 5);
  }, [allExpenses]);

  // Metrics
  const metrics = useMemo(() => {
    return calculateBudgetMetrics(
      currentBudget,
      totalMonthSpentPaise,
      currentMonth,
      currentYear,
      userProfile.warningThresholdPercent || 80
    );
  }, [currentBudget, totalMonthSpentPaise, currentMonth, currentYear, userProfile.warningThresholdPercent]);

  // Category Budget Details
  const categoryBudgetDetails = useMemo(() => {
    return calculateCategoryBudgetDetails(
      monthExpenses,
      categoryBudgets,
      userProfile.warningThresholdPercent || 80
    );
  }, [monthExpenses, categoryBudgets, userProfile.warningThresholdPercent]);

  // CRUD actions - Expenses
  const addExpense = (data: {
    title: string;
    amountPaise: number;
    category: ExpenseCategory;
    date: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => {
    storageService.addExpense(data);
    refreshData();
    showToast('Expense recorded successfully! 🎉', 'success');
  };

  const updateExpense = (
    id: string,
    data: {
      title: string;
      amountPaise: number;
      category: ExpenseCategory;
      date: string;
      paymentMethod: PaymentMethod;
      notes?: string;
    }
  ) => {
    storageService.updateExpense(id, data);
    refreshData();
    setEditingExpense(null);
    showToast('Expense updated successfully.', 'success');
  };

  const deleteExpense = (id: string) => {
    storageService.deleteExpense(id);
    refreshData();
    setDeletingExpense(null);
    showToast('Expense removed from history.', 'info');
  };

  const updateBudget = (amountPaise: number, newCategoryBudgets?: Partial<Record<ExpenseCategory, number>>) => {
    const catsToSave = newCategoryBudgets !== undefined ? newCategoryBudgets : categoryBudgets;
    storageService.setBudget(currentMonth, currentYear, amountPaise, catsToSave);
    setCurrentBudget(amountPaise);
    if (newCategoryBudgets !== undefined) {
      setCategoryBudgets(newCategoryBudgets);
    }
    setIsBudgetModalOpen(false);
    refreshData();
    showToast('Monthly budget updated.', 'success');
  };

  const updateCategoryBudgets = (budgets: Partial<Record<ExpenseCategory, number>>) => {
    storageService.setCategoryBudgets(currentMonth, currentYear, budgets);
    setCategoryBudgets(budgets);
    setIsCategoryBudgetModalOpen(false);
    refreshData();
    showToast('Category allocations updated.', 'success');
  };

  // Savings Goals Actions
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    storageService.addSavingsGoal(goal);
    refreshData();
    showToast(`Savings goal "${goal.title}" created! 🎯`, 'success');
  };

  const updateSavingsGoal = (id: string, updates: Partial<Omit<SavingsGoal, 'id' | 'createdAt'>>) => {
    storageService.updateSavingsGoal(id, updates);
    refreshData();
    showToast('Goal updated successfully.', 'success');
  };

  const deleteSavingsGoal = (id: string) => {
    storageService.deleteSavingsGoal(id);
    refreshData();
    showToast('Goal deleted.', 'info');
  };

  const contributeToGoal = (id: string, amountPaiseDelta: number) => {
    storageService.contributeToGoal(id, amountPaiseDelta);
    refreshData();
    setIsContributeModalOpen(false);
    setContributeGoalTarget(null);
    showToast(
      amountPaiseDelta >= 0
        ? 'Contribution added to goal! 💰'
        : 'Funds withdrawn from goal.',
      'success'
    );
  };

  // Recurring Expenses Actions
  const addRecurringExpense = (item: Omit<RecurringExpense, 'id' | 'createdAt'>) => {
    storageService.addRecurringExpense(item);
    refreshData();
    showToast(`Recurring reminder "${item.title}" added! ⏰`, 'success');
  };

  const updateRecurringExpense = (id: string, updates: Partial<Omit<RecurringExpense, 'id' | 'createdAt'>>) => {
    storageService.updateRecurringExpense(id, updates);
    refreshData();
    showToast('Recurring expense updated.', 'success');
  };

  const deleteRecurringExpense = (id: string) => {
    storageService.deleteRecurringExpense(id);
    refreshData();
    showToast('Recurring expense removed.', 'info');
  };

  const markRecurringAsPaid = (id: string) => {
    try {
      storageService.markRecurringAsPaid(id, currentMonth, currentYear);
      refreshData();
      showToast('Marked as paid and recorded in transactions! ✅', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Could not record recurring payment', 'error');
    }
  };

  // Presets Actions
  const addQuickPreset = (preset: Omit<QuickAddPreset, 'id'>) => {
    storageService.addQuickPreset(preset);
    refreshData();
    showToast(`Added quick template "${preset.title}"`, 'success');
  };

  const deleteQuickPreset = (id: string) => {
    storageService.deleteQuickPreset(id);
    refreshData();
    showToast('Template removed.', 'info');
  };

  const resetDemoData = () => {
    storageService.resetToDemo();
    setUserProfile(storageService.getUserProfile());
    refreshData();
    showToast('Demo student data restored.', 'info');
  };

  const clearAllExpenses = () => {
    storageService.clearAll();
    refreshData();
    showToast('All transaction records cleared.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentMonth,
        currentYear,
        setMonthYear,
        expenses: monthExpenses,
        allExpenses,
        previousMonthExpenses,
        previousMonthTotalPaise,
        recentExpenses,
        currentBudget,
        categoryBudgets,
        updateCategoryBudgets,
        categoryBudgetDetails,
        metrics,
        userProfile,
        updateUserProfile,
        isDarkMode,
        toggleDarkMode,
        viewMode,
        setViewMode,
        addExpense,
        updateExpense,
        deleteExpense,
        updateBudget,
        resetDemoData,
        clearAllExpenses,
        // Savings
        savingsGoals,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        contributeToGoal,
        // Recurring
        recurringExpenses,
        addRecurringExpense,
        updateRecurringExpense,
        deleteRecurringExpense,
        markRecurringAsPaid,
        // Presets
        quickPresets,
        addQuickPreset,
        deleteQuickPreset,
        // Modals
        isBudgetModalOpen,
        setIsBudgetModalOpen,
        isCategoryBudgetModalOpen,
        setIsCategoryBudgetModalOpen,
        isSavingsModalOpen,
        setIsSavingsModalOpen,
        isContributeModalOpen,
        setIsContributeModalOpen,
        contributeGoalTarget,
        setContributeGoalTarget,
        isRecurringModalOpen,
        setIsRecurringModalOpen,
        isPresetModalOpen,
        setIsPresetModalOpen,
        isHelpModalOpen,
        setIsHelpModalOpen,
        editingExpense,
        setEditingExpense,
        deletingExpense,
        setDeletingExpense,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

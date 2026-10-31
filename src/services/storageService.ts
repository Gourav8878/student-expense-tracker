import {
  Expense,
  MonthlyBudget,
  UserProfile,
  ExpenseCategory,
  PaymentMethod,
  SortOption,
  SavingsGoal,
  RecurringExpense,
  QuickAddPreset,
} from '../types';

const STORAGE_KEY_EXPENSES = 'student_tracker_expenses';
const STORAGE_KEY_BUDGETS = 'student_tracker_budgets';
const STORAGE_KEY_PROFILE = 'student_tracker_profile';
const STORAGE_KEY_SAVINGS = 'student_tracker_savings_goals';
const STORAGE_KEY_RECURRING = 'student_tracker_recurring';
const STORAGE_KEY_PRESETS = 'student_tracker_presets';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@campus.edu.in',
  college: 'National Institute of Technology',
  currency: 'INR',
  currencySymbol: '₹',
  dailyAlertEnabled: true,
  warningThresholdPercent: 80,
};

const DEFAULT_PRESETS: QuickAddPreset[] = [
  { id: 'p_1', title: 'Mess Thali Lunch', category: 'food', amountPaise: 9000 },
  { id: 'p_2', title: 'Chai & Samosa Snack', category: 'snacks', amountPaise: 3500 },
  { id: 'p_3', title: 'Metro / Auto Transit', category: 'travel', amountPaise: 4000 },
  { id: 'p_4', title: 'Stationery & Xerox Copies', category: 'education', amountPaise: 6000 },
  { id: 'p_5', title: 'Hostel Laundromat', category: 'hostel', amountPaise: 10000 },
  { id: 'p_6', title: 'Late Night Maggie', category: 'snacks', amountPaise: 4000 },
];

export const generateSeedData = (): {
  expenses: Expense[];
  budgets: MonthlyBudget[];
  savings: SavingsGoal[];
  recurring: RecurringExpense[];
  presets: QuickAddPreset[];
} => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthStr = String(month).padStart(2, '0');

  // Previous month helper
  const prevMonth = month > 1 ? month - 1 : 12;
  const prevYear = month > 1 ? year : year - 1;
  const prevMonthStr = String(prevMonth).padStart(2, '0');

  // Default category budgets for ₹6,500 budget
  const defaultCategoryBudgets: Partial<Record<ExpenseCategory, number>> = {
    food: 250000, // ₹2,500
    snacks: 70000, // ₹700
    travel: 60000, // ₹600
    education: 80000, // ₹800
    bills: 50000, // ₹500
    entertainment: 40000, // ₹400
    hostel: 30000, // ₹300
    personal: 30000, // ₹300
    healthcare: 20000, // ₹200
    shopping: 20000, // ₹200
  };

  const budgets: MonthlyBudget[] = [
    {
      id: `b_${year}_${month}`,
      month,
      year,
      amount: 650000, // ₹6,500 monthly student budget
      categoryBudgets: defaultCategoryBudgets,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: `b_${prevYear}_${prevMonth}`,
      month: prevMonth,
      year: prevYear,
      amount: 600000, // ₹6,000 previous month budget
      categoryBudgets: {
        food: 220000,
        snacks: 60000,
        travel: 50000,
        education: 100000,
        bills: 50000,
        entertainment: 50000,
        hostel: 30000,
        personal: 20000,
        healthcare: 20000,
      },
      createdAt: new Date(prevYear, prevMonth - 1, 1).toISOString(),
      updatedAt: new Date(prevYear, prevMonth - 1, 1).toISOString(),
    },
  ];

  const d = (day: number) => {
    const dayStr = String(Math.min(day, 28)).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  };

  const dPrev = (day: number) => {
    const dayStr = String(Math.min(day, 28)).padStart(2, '0');
    return `${prevYear}-${prevMonthStr}-${dayStr}`;
  };

  const expenses: Expense[] = [
    // Current Month Expenses
    {
      id: 'exp_1',
      title: 'College Mess Monthly Advance',
      amount: 220000, // ₹2,200
      category: 'food',
      date: d(2),
      paymentMethod: 'UPI',
      notes: 'Paid via GPay to Canteen contractor',
      createdAt: new Date(year, month - 1, 2, 10, 30).toISOString(),
      updatedAt: new Date(year, month - 1, 2, 10, 30).toISOString(),
    },
    {
      id: 'exp_2',
      title: 'Engineering Mechanics Textbook & Notes',
      amount: 68000, // ₹680
      category: 'education',
      date: d(4),
      paymentMethod: 'UPI',
      notes: 'Campus bookstore 2nd hand edition',
      createdAt: new Date(year, month - 1, 4, 16, 20).toISOString(),
      updatedAt: new Date(year, month - 1, 4, 16, 20).toISOString(),
    },
    {
      id: 'exp_3',
      title: 'Monthly Student Bus / Metro Pass',
      amount: 45000, // ₹450
      category: 'travel',
      date: d(5),
      paymentMethod: 'Debit Card',
      notes: 'City transit student concessional card',
      createdAt: new Date(year, month - 1, 5, 9, 15).toISOString(),
      updatedAt: new Date(year, month - 1, 5, 9, 15).toISOString(),
    },
    {
      id: 'exp_4',
      title: 'Evening Chai, Samosas & Maggie with Study Group',
      amount: 14000, // ₹140
      category: 'snacks',
      date: d(8),
      paymentMethod: 'Cash',
      notes: 'Tappu tapri near Gate 3',
      createdAt: new Date(year, month - 1, 8, 18, 45).toISOString(),
      updatedAt: new Date(year, month - 1, 8, 18, 45).toISOString(),
    },
    {
      id: 'exp_5',
      title: 'Mobile 5G Recharge (84 days plan share)',
      amount: 29900, // ₹299
      category: 'bills',
      date: d(11),
      paymentMethod: 'UPI',
      notes: 'Jio True5G unlimited data',
      createdAt: new Date(year, month - 1, 11, 12, 10).toISOString(),
      updatedAt: new Date(year, month - 1, 11, 12, 10).toISOString(),
    },
    {
      id: 'exp_6',
      title: 'Hostel Room Laundry & Detergent',
      amount: 18000, // ₹180
      category: 'hostel',
      date: d(14),
      paymentMethod: 'Cash',
      notes: 'Washing machine tokens & Surf Excel',
      createdAt: new Date(year, month - 1, 14, 14, 0).toISOString(),
      updatedAt: new Date(year, month - 1, 14, 14, 0).toISOString(),
    },
    {
      id: 'exp_7',
      title: 'Weekend Movie Ticket with Roommates',
      amount: 25000, // ₹250
      category: 'entertainment',
      date: d(18),
      paymentMethod: 'UPI',
      notes: 'BookMyShow student morning show discount',
      createdAt: new Date(year, month - 1, 18, 11, 30).toISOString(),
      updatedAt: new Date(year, month - 1, 18, 11, 30).toISOString(),
    },
    {
      id: 'exp_8',
      title: 'Haircut & Personal Grooming Kit',
      amount: 16000, // ₹160
      category: 'personal',
      date: d(21),
      paymentMethod: 'UPI',
      notes: 'Campus unisex salon',
      createdAt: new Date(year, month - 1, 21, 17, 0).toISOString(),
      updatedAt: new Date(year, month - 1, 21, 17, 0).toISOString(),
    },
    {
      id: 'exp_9',
      title: 'Cold Medicine & Paracetamol',
      amount: 12000, // ₹120
      category: 'healthcare',
      date: d(23),
      paymentMethod: 'Cash',
      notes: 'Apollo pharmacy near hostel',
      createdAt: new Date(year, month - 1, 23, 20, 15).toISOString(),
      updatedAt: new Date(year, month - 1, 23, 20, 15).toISOString(),
    },
    {
      id: 'exp_10',
      title: 'Late Night Library Canteen Snack',
      amount: 9500, // ₹95
      category: 'snacks',
      date: d(25),
      paymentMethod: 'UPI',
      notes: 'Cold coffee and sandwich during mid-terms',
      createdAt: new Date(year, month - 1, 25, 23, 10).toISOString(),
      updatedAt: new Date(year, month - 1, 25, 23, 10).toISOString(),
    },

    // Previous Month Historical Expenses (for MoM calculations)
    {
      id: 'exp_prev_1',
      title: 'Previous Mess Bill',
      amount: 210000, // ₹2,100
      category: 'food',
      date: dPrev(2),
      paymentMethod: 'UPI',
      notes: 'Mess dues',
      createdAt: new Date(prevYear, prevMonth - 1, 2).toISOString(),
      updatedAt: new Date(prevYear, prevMonth - 1, 2).toISOString(),
    },
    {
      id: 'exp_prev_2',
      title: 'Semester Midterm Exam Fee & Forms',
      amount: 120000, // ₹1,200
      category: 'education',
      date: dPrev(7),
      paymentMethod: 'Net Banking',
      notes: 'Exam portal receipt',
      createdAt: new Date(prevYear, prevMonth - 1, 7).toISOString(),
      updatedAt: new Date(prevYear, prevMonth - 1, 7).toISOString(),
    },
    {
      id: 'exp_prev_3',
      title: 'Bus Pass Monthly',
      amount: 45000, // ₹450
      category: 'travel',
      date: dPrev(10),
      paymentMethod: 'Debit Card',
      notes: 'City transit card',
      createdAt: new Date(prevYear, prevMonth - 1, 10).toISOString(),
      updatedAt: new Date(prevYear, prevMonth - 1, 10).toISOString(),
    },
    {
      id: 'exp_prev_4',
      title: 'Cafe Snacks & Chai',
      amount: 32000, // ₹320
      category: 'snacks',
      date: dPrev(15),
      paymentMethod: 'Cash',
      notes: 'Chai sessions',
      createdAt: new Date(prevYear, prevMonth - 1, 15).toISOString(),
      updatedAt: new Date(prevYear, prevMonth - 1, 15).toISOString(),
    },
    {
      id: 'exp_prev_5',
      title: 'Dorm Wi-Fi Share',
      amount: 25000, // ₹250
      category: 'bills',
      date: dPrev(22),
      paymentMethod: 'UPI',
      notes: 'Router contribution',
      createdAt: new Date(prevYear, prevMonth - 1, 22).toISOString(),
      updatedAt: new Date(prevYear, prevMonth - 1, 22).toISOString(),
    },
  ];

  // Savings Goals Seed Data
  const targetDate1 = new Date();
  targetDate1.setDate(targetDate1.getDate() + 45); // in 45 days
  const targetDate2 = new Date();
  targetDate2.setDate(targetDate2.getDate() + 90); // in 90 days

  const savings: SavingsGoal[] = [
    {
      id: 'sg_1',
      title: 'Semester Exam Registration Fee',
      targetAmount: 250000, // ₹2,500
      savedAmount: 180000, // ₹1,800 saved
      targetDate: targetDate1.toISOString().slice(0, 10),
      category: 'Academic',
      color: '#8B5CF6',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sg_2',
      title: 'Diwali Festival Trip Home (Train Ticket)',
      targetAmount: 350000, // ₹3,500
      savedAmount: 220000, // ₹2,200 saved
      targetDate: targetDate2.toISOString().slice(0, 10),
      category: 'Travel',
      color: '#3B82F6',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sg_3',
      title: 'Hostel Emergency Medical Buffer',
      targetAmount: 500000, // ₹5,000
      savedAmount: 350000, // ₹3,500 saved
      category: 'Emergency',
      color: '#10B981',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Recurring Expenses Seed Data
  const recurring: RecurringExpense[] = [
    {
      id: 'rec_1',
      title: 'College Mess Monthly Advance',
      amount: 220000, // ₹2,200
      category: 'food',
      paymentMethod: 'UPI',
      dueDay: 2,
      frequency: 'monthly',
      notes: 'Due on 2nd of each month to hostel warden',
      lastPaidMonthYear: `${year}-${monthStr}`,
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rec_2',
      title: 'Mobile 5G Data Recharge',
      amount: 29900, // ₹299
      category: 'bills',
      paymentMethod: 'UPI',
      dueDay: 15,
      frequency: 'monthly',
      notes: 'Prepaid renewal',
      lastPaidMonthYear: '',
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rec_3',
      title: 'Hostel Room Wi-Fi Router Share',
      amount: 20000, // ₹200
      category: 'bills',
      paymentMethod: 'UPI',
      dueDay: 25,
      frequency: 'monthly',
      notes: 'Split among 4 roommates',
      lastPaidMonthYear: '',
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];

  return { expenses, budgets, savings, recurring, presets: DEFAULT_PRESETS };
};

export const storageService = {
  init() {
    const existingExpenses = localStorage.getItem(STORAGE_KEY_EXPENSES);
    const existingBudgets = localStorage.getItem(STORAGE_KEY_BUDGETS);
    const existingSavings = localStorage.getItem(STORAGE_KEY_SAVINGS);
    const existingRecurring = localStorage.getItem(STORAGE_KEY_RECURRING);
    const existingPresets = localStorage.getItem(STORAGE_KEY_PRESETS);

    if (!existingExpenses || !existingBudgets || !existingSavings || !existingRecurring) {
      const seed = generateSeedData();
      if (!existingExpenses) {
        localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(seed.expenses));
      }
      if (!existingBudgets) {
        localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(seed.budgets));
      }
      if (!existingSavings) {
        localStorage.setItem(STORAGE_KEY_SAVINGS, JSON.stringify(seed.savings));
      }
      if (!existingRecurring) {
        localStorage.setItem(STORAGE_KEY_RECURRING, JSON.stringify(seed.recurring));
      }
      if (!existingPresets) {
        localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(seed.presets));
      }
    }

    if (!localStorage.getItem(STORAGE_KEY_PROFILE)) {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(DEFAULT_PROFILE));
    }
  },

  // EXPENSES CRUD
  getExpenses(filters?: {
    month?: number;
    year?: number;
    search?: string;
    category?: ExpenseCategory | 'all';
    paymentMethod?: PaymentMethod | 'all';
    sortBy?: SortOption;
  }): Expense[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEY_EXPENSES);
      let list: Expense[] = data ? JSON.parse(data) : [];

      if (filters?.month !== undefined && filters?.year !== undefined) {
        const monthStr = String(filters.month).padStart(2, '0');
        const prefix = `${filters.year}-${monthStr}`;
        list = list.filter((e) => e.date.startsWith(prefix));
      }

      if (filters?.search && filters.search.trim().length > 0) {
        const q = filters.search.trim().toLowerCase();
        list = list.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            (e.notes && e.notes.toLowerCase().includes(q)) ||
            e.category.toLowerCase().includes(q)
        );
      }

      if (filters?.category && filters.category !== 'all') {
        list = list.filter((e) => e.category === filters.category);
      }

      if (filters?.paymentMethod && filters.paymentMethod !== 'all') {
        list = list.filter((e) => e.paymentMethod === filters.paymentMethod);
      }

      const sortBy = filters?.sortBy || 'newest';
      list.sort((a, b) => {
        if (sortBy === 'oldest') {
          return new Date(a.date).getTime() - new Date(b.date).getTime() || a.id.localeCompare(b.id);
        }
        if (sortBy === 'highest') {
          return b.amount - a.amount;
        }
        if (sortBy === 'lowest') {
          return a.amount - b.amount;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime() || b.id.localeCompare(a.id);
      });

      return list;
    } catch {
      return [];
    }
  },

  addExpense(data: {
    title: string;
    amountPaise: number;
    category: ExpenseCategory;
    date: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Expense {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY_EXPENSES);
    const list: Expense[] = raw ? JSON.parse(raw) : [];

    const newExpense: Expense = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: data.title.trim(),
      amount: data.amountPaise,
      category: data.category,
      date: data.date,
      paymentMethod: data.paymentMethod,
      notes: data.notes?.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.unshift(newExpense);
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(list));
    return newExpense;
  },

  updateExpense(
    id: string,
    data: {
      title: string;
      amountPaise: number;
      category: ExpenseCategory;
      date: string;
      paymentMethod: PaymentMethod;
      notes?: string;
    }
  ): Expense {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY_EXPENSES);
    const list: Expense[] = raw ? JSON.parse(raw) : [];

    const index = list.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error(`Expense with ID ${id} not found.`);
    }

    const updated: Expense = {
      ...list[index],
      title: data.title.trim(),
      amount: data.amountPaise,
      category: data.category,
      date: data.date,
      paymentMethod: data.paymentMethod,
      notes: data.notes?.trim() || '',
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(list));
    return updated;
  },

  deleteExpense(id: string): void {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY_EXPENSES);
    if (!raw) return;
    const list: Expense[] = JSON.parse(raw);
    const filtered = list.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(filtered));
  },

  // BUDGETS & CATEGORY BUDGETS CRUD
  getBudget(month: number, year: number): { amount: number; categoryBudgets: Partial<Record<ExpenseCategory, number>> } {
    this.init();
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BUDGETS);
      const list: MonthlyBudget[] = raw ? JSON.parse(raw) : [];
      const found = list.find((b) => b.month === month && b.year === year);
      return {
        amount: found ? found.amount : 650000,
        categoryBudgets: found?.categoryBudgets || {},
      };
    } catch {
      return { amount: 650000, categoryBudgets: {} };
    }
  },

  setBudget(month: number, year: number, amountPaise: number, categoryBudgets?: Partial<Record<ExpenseCategory, number>>): void {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY_BUDGETS);
    let list: MonthlyBudget[] = raw ? JSON.parse(raw) : [];

    const index = list.findIndex((b) => b.month === month && b.year === year);
    if (index !== -1) {
      list[index].amount = amountPaise;
      if (categoryBudgets !== undefined) {
        list[index].categoryBudgets = categoryBudgets;
      }
      list[index].updatedAt = new Date().toISOString();
    } else {
      list.push({
        id: `b_${year}_${month}`,
        month,
        year,
        amount: amountPaise,
        categoryBudgets: categoryBudgets || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(list));
  },

  setCategoryBudgets(month: number, year: number, categoryBudgets: Partial<Record<ExpenseCategory, number>>): void {
    this.init();
    const current = this.getBudget(month, year);
    this.setBudget(month, year, current.amount, categoryBudgets);
  },

  // SAVINGS GOALS CRUD
  getSavingsGoals(): SavingsGoal[] {
    this.init();
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SAVINGS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>): SavingsGoal {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY_SAVINGS);
    const list: SavingsGoal[] = raw ? JSON.parse(raw) : [];

    const newGoal: SavingsGoal = {
      ...goal,
      id: `sg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.unshift(newGoal);
    localStorage.setItem(STORAGE_KEY_SAVINGS, JSON.stringify(list));
    return newGoal;
  },

  updateSavingsGoal(id: string, updates: Partial<Omit<SavingsGoal, 'id' | 'createdAt'>>): SavingsGoal {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY_SAVINGS);
    const list: SavingsGoal[] = raw ? JSON.parse(raw) : [];

    const index = list.findIndex((g) => g.id === id);
    if (index === -1) {
      throw new Error(`Savings Goal ${id} not found`);
    }

    const updated: SavingsGoal = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    localStorage.setItem(STORAGE_KEY_SAVINGS, JSON.stringify(list));
    return updated;
  },

  deleteSavingsGoal(id: string): void {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY_SAVINGS);
    if (!raw) return;
    const list: SavingsGoal[] = JSON.parse(raw);
    const filtered = list.filter((g) => g.id !== id);
    localStorage.setItem(STORAGE_KEY_SAVINGS, JSON.stringify(filtered));
  },

  contributeToGoal(id: string, amountPaiseDelta: number): SavingsGoal {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY_SAVINGS);
    const list: SavingsGoal[] = raw ? JSON.parse(raw) : [];

    const index = list.findIndex((g) => g.id === id);
    if (index === -1) {
      throw new Error(`Savings Goal ${id} not found`);
    }

    const current = list[index];
    const newSaved = Math.max(0, current.savedAmount + amountPaiseDelta);
    const updated: SavingsGoal = {
      ...current,
      savedAmount: newSaved,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    localStorage.setItem(STORAGE_KEY_SAVINGS, JSON.stringify(list));
    return updated;
  },

  // RECURRING EXPENSES CRUD
  getRecurringExpenses(): RecurringExpense[] {
    this.init();
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RECURRING);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addRecurringExpense(item: Omit<RecurringExpense, 'id' | 'createdAt'>): RecurringExpense {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY_RECURRING);
    const list: RecurringExpense[] = raw ? JSON.parse(raw) : [];

    const newItem: RecurringExpense = {
      ...item,
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };

    list.push(newItem);
    localStorage.setItem(STORAGE_KEY_RECURRING, JSON.stringify(list));
    return newItem;
  },

  updateRecurringExpense(id: string, updates: Partial<Omit<RecurringExpense, 'id' | 'createdAt'>>): RecurringExpense {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY_RECURRING);
    const list: RecurringExpense[] = raw ? JSON.parse(raw) : [];

    const index = list.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Recurring expense not found');

    const updated = { ...list[index], ...updates };
    list[index] = updated;
    localStorage.setItem(STORAGE_KEY_RECURRING, JSON.stringify(list));
    return updated;
  },

  deleteRecurringExpense(id: string): void {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY_RECURRING);
    if (!raw) return;
    const list: RecurringExpense[] = JSON.parse(raw);
    const filtered = list.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY_RECURRING, JSON.stringify(filtered));
  },

  markRecurringAsPaid(id: string, month: number, year: number): Expense {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY_RECURRING);
    const list: RecurringExpense[] = raw ? JSON.parse(raw) : [];

    const index = list.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Recurring expense not found');

    const rec = list[index];
    const monthStr = String(month).padStart(2, '0');
    const cycleTag = `${year}-${monthStr}`;

    if (rec.lastPaidMonthYear === cycleTag) {
      throw new Error(`"${rec.title}" is already recorded as paid for ${cycleTag}.`);
    }

    // Add to expenses
    const dueDayPadded = String(Math.min(rec.dueDay, 28)).padStart(2, '0');
    const expenseDate = `${year}-${monthStr}-${dueDayPadded}`;

    const newExpense = this.addExpense({
      title: `${rec.title} (Recurring)`,
      amountPaise: rec.amount,
      category: rec.category,
      date: expenseDate,
      paymentMethod: rec.paymentMethod,
      notes: rec.notes ? `${rec.notes} [Auto-recorded from Recurring]` : '[Auto-recorded from Recurring]',
    });

    // Mark updated in recurring
    rec.lastPaidMonthYear = cycleTag;
    list[index] = rec;
    localStorage.setItem(STORAGE_KEY_RECURRING, JSON.stringify(list));

    return newExpense;
  },

  // PRESETS CRUD
  getQuickPresets(): QuickAddPreset[] {
    this.init();
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PRESETS);
      return raw ? JSON.parse(raw) : DEFAULT_PRESETS;
    } catch {
      return DEFAULT_PRESETS;
    }
  },

  addQuickPreset(preset: Omit<QuickAddPreset, 'id'>): QuickAddPreset {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY_PRESETS);
    const list: QuickAddPreset[] = raw ? JSON.parse(raw) : DEFAULT_PRESETS;

    const newItem: QuickAddPreset = {
      ...preset,
      id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };

    list.push(newItem);
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(list));
    return newItem;
  },

  deleteQuickPreset(id: string): void {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY_PRESETS);
    if (!raw) return;
    const list: QuickAddPreset[] = JSON.parse(raw);
    const filtered = list.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(filtered));
  },

  // USER PROFILE
  getUserProfile(): UserProfile {
    this.init();
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
      return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  updateUserProfile(profile: Partial<UserProfile>): UserProfile {
    this.init();
    const current = this.getUserProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));
    return updated;
  },

  resetToDemo(): void {
    const seed = generateSeedData();
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(seed.expenses));
    localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(seed.budgets));
    localStorage.setItem(STORAGE_KEY_SAVINGS, JSON.stringify(seed.savings));
    localStorage.setItem(STORAGE_KEY_RECURRING, JSON.stringify(seed.recurring));
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(seed.presets));
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(DEFAULT_PROFILE));
  },

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY_EXPENSES);
    localStorage.removeItem(STORAGE_KEY_BUDGETS);
    localStorage.removeItem(STORAGE_KEY_SAVINGS);
    localStorage.removeItem(STORAGE_KEY_RECURRING);
    localStorage.removeItem(STORAGE_KEY_PRESETS);
    this.init();
  },
};

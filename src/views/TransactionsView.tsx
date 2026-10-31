import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Filter,
  Receipt,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, PAYMENT_METHODS } from '../constants/categories';
import { ExpenseCategory, PaymentMethod, SortOption } from '../types';
import { ExpenseItem } from '../components/ExpenseItem';
import { EmptyState } from '../components/EmptyState';
import { formatRupee } from '../utils/calculations';
import { exportTransactionsToCSV } from '../utils/csvExport';

export const TransactionsView: React.FC = () => {
  const {
    expenses,
    setActiveTab,
    setEditingExpense,
    setDeletingExpense,
    currentMonth,
    currentYear,
    showToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Filtered and sorted transactions
  const filteredList = useMemo(() => {
    let result = [...expenses];

    // Search query
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.notes && item.notes.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q) ||
          item.paymentMethod.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Payment method filter
    if (selectedPaymentMethod !== 'all') {
      result = result.filter((item) => item.paymentMethod === selectedPaymentMethod);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'highest') {
        return b.amount - a.amount;
      }
      if (sortBy === 'lowest') {
        return a.amount - b.amount;
      }
      // newest
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return result;
  }, [expenses, search, selectedCategory, selectedPaymentMethod, sortBy]);

  const totalFilteredPaise = useMemo(() => {
    return filteredList.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredList]);

  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const handleExportCSV = () => {
    const res = exportTransactionsToCSV(filteredList);
    if (res.success) {
      showToast('CSV file downloaded successfully!');
    } else {
      showToast(res.error || 'Failed to export CSV', 'error');
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Transaction History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {monthName} · {filteredList.length} expenses ({formatRupee(totalFilteredPaise)})
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          title="Export Filtered CSV"
        >
          <Download className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Export</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, notes, or payment..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Horizontal Category Filter Pills (Functional Buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
          }`}
        >
          All Categories
        </button>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Secondary Filter & Sort Bar */}
      <div className="flex items-center justify-between gap-2 text-xs">
        {/* Payment Method Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value as PaymentMethod | 'all')}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="all">All Payment Methods</option>
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.id}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="mt-3 space-y-2">
        {filteredList.length === 0 ? (
          <EmptyState
            title="No Transactions Match"
            subtitle={
              search || selectedCategory !== 'all' || selectedPaymentMethod !== 'all'
                ? 'Try clearing or loosening your filters.'
                : 'No expenses recorded for this month yet.'
            }
            buttonTitle="Add an Expense"
            onButtonPress={() => setActiveTab('add')}
          />
        ) : (
          filteredList.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={setEditingExpense}
              onDelete={setDeletingExpense}
            />
          ))
        )}
      </div>
    </div>
  );
};

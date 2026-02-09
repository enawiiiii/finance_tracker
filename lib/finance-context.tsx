import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { Transaction, TransactionType, MonthData, FinancialIdentity } from './types';
import { loadTransactions, saveTransactions } from './storage';
import { generateMonthsRange, computeFinancialIdentity, getMonthKey, generateId } from './finance-utils';
import { useSettings } from './settings-context';

interface FinanceContextValue {
  transactions: Transaction[];
  months: MonthData[];
  currentMonthKey: string;
  selectedMonthKey: string;
  setSelectedMonthKey: (key: string) => void;
  selectedMonth: MonthData | null;
  identity: FinancialIdentity;
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  addTransaction: (data: { amount: number; type: TransactionType; category: string; note: string; date: string }) => void;
  editTransaction: (id: string, data: { amount: number; type: TransactionType; category: string; note: string; date: string }) => void;
  deleteTransaction: (id: string) => void;
  isLoading: boolean;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { language } = useSettings();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentMonthKey = getMonthKey(new Date());
  const [selectedMonthKey, setSelectedMonthKey] = useState(currentMonthKey);

  useEffect(() => {
    loadTransactions().then(data => {
      setTransactions(data);
      setIsLoading(false);
    });
  }, []);

  const addTransaction = useCallback((data: { amount: number; type: TransactionType; category: string; note: string; date: string }) => {
    const newT: Transaction = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => {
      const updated = [...prev, newT];
      saveTransactions(updated);
      return updated;
    });
  }, []);

  const editTransaction = useCallback((id: string, data: { amount: number; type: TransactionType; category: string; note: string; date: string }) => {
    setTransactions(prev => {
      const updated = prev.map(tr => tr.id === id ? { ...tr, ...data } : tr);
      saveTransactions(updated);
      return updated;
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => {
      const updated = prev.filter(tr => tr.id !== id);
      saveTransactions(updated);
      return updated;
    });
  }, []);

  const months = useMemo(() => generateMonthsRange(transactions), [transactions]);
  const selectedMonth = useMemo(() => months.find(m => m.key === selectedMonthKey) || null, [months, selectedMonthKey]);
  const identity = useMemo(() => computeFinancialIdentity(transactions, language), [transactions, language]);

  const totalIncome = useMemo(() => transactions.filter(tr => tr.type === 'income').reduce((s, tr) => s + tr.amount, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(tr => tr.type === 'expense').reduce((s, tr) => s + tr.amount, 0), [transactions]);
  const totalBalance = totalIncome - totalExpense;

  const value = useMemo(() => ({
    transactions,
    months,
    currentMonthKey,
    selectedMonthKey,
    setSelectedMonthKey,
    selectedMonth,
    identity,
    totalIncome,
    totalExpense,
    totalBalance,
    addTransaction,
    editTransaction,
    deleteTransaction,
    isLoading,
  }), [transactions, months, currentMonthKey, selectedMonthKey, selectedMonth, identity, totalIncome, totalExpense, totalBalance, addTransaction, editTransaction, deleteTransaction, isLoading]);

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}

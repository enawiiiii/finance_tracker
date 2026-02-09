import { Transaction, MonthData, FinancialIdentity } from './types';
import { Language, t } from './i18n';

export function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function getMonthLabelShort(key: string): string {
  const [, month] = key.split('-').map(Number);
  const date = new Date(2024, month - 1);
  return date.toLocaleDateString('en-US', { month: 'short' });
}

export function generateMonthsRange(transactions: Transaction[]): MonthData[] {
  const now = new Date();
  const currentKey = getMonthKey(now);

  const allKeys = new Set<string>();
  allKeys.add(currentKey);

  for (let i = -3; i <= 2; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    allKeys.add(getMonthKey(d));
  }

  transactions.forEach(tr => {
    allKeys.add(getMonthKey(new Date(tr.date)));
  });

  const sorted = Array.from(allKeys).sort();

  return sorted.map(key => {
    const [year, month] = key.split('-').map(Number);
    const monthTransactions = transactions.filter(tr => getMonthKey(new Date(tr.date)) === key);
    const income = monthTransactions.filter(tr => tr.type === 'income').reduce((sum, tr) => sum + tr.amount, 0);
    const expense = monthTransactions.filter(tr => tr.type === 'expense').reduce((sum, tr) => sum + tr.amount, 0);
    const balance = income - expense;

    const total = income + expense;
    const stability = total === 0 ? 1 : Math.max(0, Math.min(1, balance / (total || 1)));

    return {
      key,
      label: getMonthLabel(key),
      month,
      year,
      income,
      expense,
      balance,
      transactions: monthTransactions,
      stability: Math.abs(stability),
    };
  });
}

export function computeFinancialIdentity(transactions: Transaction[], lang: Language = 'en'): FinancialIdentity {
  if (transactions.length === 0) {
    return {
      name: t(lang, 'identityExplorer'),
      description: '',
      message: t(lang, 'identityExplorerMsg'),
    };
  }

  const totalIncome = transactions.filter(tr => tr.type === 'income').reduce((s, tr) => s + tr.amount, 0);
  const totalExpense = transactions.filter(tr => tr.type === 'expense').reduce((s, tr) => s + tr.amount, 0);
  const ratio = totalExpense / (totalIncome || 1);

  const recentTransactions = transactions.slice(-10);
  const recentExpenses = recentTransactions.filter(tr => tr.type === 'expense');
  const categories = new Set(recentExpenses.map(tr => tr.category));

  if (ratio < 0.3) {
    return {
      name: t(lang, 'identityBuilder'),
      description: '',
      message: t(lang, 'identityBuilderMsg'),
    };
  }

  if (ratio < 0.6) {
    return {
      name: t(lang, 'identityStabilizer'),
      description: '',
      message: t(lang, 'identityStabilizerMsg'),
    };
  }

  if (ratio < 0.85) {
    return {
      name: t(lang, 'identityObserver'),
      description: '',
      message: t(lang, 'identityObserverMsg'),
    };
  }

  if (categories.size > 5) {
    return {
      name: t(lang, 'identityVoyager'),
      description: '',
      message: t(lang, 'identityVoyagerMsg'),
    };
  }

  return {
    name: t(lang, 'identityDrifter'),
    description: '',
    message: t(lang, 'identityDrifterMsg'),
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
  date: string;
  createdAt: string;
}

export interface MonthData {
  key: string;
  label: string;
  month: number;
  year: number;
  income: number;
  expense: number;
  balance: number;
  transactions: Transaction[];
  stability: number;
}

export type FinancialIdentity = {
  name: string;
  description: string;
  message: string;
};

export const INCOME_CATEGORIES = [
  'Salary',
  'Business / Freelance',
  'Investments',
  'Gifts',
  'Other Income',
] as const;

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Drinks & Coffee',
  'Transportation',
  'Rent / Housing',
  'Utilities',
  'Subscriptions',
  'Shopping',
  'Entertainment',
  'Health',
  'Travel',
  'Education',
  'Other Expenses',
] as const;

export const CATEGORY_ICONS: Record<string, { family: string; name: string }> = {
  'Salary': { family: 'Ionicons', name: 'wallet-outline' },
  'Business / Freelance': { family: 'Ionicons', name: 'briefcase-outline' },
  'Investments': { family: 'Ionicons', name: 'trending-up-outline' },
  'Gifts': { family: 'Ionicons', name: 'gift-outline' },
  'Other Income': { family: 'Ionicons', name: 'add-circle-outline' },
  'Food & Dining': { family: 'Ionicons', name: 'restaurant-outline' },
  'Drinks & Coffee': { family: 'Ionicons', name: 'cafe-outline' },
  'Transportation': { family: 'Ionicons', name: 'car-outline' },
  'Rent / Housing': { family: 'Ionicons', name: 'home-outline' },
  'Utilities': { family: 'Ionicons', name: 'flash-outline' },
  'Subscriptions': { family: 'Ionicons', name: 'card-outline' },
  'Shopping': { family: 'Ionicons', name: 'bag-outline' },
  'Entertainment': { family: 'Ionicons', name: 'film-outline' },
  'Health': { family: 'Ionicons', name: 'heart-outline' },
  'Travel': { family: 'Ionicons', name: 'airplane-outline' },
  'Education': { family: 'Ionicons', name: 'school-outline' },
  'Other Expenses': { family: 'Ionicons', name: 'ellipsis-horizontal-circle-outline' },
};

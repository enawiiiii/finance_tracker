import { MonthData } from './types';

interface PlanetTheme {
  color: string;
  glow: string;
  shadowColor: string;
}

export function getPlanetTheme(month: MonthData): PlanetTheme {
  const { income, expense, balance, transactions, stability } = month;

  if (transactions.length === 0) {
    return {
      color: 'rgba(120, 130, 160, 0.4)',
      glow: 'rgba(120, 130, 160, 0.1)',
      shadowColor: 'rgba(120, 130, 160, 0.3)',
    };
  }

  const total = income + expense;
  const ratio = expense / (income || 1);
  const activity = total;

  if (ratio > 1) {
    return {
      color: '#C4726F',
      glow: 'rgba(196, 114, 111, 0.2)',
      shadowColor: '#C4726F',
    };
  }

  if (ratio > 0.85) {
    return {
      color: '#D4956A',
      glow: 'rgba(212, 149, 106, 0.2)',
      shadowColor: '#D4956A',
    };
  }

  if (ratio > 0.65) {
    return {
      color: '#C9B458',
      glow: 'rgba(201, 180, 88, 0.2)',
      shadowColor: '#C9B458',
    };
  }

  if (stability > 0.6) {
    return {
      color: '#5CB8A5',
      glow: 'rgba(92, 184, 165, 0.2)',
      shadowColor: '#5CB8A5',
    };
  }

  return {
    color: '#6B9FD4',
    glow: 'rgba(107, 159, 212, 0.2)',
    shadowColor: '#6B9FD4',
  };
}

export function getOrbitRings(month: MonthData): { radius: number; opacity: number; color: string }[] {
  if (month.transactions.length === 0) return [];

  const expenses = month.transactions.filter(t => t.type === 'expense');
  if (expenses.length === 0) return [];

  const recurring = new Set<string>();
  const catCounts: Record<string, number> = {};
  expenses.forEach(e => {
    catCounts[e.category] = (catCounts[e.category] || 0) + 1;
    if (catCounts[e.category] > 1) recurring.add(e.category);
  });

  const fixedCats = ['Rent / Housing', 'Utilities', 'Subscriptions'];
  const hasFixed = expenses.some(e => fixedCats.includes(e.category));
  const hasRecurring = recurring.size > 0;
  const hasSurprise = expenses.some(e => !fixedCats.includes(e.category) && !recurring.has(e.category));

  const rings: { radius: number; opacity: number; color: string }[] = [];

  if (hasFixed) {
    rings.push({ radius: 10, opacity: 0.25, color: '#6B9FD4' });
  }
  if (hasRecurring) {
    rings.push({ radius: 16, opacity: 0.18, color: '#C9B458' });
  }
  if (hasSurprise) {
    rings.push({ radius: 22, opacity: 0.12, color: '#D4956A' });
  }

  return rings;
}

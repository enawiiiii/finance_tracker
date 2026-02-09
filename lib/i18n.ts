export type Language = 'en' | 'ar';
export type CurrencyCode = 'USD' | 'AED' | 'EUR' | 'GBP' | 'TRY';

export const CURRENCIES: { code: CurrencyCode; symbol: string; label: string; labelAr: string; locale: string }[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar', labelAr: 'دولار أمريكي', locale: 'en-US' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham', labelAr: 'درهم إماراتي', locale: 'ar-AE' },
  { code: 'EUR', symbol: '\u20AC', label: 'Euro', labelAr: 'يورو', locale: 'de-DE' },
  { code: 'GBP', symbol: '\u00A3', label: 'British Pound', labelAr: 'جنيه إسترليني', locale: 'en-GB' },
  { code: 'TRY', symbol: '\u20BA', label: 'Turkish Lira', labelAr: 'ليرة تركية', locale: 'tr-TR' },
];

const translations = {
  en: {
    totalBalance: 'Total Balance',
    income: 'Income',
    expense: 'Expense',
    in: 'In',
    out: 'Out',
    net: 'Net',
    newEntry: 'New Entry',
    editEntry: 'Edit Entry',
    category: 'Category',
    noteOptional: 'Note (optional)',
    addNote: 'Add a note...',
    date: 'Date',
    logEntry: 'Log Entry',
    updateTrajectory: 'Update Trajectory',
    noSignals: 'No signals this month',
    tapToLog: 'Tap + to log your first entry',
    settings: 'Control Room',
    language: 'Language',
    currency: 'Currency',
    animations: 'Animations',
    silenceMode: 'Silence Mode',
    silenceDesc: 'Hide numbers, keep motion',
    animDesc: 'Visual effects and motion',
    timeWarp: 'Time Warp',
    timeWarpHint: 'What if this didn\'t happen?',
    constellation: 'Annual Constellation',
    english: 'English',
    arabic: 'Arabic',
    catSalary: 'Salary',
    catBusiness: 'Business / Freelance',
    catInvestments: 'Investments',
    catGifts: 'Gifts',
    catOtherIncome: 'Other Income',
    catFood: 'Food & Dining',
    catDrinks: 'Drinks & Coffee',
    catTransport: 'Transportation',
    catRent: 'Rent / Housing',
    catUtilities: 'Utilities',
    catSubscriptions: 'Subscriptions',
    catShopping: 'Shopping',
    catEntertainment: 'Entertainment',
    catHealth: 'Health',
    catTravel: 'Travel',
    catEducation: 'Education',
    catOtherExpenses: 'Other Expenses',
    identityExplorer: 'The Explorer',
    identityExplorerMsg: 'Your orbit awaits. Add your first entry.',
    identityBuilder: 'The Builder',
    identityBuilderMsg: 'Your orbit is strengthening. Resources are gathering.',
    identityStabilizer: 'The Stabilizer',
    identityStabilizerMsg: 'You remained stable. The path is clear.',
    identityObserver: 'The Observer',
    identityObserverMsg: 'Your orbit is shifting. Stay aware.',
    identityVoyager: 'The Voyager',
    identityVoyagerMsg: 'Many signals detected. Consider focusing your path.',
    identityDrifter: 'The Drifter',
    identityDrifterMsg: 'This month drifted slightly. Recalibrate when ready.',
    reflectionSilence: 'Silence in the void. No signals this month.',
    reflectionOutward: 'Resources flowed outward. No signal returned.',
    reflectionSteady: 'This month was steady. You stayed in orbit.',
    reflectionDrift: 'A gentle drift. The balance shifted but held.',
    reflectionPull: 'Gravitational pull was strong. The orbit bent.',
    reflectionMovement: 'This month carried movement. Reflect on the path.',
    hidden: '\u2022\u2022\u2022\u2022',
  },
  ar: {
    totalBalance: '\u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u0643\u0644\u064A',
    income: '\u062F\u062E\u0644',
    expense: '\u0645\u0635\u0631\u0648\u0641',
    in: '\u062F\u062E\u0644',
    out: '\u062E\u0631\u062C',
    net: '\u0635\u0627\u0641\u064A',
    newEntry: '\u0625\u062F\u062E\u0627\u0644 \u062C\u062F\u064A\u062F',
    editEntry: '\u062A\u0639\u062F\u064A\u0644',
    category: '\u0627\u0644\u062A\u0635\u0646\u064A\u0641',
    noteOptional: '\u0645\u0644\u0627\u062D\u0638\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)',
    addNote: '\u0623\u0636\u0641 \u0645\u0644\u0627\u062D\u0638\u0629...',
    date: '\u0627\u0644\u062A\u0627\u0631\u064A\u062E',
    logEntry: '\u062A\u0633\u062C\u064A\u0644',
    updateTrajectory: '\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u0633\u0627\u0631',
    noSignals: '\u0644\u0627 \u0625\u0634\u0627\u0631\u0627\u062A \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631',
    tapToLog: '\u0627\u0636\u063A\u0637 + \u0644\u062A\u0633\u062C\u064A\u0644 \u0623\u0648\u0644 \u0625\u062F\u062E\u0627\u0644',
    settings: '\u063A\u0631\u0641\u0629 \u0627\u0644\u062A\u062D\u0643\u0645',
    language: '\u0627\u0644\u0644\u063A\u0629',
    currency: '\u0627\u0644\u0639\u0645\u0644\u0629',
    animations: '\u0627\u0644\u062D\u0631\u0643\u0629',
    silenceMode: '\u0648\u0636\u0639 \u0627\u0644\u0633\u0643\u0648\u0646',
    silenceDesc: '\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0623\u0631\u0642\u0627\u0645\u060C \u0625\u0628\u0642\u0627\u0621 \u0627\u0644\u062D\u0631\u0643\u0629',
    animDesc: '\u0627\u0644\u062A\u0623\u062B\u064A\u0631\u0627\u062A \u0627\u0644\u0628\u0635\u0631\u064A\u0629',
    timeWarp: '\u0627\u0646\u062D\u0646\u0627\u0621 \u0627\u0644\u0632\u0645\u0646',
    timeWarpHint: '\u0645\u0627\u0630\u0627 \u0644\u0648 \u0644\u0645 \u064A\u062D\u062F\u062B \u0647\u0630\u0627\u061F',
    constellation: '\u0643\u0648\u0643\u0628\u0629 \u0627\u0644\u0639\u0627\u0645',
    english: '\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629',
    arabic: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629',
    catSalary: '\u0631\u0627\u062A\u0628',
    catBusiness: '\u0639\u0645\u0644 \u062D\u0631',
    catInvestments: '\u0627\u0633\u062A\u062B\u0645\u0627\u0631\u0627\u062A',
    catGifts: '\u0647\u062F\u0627\u064A\u0627',
    catOtherIncome: '\u062F\u062E\u0644 \u0622\u062E\u0631',
    catFood: '\u0637\u0639\u0627\u0645',
    catDrinks: '\u0645\u0634\u0631\u0648\u0628\u0627\u062A',
    catTransport: '\u0645\u0648\u0627\u0635\u0644\u0627\u062A',
    catRent: '\u0633\u0643\u0646',
    catUtilities: '\u062E\u062F\u0645\u0627\u062A',
    catSubscriptions: '\u0627\u0634\u062A\u0631\u0627\u0643\u0627\u062A',
    catShopping: '\u062A\u0633\u0648\u0642',
    catEntertainment: '\u062A\u0631\u0641\u064A\u0647',
    catHealth: '\u0635\u062D\u0629',
    catTravel: '\u0633\u0641\u0631',
    catEducation: '\u062A\u0639\u0644\u064A\u0645',
    catOtherExpenses: '\u0645\u0635\u0627\u0631\u064A\u0641 \u0623\u062E\u0631\u0649',
    identityExplorer: '\u0627\u0644\u0645\u0633\u062A\u0643\u0634\u0641',
    identityExplorerMsg: '\u0645\u062F\u0627\u0631\u0643 \u0628\u0627\u0646\u062A\u0638\u0627\u0631\u0643. \u0623\u0636\u0641 \u0623\u0648\u0644 \u0625\u062F\u062E\u0627\u0644.',
    identityBuilder: '\u0627\u0644\u0628\u0627\u0646\u064A',
    identityBuilderMsg: '\u0645\u062F\u0627\u0631\u0643 \u064A\u062A\u0639\u0632\u0632. \u0627\u0644\u0645\u0648\u0627\u0631\u062F \u062A\u062A\u062C\u0645\u0639.',
    identityStabilizer: '\u0627\u0644\u0645\u0633\u062A\u0642\u0631',
    identityStabilizerMsg: '\u0628\u0642\u064A\u062A \u062B\u0627\u0628\u062A\u064B\u0627. \u0627\u0644\u0637\u0631\u064A\u0642 \u0648\u0627\u0636\u062D.',
    identityObserver: '\u0627\u0644\u0645\u0631\u0627\u0642\u0628',
    identityObserverMsg: '\u0645\u062F\u0627\u0631\u0643 \u064A\u062A\u063A\u064A\u0631. \u0643\u0646 \u0648\u0627\u0639\u064A\u064B\u0627.',
    identityVoyager: '\u0627\u0644\u0631\u062D\u0627\u0644\u0629',
    identityVoyagerMsg: '\u0625\u0634\u0627\u0631\u0627\u062A \u0643\u062B\u064A\u0631\u0629. \u0631\u0643\u0651\u0632 \u0645\u0633\u0627\u0631\u0643.',
    identityDrifter: '\u0627\u0644\u0645\u0646\u062C\u0631\u0641',
    identityDrifterMsg: '\u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631 \u0627\u0646\u062C\u0631\u0641 \u0642\u0644\u064A\u0644\u0627\u064B. \u0623\u0639\u062F \u0627\u0644\u0645\u0639\u0627\u064A\u0631\u0629.',
    reflectionSilence: '\u0633\u0643\u0648\u0646 \u0641\u064A \u0627\u0644\u0641\u0631\u0627\u063A. \u0644\u0627 \u0625\u0634\u0627\u0631\u0627\u062A.',
    reflectionOutward: '\u0627\u0644\u0645\u0648\u0627\u0631\u062F \u062A\u062F\u0641\u0642\u062A \u0644\u0644\u062E\u0627\u0631\u062C.',
    reflectionSteady: '\u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631 \u0643\u0627\u0646 \u0645\u062A\u0632\u0646\u064B\u0627. \u0628\u0642\u064A\u062A \u0641\u064A \u0645\u062F\u0627\u0631\u0643.',
    reflectionDrift: '\u0627\u0646\u062C\u0631\u0627\u0641 \u0644\u0637\u064A\u0641. \u0627\u0644\u062A\u0648\u0627\u0632\u0646 \u062A\u063A\u064A\u0651\u0631 \u0644\u0643\u0646\u0647 \u0635\u0645\u062F.',
    reflectionPull: '\u0627\u0644\u062C\u0627\u0630\u0628\u064A\u0629 \u0643\u0627\u0646\u062A \u0642\u0648\u064A\u0629. \u0627\u0644\u0645\u062F\u0627\u0631 \u0627\u0646\u062D\u0646\u0649.',
    reflectionMovement: '\u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631 \u062D\u0645\u0644 \u062D\u0631\u0643\u0629. \u062A\u0623\u0645\u0644 \u0627\u0644\u0645\u0633\u0627\u0631.',
    hidden: '\u2022\u2022\u2022\u2022',
  },
};

export type TranslationKey = keyof typeof translations.en;

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}

export function getCategoryKey(category: string): TranslationKey {
  const map: Record<string, TranslationKey> = {
    'Salary': 'catSalary',
    'Business / Freelance': 'catBusiness',
    'Investments': 'catInvestments',
    'Gifts': 'catGifts',
    'Other Income': 'catOtherIncome',
    'Food & Dining': 'catFood',
    'Drinks & Coffee': 'catDrinks',
    'Transportation': 'catTransport',
    'Rent / Housing': 'catRent',
    'Utilities': 'catUtilities',
    'Subscriptions': 'catSubscriptions',
    'Shopping': 'catShopping',
    'Entertainment': 'catEntertainment',
    'Health': 'catHealth',
    'Travel': 'catTravel',
    'Education': 'catEducation',
    'Other Expenses': 'catOtherExpenses',
  };
  return map[category] || 'catOtherExpenses';
}

export function formatMoney(amount: number, currency: CurrencyCode, short = false): string {
  const cur = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  try {
    return new Intl.NumberFormat(cur.locale, {
      style: 'currency',
      currency: cur.code,
      minimumFractionDigits: short ? 0 : 2,
      maximumFractionDigits: short ? 0 : 2,
    }).format(amount);
  } catch {
    return `${cur.symbol}${amount.toFixed(short ? 0 : 2)}`;
  }
}

export function getCurrencySymbol(currency: CurrencyCode): string {
  const cur = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  return cur.symbol;
}

export function getMonthLabelLocalized(key: string, lang: Language): string {
  const [year, month] = key.split('-').map(Number);
  const date = new Date(year, month - 1);
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
  return date.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
}

export function getMonthLabelShortLocalized(key: string, lang: Language): string {
  const [, month] = key.split('-').map(Number);
  const date = new Date(2024, month - 1);
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
  return date.toLocaleDateString(locale, { month: 'short' });
}

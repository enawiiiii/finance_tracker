import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, CurrencyCode } from './i18n';

interface SettingsContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (v: boolean) => void;
  silenceMode: boolean;
  setSilenceMode: (v: boolean) => void;
  isRTL: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const SETTINGS_KEY = 'orbit_settings';

interface SettingsData {
  language: Language;
  currency: CurrencyCode;
  animationsEnabled: boolean;
  silenceMode: boolean;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [animationsEnabled, setAnimationsEnabledState] = useState(true);
  const [silenceMode, setSilenceModeState] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then(data => {
      if (data) {
        try {
          const parsed: SettingsData = JSON.parse(data);
          if (parsed.language) setLanguageState(parsed.language);
          if (parsed.currency) setCurrencyState(parsed.currency);
          if (typeof parsed.animationsEnabled === 'boolean') setAnimationsEnabledState(parsed.animationsEnabled);
          if (typeof parsed.silenceMode === 'boolean') setSilenceModeState(parsed.silenceMode);
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const persist = useCallback((updates: Partial<SettingsData>) => {
    AsyncStorage.getItem(SETTINGS_KEY).then(data => {
      const current = data ? JSON.parse(data) : {};
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...updates }));
    });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    persist({ language: lang });
  }, [persist]);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    persist({ currency: code });
  }, [persist]);

  const setAnimationsEnabled = useCallback((v: boolean) => {
    setAnimationsEnabledState(v);
    persist({ animationsEnabled: v });
  }, [persist]);

  const setSilenceMode = useCallback((v: boolean) => {
    setSilenceModeState(v);
    persist({ silenceMode: v });
  }, [persist]);

  const isRTL = language === 'ar';

  const value = useMemo(() => ({
    language,
    setLanguage,
    currency,
    setCurrency,
    animationsEnabled,
    setAnimationsEnabled,
    silenceMode,
    setSilenceMode,
    isRTL,
  }), [language, currency, animationsEnabled, silenceMode, isRTL, setLanguage, setCurrency, setAnimationsEnabled, setSilenceMode]);

  if (!loaded) return null;

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

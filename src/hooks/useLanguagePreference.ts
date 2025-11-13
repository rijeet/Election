'use client';

import { useEffect, useState } from 'react';
import type { LocaleKey } from '@/types/poll';

const STORAGE_KEY = 'poll-language';

export function useLanguagePreference(defaultLang: LocaleKey = 'bn') {
  const [language, setLanguage] = useState<LocaleKey>(defaultLang);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as LocaleKey | null;
    if (stored === 'bn' || stored === 'en') {
      setLanguage(stored);
    } else {
      setLanguage(defaultLang);
    }
    setReady(true);
  }, [defaultLang]);

  const updateLanguage = (value: LocaleKey) => {
    setLanguage(value);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
  };

  return { language, setLanguage: updateLanguage, ready };
}



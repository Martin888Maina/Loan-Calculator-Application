import { createContext, useContext, useState } from 'react';

// currencies the app supports — default is KES
export const CURRENCIES = [
  { code: 'KES', label: 'KES — Kenyan Shilling', locale: 'en-KE' },
  { code: 'USD', label: 'USD — US Dollar', locale: 'en-US' },
  { code: 'EUR', label: 'EUR — Euro', locale: 'de-DE' },
  { code: 'GBP', label: 'GBP — British Pound', locale: 'en-GB' },
  { code: 'JPY', label: 'JPY — Japanese Yen', locale: 'ja-JP' },
  { code: 'INR', label: 'INR — Indian Rupee', locale: 'en-IN' },
  { code: 'ZAR', label: 'ZAR — South African Rand', locale: 'en-ZA' },
  { code: 'NGN', label: 'NGN — Nigerian Naira', locale: 'en-NG' },
  { code: 'CAD', label: 'CAD — Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', label: 'AUD — Australian Dollar', locale: 'en-AU' },
];

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('currency');
    return CURRENCIES.find(c => c.code === saved) || CURRENCIES[0];
  });

  const changeCurrency = (code) => {
    const found = CURRENCIES.find(c => c.code === code);
    if (found) {
      setCurrency(found);
      localStorage.setItem('currency', code);
    }
  };

  // format a number as currency — uses the browser's Intl API
  const format = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '—';
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, format, currencies: CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
}

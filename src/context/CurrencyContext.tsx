import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'LKR' | 'AUD';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;
  convertPrice: (amountInUSD: number) => number;
  currencySymbol: string;
}

const RATES: Record<CurrencyCode, { rate: number; symbol: string; decimals: number }> = {
  USD: { rate: 1.0, symbol: '$', decimals: 0 },
  EUR: { rate: 0.92, symbol: '€', decimals: 0 },
  GBP: { rate: 0.79, symbol: '£', decimals: 0 },
  LKR: { rate: 305.5, symbol: 'Rs. ', decimals: 0 },
  AUD: { rate: 1.52, symbol: 'A$', decimals: 0 }
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('premier_currency');
      return (saved as CurrencyCode) || 'USD';
    } catch {
      return 'USD';
    }
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('premier_currency', code);
  };

  const convertPrice = (amountInUSD: number): number => {
    const config = RATES[currency] || RATES.USD;
    return Math.round(amountInUSD * config.rate);
  };

  const formatPrice = (amountInUSD: number): string => {
    const config = RATES[currency] || RATES.USD;
    const converted = convertPrice(amountInUSD);
    return `${config.symbol}${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      formatPrice,
      convertPrice,
      currencySymbol: RATES[currency]?.symbol || '$'
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      currency: 'USD' as CurrencyCode,
      setCurrency: () => {},
      formatPrice: (amt: number) => `$${amt.toLocaleString()}`,
      convertPrice: (amt: number) => amt,
      currencySymbol: '$'
    };
  }
  return context;
};

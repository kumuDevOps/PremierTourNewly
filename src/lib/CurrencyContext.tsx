import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'USD' | 'LKR' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'RUB' | 'AED';

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  symbolPosition: 'before' | 'after';
  flag: string;
  rate: number; // relative to 1 USD
  decimals: number;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', symbolPosition: 'before', flag: '🇺🇸', rate: 1.0, decimals: 0 },
  LKR: { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs. ', symbolPosition: 'before', flag: '🇱🇰', rate: 302.5, decimals: 0 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', symbolPosition: 'before', flag: '🇪🇺', rate: 0.92, decimals: 0 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', symbolPosition: 'before', flag: '🇬🇧', rate: 0.78, decimals: 0 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', symbolPosition: 'before', flag: '🇯🇵', rate: 155.0, decimals: 0 },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', symbolPosition: 'before', flag: '🇨🇳', rate: 7.25, decimals: 0 },
  RUB: { code: 'RUB', name: 'Russian Ruble', symbol: '₽', symbolPosition: 'after', flag: '🇷🇺', rate: 88.5, decimals: 0 },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED ', symbolPosition: 'before', flag: '🇦🇪', rate: 3.67, decimals: 0 },
};

interface CurrencyContextType {
  currency: CurrencyInfo;
  currencyCode: CurrencyCode;
  setCurrencyCode: (code: CurrencyCode) => void;
  convertPrice: (usdPrice: number) => number;
  formatPrice: (usdPrice: number) => string;
  ratesUpdated: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencies, setCurrencies] = useState<Record<CurrencyCode, CurrencyInfo>>(SUPPORTED_CURRENCIES);
  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('premier_tours_currency') as CurrencyCode;
    return saved && SUPPORTED_CURRENCIES[saved] ? saved : 'USD';
  });
  const [ratesUpdated, setRatesUpdated] = useState<boolean>(false);

  // Fetch live exchange rates on mount
  useEffect(() => {
    const fetchLiveRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        if (res.ok) {
          const data = await res.json();
          if (data && data.rates) {
            setCurrencies(prev => {
              const updated = { ...prev };
              (Object.keys(updated) as CurrencyCode[]).forEach(code => {
                if (data.rates[code]) {
                  updated[code] = {
                    ...updated[code],
                    rate: data.rates[code]
                  };
                }
              });
              return updated;
            });
            setRatesUpdated(true);
          }
        }
      } catch (e) {
        console.warn('Using default currency exchange rates:', e);
      }
    };
    fetchLiveRates();
  }, []);

  const setCurrencyCode = (code: CurrencyCode) => {
    if (currencies[code]) {
      setCurrencyCodeState(code);
      localStorage.setItem('premier_tours_currency', code);
    }
  };

  const currency = currencies[currencyCode] || currencies.USD;

  const convertPrice = (usdPrice: number): number => {
    if (isNaN(usdPrice) || usdPrice === null) return 0;
    return usdPrice * currency.rate;
  };

  const formatPrice = (usdPrice: number): string => {
    if (isNaN(usdPrice) || usdPrice === null) return '$0';
    const converted = convertPrice(usdPrice);
    const formattedNum = Math.round(converted).toLocaleString('en-US');
    if (currency.symbolPosition === 'after') {
      return `${formattedNum} ${currency.symbol}`;
    }
    return `${currency.symbol}${formattedNum}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyCode,
        setCurrencyCode,
        convertPrice,
        formatPrice,
        ratesUpdated,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

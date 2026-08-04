import { useLanguage } from '../lib/i18n';
import React, { useState, useRef, useEffect } from 'react';
import { DollarSign, ChevronDown, Check, Coins } from 'lucide-react';
import { useCurrency, CurrencyCode, SUPPORTED_CURRENCIES } from '../lib/CurrencyContext.tsx';

interface CurrencySelectorProps {
  variant?: 'dropdown' | 'mobile' | 'inline';
  className?: string;
  onSelect?: () => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  variant = 'dropdown',
  className = '',
  onSelect
}) => {
  const { translate } = useLanguage();
  const { currency, currencyCode, setCurrencyCode } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currencyList = Object.values(SUPPORTED_CURRENCIES);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectCurrency = (code: CurrencyCode) => {
    setCurrencyCode(code);
    setIsOpen(false);
    if (onSelect) {
      onSelect();
    }
  };

  if (variant === 'mobile') {
    return (
      <div className={`w-full space-y-2 ${className}`}>
        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5 text-[#0091EA]" />
          <span>Currency / Display Rate</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {currencyList.map((curr) => (
            <button
              key={curr.code}
              type="button"
              onClick={() => handleSelectCurrency(curr.code)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                currencyCode === curr.code
                  ? 'bg-[#0091EA]/10 border-[#0091EA] text-[#0091EA] dark:bg-[#0091EA]/20 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span className="text-base leading-none">{curr.flag}</span>
              <div className="text-start truncate">
                <span className="block font-black leading-tight">{curr.code}</span>
                <span className="text-3xs text-slate-400 dark:text-slate-500 block leading-tight">{curr.symbol}</span>
              </div>
              {currencyCode === curr.code && <Check className="w-3.5 h-3.5 ml-auto text-[#0091EA] shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {currencyList.map((curr) => (
          <button
            key={curr.code}
            type="button"
            onClick={() => handleSelectCurrency(curr.code)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              currencyCode === curr.code
                ? 'bg-[#0091EA] text-white border-[#0091EA] shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <span>{curr.flag}</span>
            <span>{curr.code} ({curr.symbol})</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all hover:shadow-xs cursor-pointer"
        title={translate(`Change Currency Display`)}
      >
        <span className="text-sm leading-none">{currency.flag}</span>
        <span className="font-extrabold text-[#0A2540] dark:text-white">{currency.code}</span>
        <span className="text-3xs font-extrabold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">
          {currency.symbol}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-fade-in">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
            <span className="text-3xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">{translate(`Select Currency`)}</span>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-0.5 px-1 scrollbar-thin">
            {currencyList.map((curr) => (
              <button
                key={curr.code}
                type="button"
                onClick={() => handleSelectCurrency(curr.code)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  currencyCode === curr.code
                    ? 'bg-[#0091EA]/10 text-[#0091EA] font-extrabold dark:bg-[#0091EA]/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{curr.flag}</span>
                  <div className="text-start">
                    <span className="block font-black text-slate-900 dark:text-white leading-tight">{curr.code} - {curr.name}</span>
                    <span className="text-3xs text-slate-400 dark:text-slate-500 block leading-tight">1 USD = {curr.rate} {curr.code}</span>
                  </div>
                </div>
                {currencyCode === curr.code && <Check className="w-4 h-4 text-[#0091EA] shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;

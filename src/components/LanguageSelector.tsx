import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, Language } from '../lib/i18n';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪' },
];

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'mobile' | 'inline';
  className?: string;
  onSelect?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  className = '',
  onSelect
}) => {
  const { language, setLanguage, translate } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

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

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
    if (onSelect) {
      onSelect();
    }
  };

  if (variant === 'mobile') {
    return (
      <div className={`w-full space-y-2 ${className}`}>
        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
          {translate('Select Language')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelectLanguage(lang.code)}
              className={`flex items-center text-left gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                language === lang.code
                  ? 'bg-[#0091EA]/10 border-[#0091EA] text-[#0091EA] dark:bg-[#0091EA]/20 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span className="truncate">{lang.nativeName}</span>
              {language === lang.code && <Check className="w-3.5 h-3.5 ml-auto text-[#0091EA] shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleSelectLanguage(lang.code)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              language === lang.code
                ? 'bg-[#0091EA] text-white border-[#0091EA] shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.nativeName}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative shrink-0 ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-[#0091EA] dark:hover:border-[#0091EA] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-[#0091EA] transition-all cursor-pointer shadow-sm text-xs font-bold"
        aria-expanded={isOpen}
        aria-label="Select Language"
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className="font-extrabold uppercase text-[11px] text-slate-700 dark:text-slate-200">
          {currentLang.code}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-[999] animate-in fade-in duration-150 text-left">
          <div className="px-3 py-1 mb-1 border-b border-slate-100 dark:border-slate-700/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {translate('Select Language')}
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-0.5 px-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                  language === lang.code
                    ? 'text-[#0091EA] bg-sky-50 dark:bg-sky-950/40 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span className="truncate">{lang.nativeName}</span>
                </div>
                {language === lang.code && <Check className="w-3.5 h-3.5 text-[#0091EA] shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

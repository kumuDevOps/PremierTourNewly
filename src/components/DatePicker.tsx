import { useLanguage } from '../lib/i18n';
import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DatePickerProps {
  value: string; // "YYYY-MM-DD"
  onChange: (date: string) => void;
  label?: string;
  minDate?: string; // "YYYY-MM-DD"
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  label,
  minDate,
  className = '',
}: DatePickerProps) {
  const { translate } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial state date or fallback
  const getParsedDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date();
  };

  const initialDate = getParsedDate(value);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0-11

  // Update calendar view when value changes externally
  useEffect(() => {
    if (value) {
      const parsed = getParsedDate(value);
      setViewYear(parsed.getFullYear());
      setViewMonth(parsed.getMonth());
    }
  }, [value]);

  // Click outside to close calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Calculate days in the current viewMonth
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // First day weekday (0 = Sunday, 6 = Saturday)
  const getFirstDayOfWeek = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDateSelect = (dayNum: number) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const selectedDateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(dayNum)}`;
    onChange(selectedDateStr);
    setIsOpen(false);
  };

  // Check if date is in the past compared to minDate
  const isDateDisabled = (dayNum: number) => {
    if (!minDate) return false;
    const pad = (num: number) => num.toString().padStart(2, '0');
    const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(dayNum)}`;
    return dateStr < minDate;
  };

  // Generate calendar grid array
  const totalDays = getDaysInMonth(viewYear, viewMonth);
  const firstDayIndex = getFirstDayOfWeek(viewYear, viewMonth);
  
  const cells: (number | null)[] = [];
  // Empty cells for alignment
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(null);
  }
  // Month days
  for (let i = 1; i <= totalDays; i++) {
    cells.push(i);
  }

  // Format value for readable display
  const getDisplayDate = () => {
    if (!value) return 'Select travel date';
    const parsed = getParsedDate(value);
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const selectedDay = value ? getParsedDate(value) : null;
  const isSelected = (dayNum: number) => {
    if (!selectedDay) return false;
    return (
      selectedDay.getDate() === dayNum &&
      selectedDay.getMonth() === viewMonth &&
      selectedDay.getFullYear() === viewYear
    );
  };

  const isToday = (dayNum: number) => {
    const today = new Date();
    return (
      today.getDate() === dayNum &&
      today.getMonth() === viewMonth &&
      today.getFullYear() === viewYear
    );
  };

  return (
    <div ref={containerRef} className={`relative flex flex-col ${className}`}>
      {label && (
        <span className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1 text-start">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-800 rounded-xl text-start text-sm font-semibold text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0091EA] transition-all"
      >
        <span className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <bdi><bdi>{getDisplayDate()}</bdi></bdi>
        </span>
      </button>

      {isOpen && (
        <div className="absolute start-0 mt-2 z-50 w-72 bg-white dark:bg-slate-950 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-4 animate-fade-in text-start" style={{ top: '100%' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
              {monthNames[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {daysOfWeek.map((day) => (
              <span key={day} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, index) => {
              if (cell === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const disabled = isDateDisabled(cell);
              const selected = isSelected(cell);
              const today = isToday(cell);

              return (
                <button
                  key={`day-${cell}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleDateSelect(cell)}
                  className={`aspect-square text-xs font-bold rounded-lg flex items-center justify-center transition-all ${
                    disabled
                      ? 'text-slate-200 dark:text-slate-800 cursor-not-allowed bg-transparent'
                      : selected
                      ? 'bg-[#0091EA] text-white shadow-xs hover:bg-[#007cc7]'
                      : today
                      ? 'border border-[#0091EA] text-[#0091EA] hover:bg-slate-100 dark:hover:bg-slate-900'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {cell}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const pad = (num: number) => num.toString().padStart(2, '0');
                const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
                onChange(todayStr);
                setIsOpen(false);
              }}
              className="text-[#0091EA] hover:underline"
            >
              {translate(`Today`)}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-wider"
            >
              {translate(`Close`)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

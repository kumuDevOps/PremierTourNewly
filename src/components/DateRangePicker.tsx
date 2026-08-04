import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../lib/i18n.tsx';

interface DateRangePickerProps {
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  onChange: (startDate: string, endDate: string) => void;
  startLabel?: string;
  endLabel?: string;
  minDate?: string;  // "YYYY-MM-DD"
  className?: string;
  compact?: boolean;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  startLabel = 'Check In',
  endLabel = 'Check Out',
  minDate,
  className = '',
  compact = false,
}: DateRangePickerProps) {
  const { translate, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectingStep, setSelectingStep] = useState<'start' | 'end'>('start');
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to parse "YYYY-MM-DD" into Date object safely
  const parseDate = (dateStr: string) => {
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

  // Helper to format Date to "YYYY-MM-DD"
  const formatDateStr = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  const initialStart = startDate ? parseDate(startDate) : new Date();
  const [viewYear, setViewYear] = useState(initialStart.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialStart.getMonth());

  // Keep month view updated if startDate changes externally
  useEffect(() => {
    if (startDate) {
      const parsed = parseDate(startDate);
      setViewYear(parsed.getFullYear());
      setViewMonth(parsed.getMonth());
    }
  }, [startDate]);

  // Handle outside clicks to close calendar popover
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

  // Days in month calculation
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // First day of month weekday index
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

  // Format readable label for display
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return translate('Select date');
    const d = parseDate(dateStr);
    return d.toLocaleDateString(language || 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate nights count between startDate & endDate
  const calculateDaysNights = () => {
    if (!startDate || !endDate) return null;
    const start = parseDate(startDate).getTime();
    const end = parseDate(endDate).getTime();
    const diffTime = end - start;
    if (diffTime <= 0) return null;
    const days = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysCount = calculateDaysNights();

  // Date selection logic
  const handleDateClick = (dayNum: number) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const clickedDateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(dayNum)}`;

    if (selectingStep === 'start' || (startDate && endDate)) {
      // Pick start date
      onChange(clickedDateStr, '');
      setSelectingStep('end');
    } else if (selectingStep === 'end' && startDate) {
      // Pick end date
      if (clickedDateStr < startDate) {
        // If user picks a date before start date, set it as new start date
        onChange(clickedDateStr, '');
        setSelectingStep('end');
      } else {
        onChange(startDate, clickedDateStr);
        setSelectingStep('start');
        setIsOpen(false);
      }
    }
  };

  // Preset date range helper
  const applyPreset = (days: number) => {
    const today = new Date();
    const end = new Date(today);
    end.setDate(today.getDate() + days);
    onChange(formatDateStr(today), formatDateStr(end));
    setIsOpen(false);
  };

  // Check if date is disabled (before minDate or past)
  const isDateDisabled = (dayNum: number) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(dayNum)}`;
    if (minDate && dateStr < minDate) return true;
    return false;
  };

  // Helpers for calendar rendering
  const totalDays = getDaysInMonth(viewYear, viewMonth);
  const firstDayIndex = getFirstDayOfWeek(viewYear, viewMonth);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    cells.push(i);
  }

  // Determine cell styles for range
  const getCellClasses = (dayNum: number) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const currentStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(dayNum)}`;

    const isStart = startDate === currentStr;
    const isEnd = endDate === currentStr;
    const inSelectedRange = startDate && endDate && currentStr > startDate && currentStr < endDate;
    
    // Hover preview range if user picked start date and is selecting end date
    const inHoverRange = startDate && !endDate && hoverDate && currentStr > startDate && currentStr <= hoverDate;

    if (isStart && isEnd) {
      return 'bg-[#0091EA] text-white rounded-lg shadow-sm font-black';
    }
    if (isStart) {
      return 'bg-[#0091EA] text-white ltr:rounded-l-lg rtl:rounded-r-lg font-black shadow-sm';
    }
    if (isEnd) {
      return 'bg-[#0091EA] text-white ltr:rounded-r-lg rtl:rounded-l-lg font-black shadow-sm';
    }
    if (inSelectedRange) {
      return 'bg-[#0091EA]/15 text-[#0091EA] dark:text-[#38bdf8] font-bold';
    }
    if (inHoverRange) {
      return 'bg-[#0091EA]/10 text-[#0091EA] dark:text-[#38bdf8] font-semibold';
    }

    const today = formatDateStr(new Date());
    if (currentStr === today) {
      return 'border border-[#0091EA] text-[#0091EA] font-extrabold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg';
    }

    return 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-lg';
  };

  return (
    <div ref={containerRef} className={`relative flex flex-col w-full ${className}`}>
      {/* Input Display Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full cursor-pointer select-none"
      >
        {!compact ? (
          <div className="flex items-center justify-between gap-3 w-full">
            {/* Start Date */}
            <div className="flex-1 flex flex-col">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                {translate(startLabel)}
              </span>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#0091EA] shrink-0" />
                <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                  {formatDisplayDate(startDate)}
                </span>
              </div>
            </div>

            {/* Separator / Days Badge */}
            <div className="flex flex-col items-center justify-center px-1">
              {daysCount ? (
                <span className="px-2 py-0.5 bg-[#0091EA]/10 dark:bg-[#0091EA]/20 text-[#0091EA] dark:text-[#38bdf8] text-[10px] font-extrabold rounded-full whitespace-nowrap" dir="auto">
                  {language === 'ar' ? `${daysCount} ${daysCount === 1 ? 'ليلة' : 'ليالٍ'}` : `${daysCount} ${translate(daysCount === 1 ? 'Night' : 'Nights')}`}
                </span>
              ) : (
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 ltr:rotate-0 rtl:rotate-180" />
              )}
            </div>

            {/* End Date */}
            <div className="flex-1 flex flex-col text-end border-s border-slate-200 dark:border-slate-700/80 ps-3">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                {translate(endLabel)}
              </span>
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                  {formatDisplayDate(endDate)}
                </span>
                <CalendarIcon className="w-4 h-4 text-[#0091EA] shrink-0" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full py-0.5">
            <div className="flex items-center gap-2 overflow-hidden">
              <CalendarIcon className="w-4 h-4 text-[#0091EA] shrink-0" />
              <span className="text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {formatDisplayDate(startDate)} – {formatDisplayDate(endDate)}
              </span>
            </div>
            {daysCount && (
              <span className="text-[10px] font-black bg-sky-100 dark:bg-sky-950/80 text-[#0091EA] dark:text-sky-300 px-2 py-0.5 rounded-full shrink-0 border border-sky-200 dark:border-sky-800/50" dir="auto">
                {language === 'ar' ? `${daysCount} ليالٍ` : `${daysCount}${translate('N')}`}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Popover Calendar */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 lg:hidden bg-black/20 dark:bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsOpen(false)} />
          <div 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:absolute lg:top-[105%] lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-0 z-50 w-[92vw] sm:w-[400px] lg:w-[350px] lg:min-w-[350px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-sky-500/20 border-2 border-sky-200 dark:border-sky-800 p-5 animate-fade-in text-start"
          >
          {/* Top Status & Presets */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {selectingStep === 'start' || !startDate ? translate('Select Start Date') : translate('Select End Date')}
              </p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {startDate ? formatDisplayDate(startDate) : translate('Check In')} {endDate ? `→ ${formatDisplayDate(endDate)}` : ''}
              </p>
            </div>
            {daysCount && (
              <span className="px-2.5 py-1 bg-[#0091EA]/10 text-[#0091EA] font-extrabold text-xs rounded-xl">
                {daysCount} {translate(daysCount === 1 ? 'Night' : 'Nights')}
              </span>
            )}
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-2 scrollbar-hide">
            {[
              { label: '3 Days', days: 3 },
              { label: '7 Days', days: 7 },
              { label: '10 Days', days: 10 },
              { label: '14 Days', days: 14 }
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset.days)}
                className="px-2.5 py-1 text-[11px] font-extrabold bg-slate-100 dark:bg-slate-800 hover:bg-[#0091EA]/15 hover:text-[#0091EA] text-slate-600 dark:text-slate-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {translate(preset.label)}
              </button>
            ))}
          </div>

          {/* Month Header Navigation */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 ltr:rotate-0 rtl:rotate-180" />
            </button>
            <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              {translate(monthNames[viewMonth])} {viewYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 ltr:rotate-0 rtl:rotate-180" />
            </button>
          </div>

          {/* Weekday Column Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysOfWeek.map((day) => (
              <span key={day} className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-1 gap-x-0">
            {cells.map((cell, index) => {
              if (cell === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const pad = (num: number) => num.toString().padStart(2, '0');
              const cellDateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(cell)}`;
              const disabled = isDateDisabled(cell);

              return (
                <button
                  key={`day-${cell}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleDateClick(cell)}
                  onMouseEnter={() => setHoverDate(cellDateStr)}
                  onMouseLeave={() => setHoverDate(null)}
                  className={`aspect-square text-xs transition-all flex items-center justify-center cursor-pointer ${
                    disabled
                      ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed bg-transparent'
                      : getCellClasses(cell)
                  }`}
                >
                  {cell}
                </button>
              );
            })}
          </div>

          {/* Bottom Action Footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                onChange('', '');
                setSelectingStep('start');
              }}
              className="text-slate-400 dark:text-slate-500 hover:text-rose-500 transition-colors uppercase tracking-wider text-[10px]"
            >
              {translate('Clear dates')}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-1.5 bg-[#0091EA] hover:bg-[#007cc7] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              {translate('Done')}
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}

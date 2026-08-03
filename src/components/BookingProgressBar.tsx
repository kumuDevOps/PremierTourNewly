import React from 'react';
import { motion } from 'motion/react';
import { Check, Search, Users, CreditCard, ShieldCheck, Plane, Building, Compass, Car, Sparkles } from 'lucide-react';
import { useLanguage } from '../lib/i18n.tsx';

export interface BookingStep {
  number: number;
  label: string;
  description?: string;
}

interface BookingProgressBarProps {
  currentStep: number; // 1-indexed (1, 2, 3, 4)
  type?: 'flight' | 'hotel' | 'tour' | 'car' | string;
  steps?: BookingStep[];
  onStepClick?: (stepNumber: number) => void;
  className?: string;
  compact?: boolean;
}

export default function BookingProgressBar({
  currentStep,
  type = 'tour',
  steps,
  onStepClick,
  className = '',
  compact = false
}: BookingProgressBarProps) {
  const { translate } = useLanguage();

  const getDefaultSteps = (): BookingStep[] => {
    switch (type) {
      case 'flight':
        return [
          { number: 1, label: translate('Search Flights'), description: translate('Select route & seats') },
          { number: 2, label: translate('Passenger Details'), description: translate('Info & baggage') },
          { number: 3, label: translate('Review & Pay'), description: translate('Secure checkout') },
          { number: 4, label: translate('E-Ticket'), description: translate('Boarding pass issued') },
        ];
      case 'hotel':
        return [
          { number: 1, label: translate('Select Hotel'), description: translate('Compare stays & rooms') },
          { number: 2, label: translate('Guest Info'), description: translate('Dates & occupancy') },
          { number: 3, label: translate('Review & Pay'), description: translate('Instant confirmation') },
          { number: 4, label: translate('Booking Voucher'), description: translate('Stay reserved') },
        ];
      case 'car':
        return [
          { number: 1, label: translate('Select Vehicle'), description: translate('Choose rental car') },
          { number: 2, label: translate('Driver Details'), description: translate('Dates & location') },
          { number: 3, label: translate('Review & Pay'), description: translate('Insurance & deposit') },
          { number: 4, label: translate('Reservation Ready'), description: translate('Voucher issued') },
        ];
      case 'tour':
      default:
        return [
          { number: 1, label: translate('Explore Tours'), description: translate('Choose itinerary') },
          { number: 2, label: translate('Reservation'), description: translate('Travelers & dates') },
          { number: 3, label: translate('Review & Pay'), description: translate('Payment details') },
          { number: 4, label: translate('Confirmed'), description: translate('Pass & details ready') },
        ];
    }
  };

  const activeSteps = steps || getDefaultSteps();
  const progressPercent = Math.min(
    100,
    Math.max(0, ((currentStep - 1) / (activeSteps.length - 1)) * 100)
  );

  const getTypeIcon = () => {
    switch (type) {
      case 'flight':
        return <Plane className="w-4 h-4 text-[#0091EA]" />;
      case 'hotel':
        return <Building className="w-4 h-4 text-[#0091EA]" />;
      case 'car':
        return <Car className="w-4 h-4 text-[#0091EA]" />;
      case 'tour':
      default:
        return <Compass className="w-4 h-4 text-[#0091EA]" />;
    }
  };

  const getStepIcon = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return <Search className="w-3.5 h-3.5" />;
      case 2:
        return <Users className="w-3.5 h-3.5" />;
      case 3:
        return <CreditCard className="w-3.5 h-3.5" />;
      case 4:
      default:
        return <ShieldCheck className="w-3.5 h-3.5" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 border-2 border-sky-200/80 dark:border-sky-800/60 rounded-[32px] p-5 md:p-6 shadow-xl shadow-sky-500/10 animate-blue-glow relative overflow-hidden ${className}`}
    >
      {/* Background Light Blue Ambient Gradient Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Category header badge */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-sky-100/70 dark:border-sky-900/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200/80 dark:border-sky-800 shadow-xs animate-light-blue-pulse">
            {getTypeIcon()}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0091EA] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" />
              {translate(`${type.toUpperCase()} BOOKING PROCESS`)}
            </span>
            <p className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>{translate('Step')} {currentStep} {translate('of')} {activeSteps.length}:</span>
              <span className="text-[#0091EA] underline decoration-sky-300 decoration-2 underline-offset-2">
                {activeSteps[currentStep - 1]?.label}
              </span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50/80 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-800 text-[11px] font-extrabold text-sky-700 dark:text-sky-300 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#0091EA] animate-ping"></span>
          <span>{Math.round((currentStep / activeSteps.length) * 100)}% {translate('Completed')}</span>
        </div>
      </div>

      {/* Progress Bar & Indicators */}
      <div className="relative">
        {/* Background track line */}
        <div className="absolute top-4 left-6 right-6 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full -z-0"></div>

        {/* Animated active progress track line with light blue glow */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `calc(${progressPercent}% - 0.5rem)` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute top-4 left-6 h-1.5 bg-gradient-to-r from-[#0091EA] via-sky-400 to-cyan-400 rounded-full z-0 shadow-md shadow-sky-500/40"
        ></motion.div>

        {/* Step Nodes */}
        <div className="relative z-10 flex justify-between items-start">
          {activeSteps.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isClickable = onStepClick && step.number <= currentStep;

            return (
              <div
                key={step.number}
                onClick={() => isClickable && onStepClick(step.number)}
                className={`flex flex-col items-center text-center group ${
                  isClickable ? 'cursor-pointer' : ''
                }`}
                style={{ width: `${100 / activeSteps.length}%` }}
              >
                {/* Node Circle */}
                <motion.div
                  whileHover={isClickable ? { scale: 1.15 } : {}}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs transition-all duration-300 border-2 ${
                    isCompleted
                      ? 'bg-gradient-to-br from-[#0091EA] to-sky-600 border-[#0091EA] text-white shadow-md shadow-sky-500/30'
                      : isCurrent
                      ? 'bg-white dark:bg-slate-900 border-[#0091EA] text-[#0091EA] ring-4 ring-sky-400/30 shadow-lg shadow-sky-500/20 scale-110 animate-light-blue-pulse'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    getStepIcon(step.number)
                  )}
                </motion.div>

                {/* Step Labels */}
                {!compact && (
                  <div className="mt-2 space-y-0.5 max-w-[100px] sm:max-w-[130px]">
                    <span
                      className={`block text-[11px] font-black leading-tight tracking-tight ${
                        isCurrent
                          ? 'text-[#0091EA] dark:text-sky-400'
                          : isCompleted
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                    {step.description && (
                      <span className="hidden md:block text-[9px] font-medium text-slate-400 dark:text-slate-500 truncate">
                        {step.description}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

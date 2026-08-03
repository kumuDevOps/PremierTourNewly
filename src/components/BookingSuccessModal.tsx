import React, { useEffect } from 'react';
import { useLanguage } from '../lib/i18n.tsx';
import { useCurrency } from '../lib/CurrencyContext.tsx';
import { CheckCircle, Sparkles, X, ArrowRight, Download, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  orderNumber: string;
  totalAmount: number;
  bookingDetails: { label: string; value: React.ReactNode }[];
  onReturnToDashboard: () => void;
  onDownloadPdf?: () => void;
}

export default function BookingSuccessModal({
  isOpen,
  onClose,
  title,
  orderNumber,
  totalAmount,
  bookingDetails,
  onReturnToDashboard,
  onDownloadPdf
}: BookingSuccessModalProps) {
  const { translate } = useLanguage();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (isOpen) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999999 };

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 text-center space-y-8 flex flex-col items-center">
          {/* Animated Celebration Icon */}
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 text-emerald-500 shadow-sm">
            <CheckCircle className="w-12 h-12 animate-scale-up" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-full uppercase tracking-widest">
              {translate('Booking Successful')}
            </span>
            <h4 className="text-2xl font-black text-slate-900 leading-snug">
              {translate('You\'re all set!')}
            </h4>
            <p className="text-sm text-slate-500 font-medium max-w-[280px] mx-auto leading-relaxed">
              {translate('Your reservation has been confirmed and added to your dashboard.')}
            </p>
          </div>

          {/* Receipt Summary Card */}
          <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left text-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{translate('Order Summary')}</span>
              <span className="font-mono text-[11px] text-slate-600 font-bold">#{orderNumber}</span>
            </div>
            
            <div className="space-y-3 text-slate-700">
              <div className="flex justify-between items-start gap-4">
                <span className="font-medium text-slate-500">{translate('Arrangement')}:</span>
                <span className="font-bold text-slate-900 text-right">{title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">{translate('Total Amount')}:</span>
                <span className="font-black text-slate-900">{formatPrice(totalAmount)}</span>
              </div>
              
              {bookingDetails.map((detail, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4">
                  <span className="font-medium text-slate-500">{translate(detail.label)}:</span>
                  <span className="font-bold text-slate-800 text-right">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full pt-2 space-y-2.5">
            {onDownloadPdf && (
              <button
                type="button"
                onClick={onDownloadPdf}
                className="w-full flex items-center justify-center gap-2 bg-[#0091EA] hover:bg-[#0077C2] text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-sky-500/20 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{translate('Download PDF Voucher')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onReturnToDashboard}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all cursor-pointer ${
                onDownloadPdf 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'
                  : 'bg-[#0091EA] hover:bg-[#0077C2] text-white shadow-md shadow-sky-500/20'
              }`}
            >
              <span>{translate('Return to Dashboard')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

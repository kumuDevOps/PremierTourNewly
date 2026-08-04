import { useLanguage } from '../lib/i18n';
import React, { useState } from 'react';
import { Mail, MessageCircle, FileText, CheckCircle2, Send, X, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

interface NotificationSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingRef?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export default function NotificationSimulatorModal({
  isOpen,
  onClose,
  bookingRef = 'CAR-8921A',
  customerName = 'Alexander Wright',
  customerEmail = 'alexander.wright@gmail.com',
  customerPhone = '+1 555 019 2831'
}: NotificationSimulatorModalProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'whatsapp'>('email');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSimulateDispatch = () => {
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/20 rounded-2xl border border-sky-400/30 text-sky-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">{translate(`Automated Notification & Voucher Dispatch`)}</h3>
              <p className="text-xs text-slate-400 font-medium">Ref: #{bookingRef} • Sent to {customerEmail}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('email')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'email'
                  ? 'bg-[#0091EA] text-white shadow-md shadow-sky-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{translate(`HTML Confirmation Email`)}</span>
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp / SMS Alert</span>
            </button>
          </div>

          <button
            onClick={handleSimulateDispatch}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Send className="w-3.5 h-3.5 text-sky-400" />
            <span>{sent ? 'Dispatched!' : 'Simulate Re-send'}</span>
          </button>
        </div>

        {/* Notification Body */}
        <div className="p-6">
          {activeTab === 'email' ? (
            <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm text-start">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between text-xs text-slate-500 font-mono">
                <div>From: <span className="text-slate-900 dark:text-white font-bold">The Luxury Experience &lt;reservations@theluxuryesp.com&gt;</span></div>
                <div>To: <span className="text-slate-900 dark:text-white font-bold">{customerEmail}</span></div>
              </div>

              <div className="space-y-3">
                <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-black uppercase">
                  ✓ Booking Payment Confirmed
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  Dear {customerName}, Your Luxury Vehicle Reservation is Locked!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {translate(`Thank you for booking with The Luxury Experience. Your payment has been processed successfully. Attached to this email is your official PDF Luxury Travel Voucher for reservation`)} <span className="font-bold text-[#0091EA]">#{bookingRef}</span>.
                </p>

                {/* PDF Attachment Box */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-900 dark:text-white">
                        Official_Voucher_{bookingRef}.pdf
                      </span>
                      <span className="block text-[10px] text-slate-400">PDF Document • 142 KB</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-sky-50 text-[#0091EA] font-bold text-xs rounded-lg border border-sky-100">
                    {translate(`Attached`)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950/20 p-5 rounded-2xl border border-emerald-800/40 text-start space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Business Direct Dispatch ({customerPhone})</span>
              </div>
              <div className="p-4 bg-emerald-900/40 rounded-xl border border-emerald-700/50 text-xs text-slate-100 font-mono leading-relaxed">
                🚗 *THE LUXURY EXPERIENCE DISPATCH* <br/>
                Hello {customerName}, your chauffeur Chaminda Silva has been assigned to reservation *#{bookingRef}*! <br/>
                *Vehicle:* Mercedes Benz S-Class AMG (WP CAD-8899) <br/>
                *Chauffeur Phone:* +94 77 123 1234 <br/>
                Track your driver en-route in real-time here: https://theluxuryesp.com/track/{bookingRef}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

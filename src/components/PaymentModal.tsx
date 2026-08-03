import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { X, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../lib/i18n.tsx';

// Use a mock publishable key for development
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

interface CheckoutFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  amount: number;
}

function CheckoutForm({ onSuccess, onCancel, amount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { translate } = useLanguage();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    // Mock processing delay
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-slate-500" />
          {translate('Card Details')}
        </label>
        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-600 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#334155', // slate-700
                  '::placeholder': {
                    color: '#94a3b8', // slate-400
                  },
                },
                invalid: {
                  color: '#ef4444', // red-500
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 py-3 px-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {translate('Cancel')}
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-blue-500/20 cursor-pointer"
        >
          {processing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Lock className="w-4 h-4" />
              {translate('Pay')} ${amount.toLocaleString()}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  title?: string;
  description?: string;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  amount,
  title = 'Secure Payment',
  description = 'Complete your booking with secure checkout'
}: PaymentModalProps) {
  const { translate } = useLanguage();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onSuccess();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={!isSuccess ? onClose : undefined}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl z-[101] overflow-hidden border border-slate-100 dark:border-slate-800"
          >
            {isSuccess ? (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  {translate('Payment Successful!')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  {translate('Your transaction has been processed.')}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <Lock className="w-5 h-5 text-emerald-500" />
                      {translate(title)}
                    </h2>
                    {description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {translate(description)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-6 flex justify-between items-end">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{translate('Total Amount')}</span>
                    <span className="text-3xl font-black text-slate-800 dark:text-white">${amount.toLocaleString()}</span>
                  </div>

                  <Elements stripe={stripePromise}>
                    <CheckoutForm 
                      amount={amount} 
                      onSuccess={handleSuccess} 
                      onCancel={onClose} 
                    />
                  </Elements>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

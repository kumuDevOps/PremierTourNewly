import { useLanguage } from "../lib/i18n";
import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';

interface ForgotPasswordViewProps {
  onNavigate: (page: string) => void;
}

export default function ForgotPasswordView({ onNavigate }: ForgotPasswordViewProps) {
  const { translate } = useLanguage();
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(translate('Please enter your email address.'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      let data: any = {};
      const responseText = await res.text();
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (_) {
        data = { error: res.ok ? 'Unexpected response format from server.' : `Server error (${res.status}): ${responseText || 'Please make sure the backend server is running.'}` };
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process forgot password request.');
      }

      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
      setStep('reset');
    } catch (err: any) {
      console.error(err);
      setError(err.message || translate('An error occurred. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resetToken.trim()) {
      setError(translate('Reset token is required.'));
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError(translate('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(translate('Passwords do not match.'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: resetToken.trim(),
          password: newPassword,
          confirm_password: confirmPassword
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      setStep('success');
    } catch (err: any) {
      console.error(err);
      setError(err.message || translate('Failed to reset password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-[#0A2540] via-[#0091EA] to-sky-600 px-8 py-6 text-white text-center">
          <h2 className="text-xl font-black tracking-tight">{translate('Reset Account Password')}</h2>
          <p className="text-xs text-sky-200 font-medium mt-1">{translate(`Regain secure access to your member profile`)}</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-300 text-xs font-semibold text-center leading-relaxed">
              {error}
            </div>
          )}

          {step === 'success' && (
            /* Success State */
            <div className="space-y-6 text-center py-4 animate-fade-in">
              <div className="mx-auto w-14 h-14 bg-emerald-50 dark:bg-emerald-950 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-200">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{translate(`Password Updated Successfully!`)}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {translate(`Your password credentials have been updated securely. You can now sign in with your new password.`)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full flex items-center justify-center gap-2 bg-[#0091EA] hover:bg-[#007cc7] text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                {translate('Proceed to Sign In')}
              </button>
            </div>
          )}

          {step === 'request' && (
            /* Step 1: Request Reset Token */
            <div className="space-y-5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                {translate(`Enter your registered account email below. We'll generate a secure reset token for your profile.`)}
              </p>

              <form onSubmit={handleRequestToken} className="space-y-5 text-start">
                <div>
                  <label htmlFor="forgot-email" className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
                    {translate(`Email Address`)}
                  </label>
                  <div className="relative">
                    <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full ps-10 pe-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0091EA] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#0091EA] hover:bg-[#007cc7] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{translate(`Generating Reset Token...`)}</span>
                    </>
                  ) : (
                    <span>{translate(`Generate Reset Token`)}</span>
                  )}
                </button>
              </form>

              <div className="pt-4 text-center border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0091EA] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {translate('Back to Sign In')}
                </button>
              </div>
            </div>
          )}

          {step === 'reset' && (
            /* Step 2: Enter Token & New Password */
            <div className="space-y-5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                {translate(`Enter your reset token and your new password credentials below.`)}
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4 text-start">
                <div>
                  <label htmlFor="reset-token-input" className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
                    {translate(`Reset Token`)}
                  </label>
                  <input
                    id="reset-token-input"
                    type="text"
                    required
                    placeholder={translate(`Enter reset token`)}
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0091EA]"
                  />
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
                    {translate(`New Password`)}
                  </label>
                  <div className="relative">
                    <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder={translate(`Min. 8 chars (upper, lower, num, special)`)}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full ps-10 pe-11 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0091EA]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute end-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-new-password" className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
                    {translate(`Confirm New Password`)}
                  </label>
                  <div className="relative">
                    <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="confirm-new-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder={translate(`Repeat new password`)}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full ps-10 pe-11 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0091EA]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute end-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#0091EA] hover:bg-[#007cc7] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{translate(`Updating Password...`)}</span>
                    </>
                  ) : (
                    <span>{translate(`Confirm Password Reset`)}</span>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

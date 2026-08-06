import React, { useState } from 'react';
import { Mail, Lock, User, Phone as PhoneIcon, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, XCircle, AtSign } from 'lucide-react';
import { useLanguage } from '../lib/i18n.tsx';

interface SignupViewProps {
  onNavigate: (page: string) => void;
  onSignupSuccess: (user: any) => void;
}

export default function SignupView({ onNavigate, onSignupSuccess }: SignupViewProps) {
  const { translate } = useLanguage();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  // Password Complexity Validation Helpers
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasMatchingConfirm = confirmPassword.length > 0 && password === confirmPassword;

  const validate = (): boolean => {
    const tempErrors: typeof errors = {};
    let isValid = true;

    if (!firstName.trim()) {
      tempErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!lastName.trim()) {
      tempErrors.lastName = 'Last name is required';
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      tempErrors.email = 'Email address is required';
      isValid = false;
    } else if (!emailPattern.test(email.trim())) {
      tempErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    const phonePattern = /^[+0-9\s-]{7,20}$/;
    if (!phone.trim()) {
      tempErrors.phone = 'Mobile number is required';
      isValid = false;
    } else if (!phonePattern.test(phone.trim())) {
      tempErrors.phone = 'Please enter a valid mobile number';
      isValid = false;
    }

    if (!password) {
      tempErrors.password = 'Password is required';
      isValid = false;
    } else if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      tempErrors.password = 'Password must meet all complexity requirements below';
      isValid = false;
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          username: username.trim() || undefined,
          email: email.trim(),
          phone: phone.trim(),
          password,
          confirm_password: confirmPassword,
        }),
      });

      let data: any = {};
      const responseText = await response.text();
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (_) {
        data = { error: response.ok ? 'Unexpected response format from server.' : `Server error (${response.status}): ${responseText || 'Please make sure the backend server is running.'}` };
      }

      if (!response.ok) {
        throw new Error(data.error || 'Account registration failed.');
      }

      if (data.token) {
        localStorage.setItem('premier_token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('premier_refresh_token', data.refreshToken);
        }
        localStorage.setItem('premier_user_profile', JSON.stringify(data.user));
      }

      onSignupSuccess(data.user);
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ general: error.message || 'An error occurred during account registration.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#0A2540] via-[#0091EA] to-sky-600 px-8 py-6 text-white text-center shadow-md">
          <h2 className="text-2xl font-black tracking-tight">{translate('Member Registration')}</h2>
          <p className="text-xs text-sky-200 font-medium mt-1">{translate(`Create your secure Premier Tour Booking traveler account`)}</p>
        </div>

        <div className="p-8">
          {/* General Error Banner */}
          {errors.general && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-600 dark:text-rose-300 text-xs font-semibold text-center leading-relaxed">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-start">
            
            {/* First Name & Last Name Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-firstname" className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
                  {translate(`First Name`)} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="reg-firstname"
                    type="text"
                    required
                    placeholder={translate(`John`)}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full ps-10 pe-4 py-2.5 border ${errors.firstName ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 dark:border-slate-700 focus:ring-[#0091EA]'} rounded-xl text-sm font-medium dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.firstName && <p className="text-[11px] font-bold text-rose-500 mt-1 ps-1">{errors.firstName}</p>}
              </div>

              <div>
                <label htmlFor="reg-lastname" className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
                  {translate(`Last Name`)} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="reg-lastname"
                    type="text"
                    required
                    placeholder={translate(`Doe`)}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full ps-10 pe-4 py-2.5 border ${errors.lastName ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 dark:border-slate-700 focus:ring-[#0091EA]'} rounded-xl text-sm font-medium dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.lastName && <p className="text-[11px] font-bold text-rose-500 mt-1 ps-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Username (Optional) */}
            <div>
              <label htmlFor="reg-username" className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
                {translate(`Username`)} <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <AtSign className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="reg-username"
                  type="text"
                  placeholder="johndoe99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full ps-10 pe-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0091EA] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email & Mobile Number Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-email" className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
                  {translate(`Email Address`)} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ps-10 pe-4 py-2.5 border ${errors.email ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 dark:border-slate-700 focus:ring-[#0091EA]'} rounded-xl text-sm font-medium dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.email && <p className="text-[11px] font-bold text-rose-500 mt-1 ps-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="reg-phone" className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
                  {translate(`Mobile Number`)} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    placeholder="+94 77 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full ps-10 pe-4 py-2.5 border ${errors.phone ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 dark:border-slate-700 focus:ring-[#0091EA]'} rounded-xl text-sm font-medium dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] font-bold text-rose-500 mt-1 ps-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="reg-password" className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
                {translate(`Password`)} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={translate(`Create a strong password`)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full ps-10 pe-11 py-2.5 border ${errors.password ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 dark:border-slate-700 focus:ring-[#0091EA]'} rounded-xl text-sm font-medium dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] font-bold text-rose-500 mt-1 ps-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="reg-confirm" className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
                {translate(`Confirm Password`)} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="reg-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder={translate(`Repeat your password`)}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full ps-10 pe-11 py-2.5 border ${errors.confirmPassword ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 dark:border-slate-700 focus:ring-[#0091EA]'} rounded-xl text-sm font-medium dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute end-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[11px] font-bold text-rose-500 mt-1 ps-1">{errors.confirmPassword}</p>}
            </div>

            {/* Password Validation Checklist */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">{translate('Password Requirements:')}</p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <span className={`flex items-center gap-1.5 font-medium ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {translate('At least 8 characters')}
                </span>
                <span className={`flex items-center gap-1.5 font-medium ${hasUpper ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {hasUpper ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {translate('Uppercase letter (A-Z)')}
                </span>
                <span className={`flex items-center gap-1.5 font-medium ${hasLower ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {hasLower ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {translate('Lowercase letter (a-z)')}
                </span>
                <span className={`flex items-center gap-1.5 font-medium ${hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {hasNumber ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {translate('Number (0-9)')}
                </span>
                <span className={`flex items-center gap-1.5 font-medium ${hasSpecial ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {hasSpecial ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {translate('Special char (!@#$)')}
                </span>
                <span className={`flex items-center gap-1.5 font-medium ${hasMatchingConfirm ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {hasMatchingConfirm ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {translate('Passwords match')}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                id="signup-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 hover:from-[#007cc7] hover:to-sky-600 disabled:opacity-50 text-white font-black py-3.5 rounded-2xl transition-all shadow-lg shadow-sky-500/25 active:scale-[0.99] cursor-pointer text-sm tracking-wider uppercase"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{translate('Registering Account...')}</span>
                  </>
                ) : (
                  <>
                    <span>{translate('Register Account')}</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Link */}
          <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Already have a Premier Tour account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="font-bold text-[#0091EA] hover:underline cursor-pointer"
              >
                {translate(`Sign In Instead`)}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

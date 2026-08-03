import { useLanguage } from "../lib/i18n";
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (user: any, redirectUrl?: string) => void;
}

export default function LoginView({ onNavigate, onLoginSuccess }: LoginViewProps) {
  const { translate } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    // Parse query params for redirect & error
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    const err = params.get('error');
    if (redirect) setRedirectPath(redirect);
    if (err) setUrlError(err);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setUrlError(null);

    // Form validation
    if (!email.trim() || !password) {
      setGeneralError(translate('Email and password are required'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
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
        throw new Error(data.error || translate('Login failed. Please check your credentials.'));
      }

      // Save token and user details in local storage
      if (data.token) {
        localStorage.setItem('premier_token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('premier_refresh_token', data.refreshToken);
        }
        localStorage.setItem('premier_user_profile', JSON.stringify(data.user));
      }

      if (rememberMe) {
        localStorage.setItem('premier_remember_me', 'true');
      } else {
        localStorage.removeItem('premier_remember_me');
      }

      onLoginSuccess(data.user, redirectPath || undefined);
    } catch (error: any) {
      console.error('Sign-In Error:', error);
      setGeneralError(error.message || translate('Invalid email or password. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Banner header */}
        <div className="bg-[#0A2540] px-8 py-6 text-white text-center">
          <h2 className="text-xl font-extrabold tracking-tight">Premier Tour Booking</h2>
          <p className="text-xs text-sky-300 font-medium mt-1">Sign in to your member account</p>
        </div>

        <div className="p-8">
          {/* Display Redirect Error Message */}
          {urlError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold text-center leading-normal">
              {urlError}
            </div>
          )}

          {/* General Error Alert */}
          {generalError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-medium text-center leading-normal whitespace-pre-line">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="text-left">
              <label htmlFor="login-email" className="block text-xs font-bold text-[#0A2540] mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-250 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0091EA] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="text-left">
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-bold text-[#0A2540] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs font-bold text-[#0091EA] hover:text-[#007cc7] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Enter account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 border border-slate-250 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0091EA] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center text-left">
              <input
                id="login-remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#0091EA] focus:ring-[#0091EA] cursor-pointer"
              />
              <label htmlFor="login-remember-me" className="ml-2.5 text-xs font-semibold text-slate-600 select-none cursor-pointer">
                Remember my session on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#0091EA] hover:bg-[#007cc7] disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-[#0091EA]/10 active:scale-[0.99] cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Bottom redirection Link */}
          <div className="mt-8 text-center">
            <p className="text-xs font-medium text-slate-500">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="font-bold text-[#0091EA] hover:text-[#007cc7] hover:underline cursor-pointer"
              >
                Sign Up Now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

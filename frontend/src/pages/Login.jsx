import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Phone, AlertCircle, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const [loginType, setLoginType] = useState('email'); // 'email' | 'phone'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const validateIdentifier = () => {
    if (loginType === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim());
    } else {
      return /^[6-9]\d{9}$/.test(identifier.trim());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError(loginType === 'email' ? 'Email is required.' : 'Mobile number is required.');
      return;
    }
    if (!validateIdentifier()) {
      setError(loginType === 'email' ? 'Enter a valid email address.' : 'Enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!password) { setError('Password is required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setIsSubmitting(true);
    // For phone login, use identifier as email field (backend accepts email)
    const emailToSend = loginType === 'phone' ? `${identifier.trim()}@phone.dayflow` : identifier.trim();
    const result = await login(emailToSend, password);
    setIsSubmitting(false);

    if (result.success) navigate(from, { replace: true });
    else setError(result.error);
  };

  const inputStyle = {
    background: 'var(--bg-main)',
    color: 'var(--text-primary)',
    borderColor: 'var(--border-color)',
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-main)' }}>
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'var(--color-accent)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'var(--color-accent)' }} />

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl relative z-10"
        style={{ border: '1px solid var(--border-color)' }}>

        {/* Brand */}
        <div className="text-center mb-8">
          <span className="text-5xl mb-3 block">🌊</span>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Welcome back
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            Log in to track your DayFlow
          </p>
        </div>

        {/* Login type toggle */}
        <div className="flex rounded-xl overflow-hidden mb-6" style={{ border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => { setLoginType('email'); setIdentifier(''); setError(''); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition"
            style={{
              background: loginType === 'email' ? 'var(--color-accent)' : 'transparent',
              color: loginType === 'email' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            <Mail size={15} /> Email
          </button>
          <button
            type="button"
            onClick={() => { setLoginType('phone'); setIdentifier(''); setError(''); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition"
            style={{
              background: loginType === 'phone' ? 'var(--color-accent)' : 'transparent',
              color: loginType === 'phone' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            <Phone size={15} /> Mobile
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start gap-2 text-sm">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email or Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-secondary)' }}>
              {loginType === 'email' ? 'Email Address' : 'Mobile Number'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center" style={{ color: 'var(--text-secondary)' }}>
                {loginType === 'email' ? <Mail size={17} /> : <Phone size={17} />}
              </span>
              {loginType === 'phone' && (
                <span className="absolute inset-y-0 left-10 flex items-center text-sm font-semibold pr-2"
                  style={{ color: 'var(--text-secondary)', borderRight: '1px solid var(--border-color)' }}>
                  +91
                </span>
              )}
              <input
                type={loginType === 'email' ? 'email' : 'tel'}
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder={loginType === 'email' ? 'you@example.com' : '9876543210'}
                maxLength={loginType === 'phone' ? 10 : undefined}
                className="w-full py-3 pr-4 rounded-xl border text-sm focus:outline-none focus:ring-2 transition"
                style={{ ...inputStyle, paddingLeft: loginType === 'phone' ? '4.5rem' : '2.5rem' }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-secondary)' }}>Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center" style={{ color: 'var(--text-secondary)' }}>
                <Lock size={17} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition"
                style={inputStyle}
              />
              <button type="button" onClick={() => setShowPassword(p => !p)}
                className="absolute inset-y-0 right-3 flex items-center transition hover:opacity-70"
                style={{ color: 'var(--text-secondary)' }}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={isSubmitting}
            className="w-full py-3 text-white font-semibold rounded-xl transition flex justify-center items-center text-sm"
            style={{ background: isSubmitting ? 'var(--text-secondary)' : 'var(--color-accent)' }}>
            {isSubmitting ? <LoadingSpinner size="sm" color="white" /> : 'Log In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>OR</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
        </div>

        {/* Google Sign-in */}
        <button
          type="button"
          onClick={() => setError('Google sign-in requires backend OAuth setup. Use email/password for now.')}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border font-semibold text-sm transition hover:opacity-80"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <div className="text-center mt-6 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: 'var(--color-accent)' }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

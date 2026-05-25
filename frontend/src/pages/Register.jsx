import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
  const [name, setName] = useState('');
  const [registerType, setRegisterType] = useState('email'); // 'email' | 'phone'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength
  const getStrength = (p) => {
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  const strength = getStrength(password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#059669'][strength];

  const validateIdentifier = () => {
    if (registerType === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim());
    return /^[6-9]\d{9}$/.test(identifier.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Full name is required.'); return; }
    if (name.trim().length < 2) { setError('Name must be at least 2 characters.'); return; }
    if (!identifier.trim()) { setError(registerType === 'email' ? 'Email is required.' : 'Mobile number is required.'); return; }
    if (!validateIdentifier()) {
      setError(registerType === 'email' ? 'Enter a valid email address.' : 'Enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!password) { setError('Password is required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setIsSubmitting(true);
    const emailToSend = registerType === 'phone' ? `${identifier.trim()}@phone.dayflow` : identifier.trim();
    const result = await register(name.trim(), emailToSend, password);
    setIsSubmitting(false);

    if (result.success) navigate('/');
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
      {/* Blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'var(--color-accent)' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'var(--color-accent)' }} />

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl relative z-10"
        style={{ border: '1px solid var(--border-color)' }}>

        {/* Brand */}
        <div className="text-center mb-7">
          <span className="text-5xl mb-3 block">🌊</span>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Create Account
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            Start scheduling with DayFlow today
          </p>
        </div>

        {/* Register type toggle */}
        <div className="flex rounded-xl overflow-hidden mb-6" style={{ border: '1px solid var(--border-color)' }}>
          <button type="button"
            onClick={() => { setRegisterType('email'); setIdentifier(''); setError(''); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition"
            style={{ background: registerType === 'email' ? 'var(--color-accent)' : 'transparent', color: registerType === 'email' ? '#fff' : 'var(--text-secondary)' }}>
            <Mail size={15} /> Email
          </button>
          <button type="button"
            onClick={() => { setRegisterType('phone'); setIdentifier(''); setError(''); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition"
            style={{ background: registerType === 'phone' ? 'var(--color-accent)' : 'transparent', color: registerType === 'phone' ? '#fff' : 'var(--text-secondary)' }}>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-secondary)' }}>Full Name *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center" style={{ color: 'var(--text-secondary)' }}>
                <User size={17} />
              </span>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition"
                style={inputStyle} />
            </div>
          </div>

          {/* Email or Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-secondary)' }}>
              {registerType === 'email' ? 'Email Address *' : 'Mobile Number *'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center" style={{ color: 'var(--text-secondary)' }}>
                {registerType === 'email' ? <Mail size={17} /> : <Phone size={17} />}
              </span>
              {registerType === 'phone' && (
                <span className="absolute inset-y-0 left-10 flex items-center text-sm font-semibold pr-2"
                  style={{ color: 'var(--text-secondary)', borderRight: '1px solid var(--border-color)' }}>
                  +91
                </span>
              )}
              <input
                type={registerType === 'email' ? 'email' : 'tel'}
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder={registerType === 'email' ? 'you@example.com' : '9876543210'}
                maxLength={registerType === 'phone' ? 10 : undefined}
                className="w-full py-3 pr-4 rounded-xl border text-sm focus:outline-none focus:ring-2 transition"
                style={{ ...inputStyle, paddingLeft: registerType === 'phone' ? '4.5rem' : '2.5rem' }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-secondary)' }}>Password * (min 6 chars)</label>
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
                style={inputStyle} />
              <button type="button" onClick={() => setShowPassword(p => !p)}
                className="absolute inset-y-0 right-3 flex items-center hover:opacity-70"
                style={{ color: 'var(--text-secondary)' }}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {/* Strength bar */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="flex-1 h-1.5 rounded-full transition-all"
                      style={{ background: i <= strength ? strengthColor : 'var(--border-color)' }} />
                  ))}
                </div>
                <p className="text-xs font-semibold" style={{ color: strengthColor }}>{strengthLabel}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-secondary)' }}>Confirm Password *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center" style={{ color: 'var(--text-secondary)' }}>
                <Lock size={17} />
              </span>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition"
                style={{
                  ...inputStyle,
                  borderColor: confirmPassword && password !== confirmPassword ? '#EF4444' : 'var(--border-color)',
                }} />
              <button type="button" onClick={() => setShowConfirm(p => !p)}
                className="absolute inset-y-0 right-3 flex items-center hover:opacity-70"
                style={{ color: 'var(--text-secondary)' }}>
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
              {confirmPassword && password === confirmPassword && (
                <span className="absolute inset-y-0 right-9 flex items-center text-green-500">
                  <CheckCircle2 size={16} />
                </span>
              )}
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" disabled={isSubmitting}
            className="w-full py-3 text-white font-semibold rounded-xl transition flex justify-center items-center text-sm mt-2"
            style={{ background: isSubmitting ? 'var(--text-secondary)' : 'var(--color-accent)' }}>
            {isSubmitting ? <LoadingSpinner size="sm" color="white" /> : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>OR</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
        </div>

        {/* Google */}
        <button type="button"
          onClick={() => setError('Google sign-in requires backend OAuth setup. Use email/password for now.')}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border font-semibold text-sm transition hover:opacity-80"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <div className="text-center mt-6 pt-5" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-accent)' }}>
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

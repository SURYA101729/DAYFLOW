import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Mail, User, HelpCircle, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const Support = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) { setError('All fields are required.'); return; }
    if (!/\S+@\S+\.\S+/.test(email.trim())) { setError('Please provide a valid email address.'); return; }
    try {
      setIsSubmitting(true);
      await api.post('/api/support', { name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() });
      setSuccess(true); setSubject(''); setMessage('');
    } catch (err) { console.error(err); setError('Failed to submit message. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const inputStyle = { background: 'var(--bg-main)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' };

  return (
    <div className="flex-1 p-6 lg:p-10 max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <span>🆘</span><span>Help & Support Center</span>
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Have questions or encountered an issue? Submit a ticket and our team will get back to you.
        </p>
      </div>

      {success ? (
        <div className="glass-panel p-8 rounded-2xl shadow-premium text-center space-y-4">
          <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto"
            style={{ background: '#10B98120', color: '#10B981' }}>
            <CheckCircle2 size={36} />
          </div>
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Support Ticket Created!</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            We received your message. A representative will contact you at <strong>{email}</strong>.
          </p>
          <button onClick={() => setSuccess(false)}
            className="mt-2 px-6 py-2.5 text-white font-semibold rounded-xl text-sm transition hover:opacity-90"
            style={{ background: 'var(--color-accent)' }}>
            Send Another Message
          </button>
        </div>
      ) : (
        <div className="glass-panel p-6 lg:p-8 rounded-2xl shadow-premium" style={{ border: '1px solid var(--border-color)' }}>
          <h3 className="font-bold text-base mb-6" style={{ color: 'var(--text-primary)' }}>Contact Us</h3>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start gap-2 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" /><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: 'Your Name *', value: name, set: setName, icon: User, type: 'text', placeholder: 'John Doe' },
              { label: 'Email Address *', value: email, set: setEmail, icon: Mail, type: 'email', placeholder: 'you@example.com' },
              { label: 'Subject *', value: subject, set: setSubject, icon: HelpCircle, type: 'text', placeholder: 'e.g. Question about AI Advice limit' },
            ].map(({ label, value, set, icon: Icon, type, placeholder }) => (
              <div key={label}>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center" style={{ color: 'var(--text-secondary)' }}><Icon size={17} /></span>
                  <input type={type} value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition"
                    style={inputStyle} required />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Message *</label>
              <div className="relative">
                <span className="absolute top-3 left-3" style={{ color: 'var(--text-secondary)' }}><FileText size={17} /></span>
                <textarea value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Describe your question or issue in detail..." rows={5}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition resize-none"
                  style={inputStyle} required />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full py-3 text-white font-semibold rounded-xl transition flex justify-center items-center text-sm"
              style={{ background: isSubmitting ? 'var(--text-secondary)' : 'var(--color-accent)' }}>
              {isSubmitting ? <LoadingSpinner size="sm" color="white" /> : 'Submit Support Message'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Support;

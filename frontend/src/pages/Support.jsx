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

  const validateEmail = (emailStr) => {
    return /\S+@\S+\.\S+/.test(emailStr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('All fields are required.');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/api/support', {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      setSuccess(true);
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setError('Failed to submit message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-10 max-w-2xl mx-auto space-y-8">
      {/* Intro */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
          <span>🆘</span>
          <span>Help & Support Center</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Have questions or encountered an issue? Submit a ticket, and our team will get back to you shortly.
        </p>
      </div>

      {success ? (
        <div className="glass-panel p-8 rounded-2xl shadow-premium text-center border-emerald-100 space-y-4 animate-pulse-slow-once">
          <div className="h-16 w-16 bg-emerald-50 text-success rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Support Ticket Created!</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            We have received your message. A representative will contact you at <strong>{email}</strong> if required.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 px-6 py-2.5 bg-primary-accent hover:bg-blue-600 text-white font-semibold rounded-xl text-sm transition duration-200 shadow-premium"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <div className="glass-panel p-6 lg:p-8 rounded-2xl shadow-premium border border-slate-100">
          <h3 className="font-bold text-slate-800 text-base mb-6">Contact Us</h3>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-danger rounded-xl flex items-start space-x-2 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Your Name *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-accent focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-200 text-sm"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Email Address *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-accent focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-200 text-sm"
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Subject *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <HelpCircle size={18} />
                </span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question about AI Advice limit"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-accent focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-200 text-sm"
                  required
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Message Description *
              </label>
              <div className="relative">
                <span className="absolute top-3 left-3 text-slate-400">
                  <FileText size={18} />
                </span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  rows={5}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-accent focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-200 text-sm resize-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-primary-accent hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-premium transition duration-200 flex justify-center items-center text-sm"
            >
              {isSubmitting ? <LoadingSpinner size="sm" color="white" /> : 'Submit Support Message'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Support;

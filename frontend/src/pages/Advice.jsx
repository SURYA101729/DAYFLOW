import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles, History, AlertCircle, ChevronDown, ChevronUp, Send } from 'lucide-react';

const Advice = () => {
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try { setLoadingHistory(true); const r = await api.get('/api/advice/history'); setHistory(r.data); }
    catch (err) { console.error(err); } finally { setLoadingHistory(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setResponse(null);
    if (strengths.trim().length < 10 || weaknesses.trim().length < 10) {
      setError('Both fields must be at least 10 characters.'); return;
    }
    try {
      setLoading(true);
      const r = await api.post('/api/advice', { strengths: strengths.trim(), weaknesses: weaknesses.trim() });
      setResponse(r.data); setStrengths(''); setWeaknesses(''); fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Advice unavailable, please try again.');
    } finally { setLoading(false); }
  };

  const renderAdvice = (text) => {
    if (!text) return null;
    return (
      <div className="space-y-4">
        {text.split(/(?=##\s)/).map((section, idx) => {
          const lines = section.trim().split('\n');
          const isSection = lines[0].startsWith('##');
          const title = lines[0].replace(/##\s*/, '');
          const body = lines.slice(1).join('\n');
          if (!isSection) return <p key={idx} className="text-sm whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>{section}</p>;
          return (
            <div key={idx} className="p-4 rounded-xl" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
              <h4 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h4>
              <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>{body}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const inputStyle = { background: 'var(--bg-main)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' };

  return (
    <div className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Sparkles size={22} style={{ color: 'var(--color-accent)' }} />
          <span>AI Personal Development Coach</span>
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Share your traits to receive tailored AI insights and growth actions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-6 rounded-2xl shadow-premium" style={{ border: '1px solid var(--border-color)' }}>
            <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Trait Analysis</h3>
            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start gap-2 text-sm">
                <AlertCircle size={17} className="flex-shrink-0 mt-0.5" /><span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Your Strengths * (min 10 chars)', value: strengths, set: setStrengths, placeholder: 'e.g. Organized planner, empathetic listener...' },
                { label: 'Your Weaknesses * (min 10 chars)', value: weaknesses, set: setWeaknesses, placeholder: 'e.g. Easily distracted, procrastinator...' },
              ].map(({ label, value, set, placeholder }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                  <textarea value={value} onChange={e => set(e.target.value)} placeholder={placeholder} rows={3}
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition resize-none"
                    style={inputStyle} required />
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-xl transition flex justify-center items-center gap-2 text-sm"
                style={{ background: loading ? 'var(--text-secondary)' : 'var(--color-accent)' }}>
                {loading ? <LoadingSpinner size="sm" color="white" /> : <><Send size={15} /><span>Get AI Coaching Advice</span></>}
              </button>
            </form>
          </div>

          {response && (
            <div className="glass-panel p-6 rounded-2xl shadow-premium space-y-5" style={{ border: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-3 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Your Tailored Growth Advice</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Generated using Claude AI</p>
                </div>
              </div>
              {renderAdvice(response.aiResponse)}
            </div>
          )}
        </div>

        {/* History */}
        <div>
          <div className="glass-panel p-6 rounded-2xl shadow-premium space-y-4" style={{ border: '1px solid var(--border-color)' }}>
            <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <History size={17} style={{ color: 'var(--text-secondary)' }} /><span>Advice History</span>
            </h3>
            {loadingHistory ? <div className="py-10"><LoadingSpinner /></div>
            : history.length === 0 ? <p className="text-xs text-center py-6" style={{ color: 'var(--text-secondary)' }}>Your past sessions will appear here.</p>
            : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {history.map(item => {
                  const isExp = expandedId === item.id;
                  return (
                    <div key={item.id} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
                      <button onClick={() => setExpandedId(isExp ? null : item.id)}
                        className="w-full flex items-center justify-between p-3 text-left transition hover:opacity-80"
                        style={{ background: 'var(--bg-main)' }}>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                            {item.strengths?.substring(0, 40)}...
                          </p>
                          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {isExp ? <ChevronUp size={15} style={{ color: 'var(--text-secondary)' }} /> : <ChevronDown size={15} style={{ color: 'var(--text-secondary)' }} />}
                      </button>
                      {isExp && (
                        <div className="p-3 space-y-3" style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                          <div>
                            <p className="text-[10px] uppercase font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Weaknesses</p>
                            <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{item.weaknesses}</p>
                          </div>
                          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                            <p className="text-[10px] uppercase font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>AI Insights</p>
                            {renderAdvice(item.aiResponse)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advice;

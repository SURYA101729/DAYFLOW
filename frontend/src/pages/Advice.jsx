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
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await api.get('/api/advice/history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    if (strengths.trim().length < 10 || weaknesses.trim().length < 10) {
      setError('Both strengths and weaknesses must be at least 10 characters long.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/api/advice', {
        strengths: strengths.trim(),
        weaknesses: weaknesses.trim()
      });
      setResponse(res.data);
      // Reset form
      setStrengths('');
      setWeaknesses('');
      // Refresh history list
      fetchHistory();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Advice unavailable, please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleHistoryItem = (id) => {
    if (expandedHistoryId === id) {
      setExpandedHistoryId(null);
    } else {
      setExpandedHistoryId(id);
    }
  };

  // Convert raw Claude responses or structured content to clean html/sections
  const renderAdviceContent = (text) => {
    if (!text) return null;

    // Simple parser for markdown sections starting with '#'
    const sections = text.split(/(?=##\s)/);
    
    return (
      <div className="space-y-6">
        {sections.map((section, idx) => {
          const lines = section.trim().split('\n');
          const title = lines[0].replace(/##\s*/, '');
          const body = lines.slice(1).join('\n');

          // If first line doesn't start with ##, render as raw block
          if (!lines[0].startsWith('##')) {
            return (
              <p key={idx} className="text-slate-600 text-sm whitespace-pre-line">
                {section}
              </p>
            );
          }

          return (
            <div key={idx} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100/50">
              <h4 className="font-bold text-[#1E3A5F] text-base mb-3 flex items-center space-x-2">
                <span>{title}</span>
              </h4>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line space-y-1">
                {body}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      {/* Intro */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
          <Sparkles className="text-primary-accent animate-pulse-slow" size={22} />
          <span>AI personal development coach</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Provide your traits to receive tailored AI insights, daily routine updates, and growth actions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form & AI Output */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-6 rounded-2xl shadow-premium border border-slate-100">
            <h3 className="font-bold text-slate-800 text-base mb-4">Trait Analysis</h3>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-danger rounded-xl flex items-start space-x-2 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  What are your strengths? * (Min 10 characters)
                </label>
                <textarea
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="e.g. Organized planner, empathetic listener, quick learner, dedicated teammate..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-accent focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-200 text-sm resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  What are your weaknesses? * (Min 10 characters)
                </label>
                <textarea
                  value={weaknesses}
                  onChange={(e) => setWeaknesses(e.target.value)}
                  placeholder="e.g. Easily distracted, procrastinator under pressure, struggle to say no to requests..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-accent focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-200 text-sm resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#1E3A5F] hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-xl shadow-premium transition duration-200 flex justify-center items-center space-x-2 text-sm"
              >
                {loading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    <Send size={16} />
                    <span>Get AI Coaching Advice</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Current response rendering */}
          {response && (
            <div className="glass-panel p-6 rounded-2xl shadow-premium border border-slate-100 space-y-6">
              <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-bold text-slate-800">Your Tailored Growth Advice</h3>
                  <p className="text-xs text-slate-400">Generated using Claude AI</p>
                </div>
              </div>
              {renderAdviceContent(response.aiResponse)}
            </div>
          )}
        </div>

        {/* Collapsible History Panel */}
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl shadow-premium space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center space-x-2">
              <History size={18} className="text-slate-400" />
              <span>Advice History</span>
            </h3>
            
            {loadingHistory ? (
              <div className="py-10">
                <LoadingSpinner size="md" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                Your past sessions will display here.
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {history.map((item) => {
                  const isExpanded = expandedHistoryId === item.id;
                  const dateString = new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div key={item.id} className="border border-slate-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleHistoryItem(item.id)}
                        className="w-full flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 transition text-left"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate">
                            Strengths: {item.strengths}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{dateString}</p>
                        </div>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      
                      {isExpanded && (
                        <div className="p-3 bg-white border-t border-slate-100 space-y-4">
                          <div className="space-y-1">
                            <h5 className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Weaknesses</h5>
                            <p className="text-xs text-slate-600">{item.weaknesses}</p>
                          </div>
                          <div className="space-y-1 pt-2 border-t border-slate-100">
                            <h5 className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Claude Insights</h5>
                            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                              {renderAdviceContent(item.aiResponse)}
                            </div>
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

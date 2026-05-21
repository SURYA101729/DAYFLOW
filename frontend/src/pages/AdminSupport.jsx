import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Shield, CheckCircle2, Circle, Mail, Calendar, Filter } from 'lucide-react';

const AdminSupport = () => {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/support/admin?filter=${filter}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load support queries. Access might be unauthorized.');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      // Optimistic update
      setMessages(messages.map(m => m.id === id ? { ...m, isResolved: !m.isResolved } : m));
      await api.patch(`/api/support/${id}/resolve`);
    } catch (err) {
      console.error(err);
      fetchMessages();
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Shield className="text-danger" size={22} />
            <span>Admin Support Center</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Resolve incoming support requests and user concerns.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          <Filter size={14} className="text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="focus:outline-none text-xs font-semibold text-slate-600 bg-white"
          >
            <option value="all">All Messages</option>
            <option value="unresolved">Unresolved Only</option>
            <option value="resolved">Resolved Only</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-danger rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : messages.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center">
          <span className="text-3xl block">🎉</span>
          <h3 className="font-bold text-slate-800 text-base mt-2">All clear!</h3>
          <p className="text-slate-500 text-xs mt-1">No messages match the current criteria.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl shadow-premium border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Status</th>
                  <th className="p-4">Sender info</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Message Details</th>
                  <th className="p-4 pr-6">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/30 transition duration-150">
                    <td className="p-4 pl-6">
                      <button
                        onClick={() => handleResolve(msg.id)}
                        className={`flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 rounded-full border transition ${
                          msg.isResolved
                            ? 'bg-emerald-50 text-success border-emerald-100 hover:bg-emerald-100'
                            : 'bg-amber-50 text-warning border-amber-100 hover:bg-amber-100'
                        }`}
                        title={msg.isResolved ? 'Mark Unresolved' : 'Mark Resolved'}
                      >
                        {msg.isResolved ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                        <span>{msg.isResolved ? 'Resolved' : 'Pending'}</span>
                      </button>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{msg.name}</p>
                        <p className="text-slate-400 text-[10px] flex items-center space-x-1 mt-0.5">
                          <Mail size={10} />
                          <span>{msg.email}</span>
                        </p>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800 text-xs">{msg.subject}</td>
                    <td className="p-4 text-slate-600 text-xs whitespace-pre-wrap max-w-xs truncate-2-lines">
                      {msg.message}
                    </td>
                    <td className="p-4 pr-6 text-slate-400 text-[10px] whitespace-nowrap">
                      <span className="flex items-center space-x-1">
                        <Calendar size={10} />
                        <span>
                          {new Date(msg.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;

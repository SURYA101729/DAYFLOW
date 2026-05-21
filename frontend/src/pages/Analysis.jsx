import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import html2pdf from 'html2pdf.js';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import { BarChart3, Download, Calendar, CheckSquare, ListChecks, Award } from 'lucide-react';

const COLORS = ['#1E3A5F', '#2ECC71', '#3498DB', '#F39C12', '#9B59B6'];

const Analysis = () => {
  const [range, setRange] = useState('week');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAnalysis();
  }, [range]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/analysis?range=${range}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch productivity analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    setExporting(true);
    const element = document.getElementById('analysis-dashboard');
    const opt = {
      margin: 0.5,
      filename: `dayflow-analysis-${range}-${new Date().toISOString().substring(0, 10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save().finally(() => {
      setExporting(false);
    });
  };

  if (loading && !data) {
    return (
      <div className="h-full flex items-center justify-center p-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const completionRate = data?.totalTasks > 0
    ? Math.round((data.completedTasks / data.totalTasks) * 100)
    : 0;

  return (
    <div className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      {/* Top filter and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <BarChart3 className="text-primary-accent" size={22} />
            <span>Productivity Dashboard</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Track and visualize your schedule completion patterns and time allocations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-accent focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-200 text-sm bg-white font-semibold text-slate-700"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center space-x-2 bg-primary-accent hover:bg-blue-600 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition duration-200 shadow-premium"
          >
            <Download size={16} />
            <span>{exporting ? 'Generating PDF...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-danger rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Exportable Area */}
      <div id="analysis-dashboard" className="space-y-8 bg-[#F0F4F8] p-2 rounded-2xl">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl shadow-premium flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-primary-accent rounded-xl">
              <CheckSquare size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Tasks</p>
              <p className="text-2xl font-extrabold text-slate-800">{data?.totalTasks}</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl shadow-premium flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-success rounded-xl">
              <ListChecks size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-extrabold text-slate-800">{data?.completedTasks}</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl shadow-premium flex items-center space-x-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Award size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completion Rate</p>
              <p className="text-2xl font-extrabold text-slate-800">{completionRate}%</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl shadow-premium flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-warning rounded-xl">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Filter Range</p>
              <p className="text-sm font-extrabold text-slate-700 capitalize">{range === 'all' ? 'All time' : `This ${range}`}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Completion Bar Chart */}
          <div className="glass-panel p-6 rounded-2xl shadow-premium space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider text-slate-500">Weekly Task Completion Rate</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.weeklyCompletion}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#1E3A5F' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="total" name="Created Tasks" fill="#3498DB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" name="Completed Tasks" fill="#2ECC71" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time spent per category - Pie Chart */}
          <div className="glass-panel p-6 rounded-2xl shadow-premium space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider text-slate-500">Time Spent per Category (min)</h3>
            <div className="h-72 flex items-center justify-center">
              {data?.categoryBreakdown?.length === 0 ? (
                <p className="text-sm text-slate-400">No task duration records found.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="totalMinutes"
                      nameKey="category"
                    >
                      {data?.categoryBreakdown?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px' }}
                      formatter={(value) => [`${value} minutes`, 'Duration']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Productivity Trend Over Days - Line Chart */}
          <div className="glass-panel p-6 rounded-2xl shadow-premium lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider text-slate-500">Productivity Trend (7-Day Roll)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.productivityTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#1E3A5F' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line yAxisId="left" type="monotone" dataKey="tasksCompleted" name="Tasks Completed" stroke="#2ECC71" strokeWidth={3} activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="totalMinutes" name="Time Invested (min)" stroke="#3498DB" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;

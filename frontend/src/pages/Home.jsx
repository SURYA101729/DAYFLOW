import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TaskModal from '../components/TaskModal';
import ConfettiAnimation from '../components/ConfettiAnimation';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Edit2, Trash2, Calendar, Clock, Sparkles, Droplet, Compass, Heart } from 'lucide-react';

const quotes = [
  "Your future is created by what you do today, not tomorrow.",
  "Productivity is being able to do things that you were never able to do before.",
  "Focus on being productive instead of busy.",
  "The secret of getting ahead is getting started.",
  "Determine never to be idle. No one will have occasion to complain of the want of time who never loses any.",
];

const habitsList = [
  { id: 'hydrate',  text: 'Drink 500ml water 💧',          icon: Droplet, accent: '#3B82F6' },
  { id: 'stretch',  text: '5-minute full body stretch 🧘',  icon: Compass, accent: '#10B981' },
  { id: 'meditate', text: '10-minute deep breathing 🧘‍♂️', icon: Heart,   accent: '#8B5CF6' },
];

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('dayflow_habits_today');
    const today = new Date().toISOString().substring(0, 10);
    if (saved) { const p = JSON.parse(saved); if (p.date === today) return p.items; }
    return { hydrate: false, stretch: false, meditate: false };
  });

  useEffect(() => {
    const today = new Date().toISOString().substring(0, 10);
    localStorage.setItem('dayflow_habits_today', JSON.stringify({ date: today, items: habits }));
  }, [habits]);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try { setLoading(true); const r = await api.get('/api/tasks'); setTasks(r.data); }
    catch (err) { console.error(err); setError("Failed to fetch today's tasks. Please reload."); }
    finally { setLoading(false); }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskData.id) { const r = await api.put(`/api/tasks/${taskData.id}`, taskData); setTasks(tasks.map(t => t.id === taskData.id ? r.data : t)); }
      else { const r = await api.post('/api/tasks', taskData); setTasks([...tasks, r.data]); }
      setIsModalOpen(false); setEditingTask(null);
    } catch (err) { console.error(err); alert('Failed to save task.'); }
  };

  const handleToggleComplete = async (taskId) => {
    try { setTasks(tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)); await api.patch(`/api/tasks/${taskId}/complete`); }
    catch (err) { console.error(err); fetchTasks(); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try { await api.delete(`/api/tasks/${taskId}`); setTasks(tasks.filter(t => t.id !== taskId)); }
    catch (err) { console.error(err); alert('Failed to delete task.'); }
  };

  const activeTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const showConfetti = progressPercent === 100 && tasks.length > 0;

  const card = { background: 'var(--bg-card)', border: '1px solid var(--border-color)' };

  return (
    <div className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <ConfettiAnimation active={showConfetti} />

      {/* Quote */}
      <div className="glass-panel p-6 rounded-2xl shadow-premium border-l-4 flex items-start gap-4"
        style={{ borderLeftColor: 'var(--color-accent)' }}>
        <span className="text-3xl">✨</span>
        <div>
          <p className="italic font-medium text-sm" style={{ color: 'var(--text-primary)' }}>"{quote}"</p>
          <p className="text-xs mt-1 uppercase tracking-wider font-semibold" style={{ color: 'var(--text-secondary)' }}>Today's Motivation</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl shadow-premium md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Today's Completion Rate</h3>
            <span className="text-xl font-extrabold" style={{ color: 'var(--color-accent)' }}>{progressPercent}%</span>
          </div>
          <div className="w-full rounded-full h-3 overflow-hidden" style={{ background: 'var(--border-color)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%`, background: 'var(--color-accent)' }} />
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
            {completedTasks.length} of {tasks.length} tasks completed. {showConfetti ? '🎉 All done!' : 'Keep going!'}
          </p>
        </div>
        <div className="glass-panel p-6 rounded-2xl shadow-premium flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Current Date</p>
            <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: `${getComputedStyle(document.documentElement).getPropertyValue('--color-accent')}20` }}>
            <Calendar size={24} style={{ color: 'var(--color-accent)' }} />
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>📅</span><span>Today's Schedule</span>
            </h2>
            <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-md hover:opacity-90"
              style={{ background: 'var(--color-accent)' }}>
              <Plus size={16} /><span>Add Task</span>
            </button>
          </div>

          {loading ? <div className="py-20"><LoadingSpinner size="lg" /></div>
          : error ? <div className="glass-panel p-8 rounded-2xl text-center text-red-500">{error}</div>
          : tasks.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
              <span className="text-4xl block">🌊</span>
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>No tasks for today</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Create a task to build your routine.</p>
              <button onClick={() => setIsModalOpen(true)} className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-accent)' }}>
                Create your first task
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTasks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Active ({activeTasks.length})
                  </h4>
                  {activeTasks.map(task => (
                    <div key={task.id} className="glass-panel p-5 rounded-2xl shadow-premium flex items-center justify-between transition hover:shadow-lg">
                      <div className="flex items-center gap-4">
                        <input type="checkbox" checked={false} onChange={() => handleToggleComplete(task.id)}
                          className="w-5 h-5 rounded cursor-pointer" style={{ accentColor: 'var(--color-accent)' }} />
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            <span className="flex items-center gap-1"><Clock size={11} />{task.startTime?.substring(0, 5)}</span>
                            <span>•</span><span>{task.duration} min</span><span>•</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                              style={{ background: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                              {task.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                          className="p-2 rounded-lg transition hover:opacity-70" style={{ color: 'var(--color-accent)' }}>
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)}
                          className="p-2 rounded-lg transition hover:opacity-70" style={{ color: '#EF4444' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {completedTasks.length > 0 && (
                <div className="space-y-3 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Completed ({completedTasks.length})
                  </h4>
                  {completedTasks.map(task => (
                    <div key={task.id} className="glass-panel p-5 rounded-2xl flex items-center justify-between opacity-60">
                      <div className="flex items-center gap-4">
                        <input type="checkbox" checked onChange={() => handleToggleComplete(task.id)}
                          className="w-5 h-5 rounded cursor-pointer" style={{ accentColor: '#10B981' }} />
                        <div>
                          <p className="font-medium text-sm line-through" style={{ color: 'var(--text-secondary)' }}>{task.title}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            <Clock size={11} /><span>{task.startTime?.substring(0, 5)}</span>
                            <span>•</span><span>{task.duration} min</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-2 rounded-lg hover:opacity-70" style={{ color: '#EF4444' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Habits */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl shadow-premium space-y-4">
            <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Sparkles size={18} style={{ color: 'var(--color-accent)' }} />
              <span>Healthy Habits</span>
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Integrate wellness activities into your daily routine.
            </p>
            <div className="space-y-3 pt-1">
              {habitsList.map(habit => {
                const Icon = habit.icon;
                const isDone = habits[habit.id];
                return (
                  <button key={habit.id} onClick={() => setHabits(p => ({ ...p, [habit.id]: !p[habit.id] }))}
                    className="w-full flex items-center justify-between p-3 rounded-xl transition text-left"
                    style={{ border: '1px solid var(--border-color)', background: isDone ? `${habit.accent}10` : 'transparent' }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ background: `${habit.accent}20`, color: habit.accent }}>
                        <Icon size={15} />
                      </div>
                      <span className={`text-sm font-medium ${isDone ? 'line-through' : ''}`}
                        style={{ color: isDone ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                        {habit.text}
                      </span>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition"
                      style={{ borderColor: isDone ? '#10B981' : 'var(--border-color)', background: isDone ? '#10B981' : 'transparent' }}>
                      {isDone && <span className="text-white text-[10px] font-bold">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTask} task={editingTask} />
    </div>
  );
};

export default Home;

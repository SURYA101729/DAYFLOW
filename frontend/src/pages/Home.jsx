import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TaskModal from '../components/TaskModal';
import ConfettiAnimation from '../components/ConfettiAnimation';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Calendar,
  Clock,
  Sparkles,
  Droplet,
  Compass,
  Heart
} from 'lucide-react';

const quotes = [
  "Your future is created by what you do today, not tomorrow.",
  "Productivity is being able to do things that you were never able to do before.",
  "Focus on being productive instead of busy.",
  "The secret of getting ahead is getting started.",
  "Determine never to be idle. No one will have occasion to complain of the want of time who never loses any."
];

const habitsList = [
  { id: 'hydrate', text: 'Drink 500ml water 💧', icon: Droplet, color: 'text-blue-500 bg-blue-50' },
  { id: 'stretch', text: '5-minute full body stretch 🧘', icon: Compass, color: 'text-emerald-500 bg-emerald-50' },
  { id: 'meditate', text: '10-minute deep breathing 🧘‍♂️', icon: Heart, color: 'text-purple-500 bg-purple-50' },
];

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Local habit checklist state
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('dayflow_habits_today');
    const today = new Date().toISOString().substring(0, 10);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) return parsed.items;
    }
    return { hydrate: false, stretch: false, meditate: false };
  });

  useEffect(() => {
    // Save habit state
    const today = new Date().toISOString().substring(0, 10);
    localStorage.setItem('dayflow_habits_today', JSON.stringify({ date: today, items: habits }));
  }, [habits]);

  useEffect(() => {
    // Select quote
    const index = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[index]);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch today\'s tasks. Please reload.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskData.id) {
        // Edit task
        const response = await api.put(`/api/tasks/${taskData.id}`, taskData);
        setTasks(tasks.map(t => t.id === taskData.id ? response.data : t));
      } else {
        // Create task
        const response = await api.post('/api/tasks', taskData);
        setTasks([...tasks, response.data]);
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save task. Check validation errors.');
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      // Optimistic UI update
      setTasks(tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
      await api.patch(`/api/tasks/${taskId}/complete`);
    } catch (err) {
      console.error(err);
      // Revert if API fails
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete task.');
    }
  };

  const openAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const toggleHabit = (id) => {
    setHabits(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);
  const totalCount = tasks.length;
  const completedCount = completedTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Show confetti trigger
  const showConfetti = progressPercent === 100 && totalCount > 0;

  return (
    <div className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <ConfettiAnimation active={showConfetti} />

      {/* Quote Banner */}
      <div className="glass-panel p-6 rounded-2xl shadow-premium border-l-4 border-l-primary-accent flex items-start space-x-4">
        <span className="text-3xl">✨</span>
        <div>
          <p className="italic text-slate-700 font-medium">"{quote}"</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Today's Motivation</p>
        </div>
      </div>

      {/* Progress & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Tracker */}
        <div className="glass-panel p-6 rounded-2xl shadow-premium md:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Today's Completion Rate</h3>
            <span className="text-xl font-extrabold text-primary-accent">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-accent to-success h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-4">
            {completedCount} of {totalCount} tasks completed. {progressPercent === 100 && totalCount > 0 ? '🎉 All tasks done!' : 'Keep going!'}
          </p>
        </div>

        {/* Calendar Card */}
        <div className="glass-panel p-6 rounded-2xl shadow-premium flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Date</p>
            <p className="text-xl font-bold text-slate-800">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-primary-accent rounded-xl">
            <Calendar size={24} />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
              <span>📅</span>
              <span>Today's Schedule</span>
            </h2>
            <button
              onClick={openAddModal}
              className="flex items-center space-x-2 bg-primary-accent hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition duration-200 shadow-premium"
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>
          </div>

          {loading ? (
            <div className="py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="glass-panel p-8 rounded-2xl text-center border-red-100 text-red-600">
              {error}
            </div>
          ) : tasks.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
              <span className="text-4xl block">🌊</span>
              <h3 className="font-bold text-slate-800 text-lg">No tasks for today</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Create a task to build your routine and keep your DayFlow clean.
              </p>
              <button
                onClick={openAddModal}
                className="mt-2 text-primary-accent hover:underline font-semibold text-sm"
              >
                Create your first task
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Tasks */}
              {activeTasks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Tasks ({activeTasks.length})</h4>
                  {activeTasks.map(task => (
                    <div
                      key={task.id}
                      className="glass-panel p-5 rounded-2xl shadow-premium flex items-center justify-between border border-transparent hover:border-slate-200 transition duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={task.isCompleted}
                          onChange={() => handleToggleComplete(task.id)}
                          className="w-5 h-5 rounded border-slate-300 text-primary-accent focus:ring-blue-100 focus:ring-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{task.title}</p>
                          <div className="flex items-center space-x-3 mt-1 text-slate-400 text-xs font-medium">
                            <span className="flex items-center space-x-1">
                              <Clock size={12} />
                              <span>{task.startTime?.substring(0, 5)}</span>
                            </span>
                            <span>•</span>
                            <span>{task.duration} min</span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                              {task.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => openEditModal(task)}
                          className="p-2 text-slate-400 hover:text-primary-accent hover:bg-blue-50 rounded-lg transition"
                          title="Edit Task"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-200/50">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Tasks ({completedTasks.length})</h4>
                  {completedTasks.map(task => (
                    <div
                      key={task.id}
                      className="glass-panel p-5 rounded-2xl shadow-premium flex items-center justify-between bg-slate-50/50 opacity-75"
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={task.isCompleted}
                          onChange={() => handleToggleComplete(task.id)}
                          className="w-5 h-5 rounded border-slate-300 text-[#2ECC71] focus:ring-emerald-100 focus:ring-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-medium text-slate-500 line-through text-sm">{task.title}</p>
                          <div className="flex items-center space-x-3 mt-1 text-slate-400 text-xs">
                            <span className="flex items-center space-x-1">
                              <Clock size={12} />
                              <span>{task.startTime?.substring(0, 5)}</span>
                            </span>
                            <span>•</span>
                            <span>{task.duration} min</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Daily Habits */}
          <div className="glass-panel p-6 rounded-2xl shadow-premium space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center space-x-2">
              <Sparkles className="text-warning" size={18} />
              <span>Healthy Habits</span>
            </h3>
            <p className="text-xs text-slate-500">
              Integrate minor wellness activities into your daily routine.
            </p>
            <div className="space-y-3 pt-2">
              {habitsList.map(habit => {
                const Icon = habit.icon;
                const isDone = habits[habit.id];
                return (
                  <button
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition duration-150 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${habit.color}`}>
                        <Icon size={16} />
                      </div>
                      <span className={`text-sm font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {habit.text}
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                      isDone ? 'bg-success border-success text-white' : 'border-slate-300'
                    }`}>
                      {isDone && <span className="text-[10px]">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal Form */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
};

export default Home;

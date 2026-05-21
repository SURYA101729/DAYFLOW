import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, task = null }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setCategory(task.category || 'Work');
      setStartTime(task.startTime ? task.startTime.substring(0, 5) : '');
      setDuration(task.duration || '');
      setTaskDate(task.taskDate || new Date().toISOString().substring(0, 10));
    } else {
      setTitle('');
      setCategory('Work');
      setStartTime('');
      setDuration('');
      setTaskDate(new Date().toISOString().substring(0, 10));
    }
    setErrors({});
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!startTime) {
      newErrors.startTime = 'Start time is required';
    }
    if (!duration) {
      newErrors.duration = 'Duration is required';
    } else if (isNaN(duration) || Number(duration) <= 0) {
      newErrors.duration = 'Duration must be a positive number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: task?.id,
      title: title.trim(),
      category,
      startTime: startTime + ':00', // Spring LocalTime format
      duration: parseInt(duration, 10),
      taskDate
    });
  };

  return (
    <div className="fixed inset-0 bg-[#1E3A5F]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-premium border border-slate-100 overflow-hidden animate-pulse-slow-once">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">
            {task ? 'Edit Task' : 'Add New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design team review"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.title ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100'
              } focus:border-primary-accent focus:outline-none focus:ring-4 transition duration-200 text-sm`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-accent focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-200 text-sm bg-white"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Health">Health</option>
              <option value="Study">Study</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Start Time *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.startTime ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100'
                } focus:border-primary-accent focus:outline-none focus:ring-4 transition duration-200 text-sm`}
              />
              {errors.startTime && <p className="text-xs text-red-500 mt-1">{errors.startTime}</p>}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Duration (min) *
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 60"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.duration ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100'
                } focus:border-primary-accent focus:outline-none focus:ring-4 transition duration-200 text-sm`}
              />
              {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration}</p>}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Task Date
            </label>
            <input
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-accent focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-200 text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition duration-200 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-primary-accent hover:bg-blue-600 text-white font-semibold rounded-xl transition duration-200 shadow-premium text-sm"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

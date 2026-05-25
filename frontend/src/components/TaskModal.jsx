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
      setTitle(''); setCategory('Work'); setStartTime(''); setDuration('');
      setTaskDate(new Date().toISOString().substring(0, 10));
    }
    setErrors({});
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!startTime) newErrors.startTime = 'Start time is required';
    if (!duration) newErrors.duration = 'Duration is required';
    else if (isNaN(duration) || Number(duration) <= 0) newErrors.duration = 'Must be a positive number';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    onSave({
      id: task?.id,
      title: title.trim(),
      category,
      startTime: startTime + ':00',
      duration: parseInt(duration, 10),
      taskDate,
    });
  };

  const inputStyle = {
    background: 'var(--bg-main)',
    color: 'var(--text-primary)',
    borderColor: 'var(--border-color)',
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid var(--border-color)' }}>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {task ? 'Edit Task' : 'Add New Task'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg transition hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-secondary)' }}>Task Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Design team review"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition text-sm"
              style={{ ...inputStyle, borderColor: errors.title ? '#EF4444' : 'var(--border-color)' }} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-secondary)' }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition text-sm"
              style={inputStyle}>
              {['Work','Personal','Health','Study','Other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: 'var(--text-secondary)' }}>Start Time *</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition text-sm"
                style={{ ...inputStyle, borderColor: errors.startTime ? '#EF4444' : 'var(--border-color)' }} />
              {errors.startTime && <p className="text-xs text-red-500 mt-1">{errors.startTime}</p>}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: 'var(--text-secondary)' }}>Duration (min) *</label>
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)}
                placeholder="e.g. 60"
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition text-sm"
                style={{ ...inputStyle, borderColor: errors.duration ? '#EF4444' : 'var(--border-color)' }} />
              {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration}</p>}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-secondary)' }}>Task Date</label>
            <input type="date" value={taskDate} onChange={e => setTaskDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition text-sm"
              style={inputStyle} />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
            <button type="button" onClick={onClose}
              className="flex-1 py-3 px-4 font-semibold rounded-xl transition text-sm"
              style={{ background: 'var(--border-color)', color: 'var(--text-primary)' }}>
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 px-4 text-white font-semibold rounded-xl transition text-sm"
              style={{ background: 'var(--color-accent)' }}>
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

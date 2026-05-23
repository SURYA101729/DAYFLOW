import React, { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Upload, Trash2, Check, Palette, Sparkles, Image, CheckCircle2 } from 'lucide-react';

const Theme = () => {
  const {
    isDark,
    toggleDark,
    colorTheme,
    colorThemeId,
    setTheme,
    themes,
    profilePhoto,
    updateProfilePhoto,
    bgPhoto,
    updateBgPhoto
  } = useTheme();

  const profileFileRef = useRef();
  const bgFileRef = useRef();

  const handlePhotoUpload = (e, updateFunc) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Photo must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => updateFunc(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header Intro */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
          <span>🎨</span>
          <span style={{ color: 'var(--text-primary)' }}>Personalized Themes & Customization</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Make DayFlow yours. Customize your look, toggle dark/light mode, select a color accent, and upload your personal background and profile photos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Appearance Mode */}
          <div className="glass-panel p-6 rounded-2xl shadow-premium border border-slate-100/50">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>🌓</span> Appearance Mode
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => isDark && toggleDark()}
                className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border text-sm font-semibold transition ${
                  !isDark 
                    ? 'border-transparent text-white shadow-md' 
                    : 'border-slate-200 hover:bg-slate-100/30'
                }`}
                style={{
                  background: !isDark ? 'var(--color-accent)' : 'transparent',
                  color: !isDark ? '#fff' : 'var(--text-secondary)'
                }}
              >
                <Sun size={18} />
                Light Mode
              </button>
              <button
                onClick={() => !isDark && toggleDark()}
                className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border text-sm font-semibold transition ${
                  isDark 
                    ? 'border-transparent text-white shadow-md' 
                    : 'border-slate-200 hover:bg-slate-100/30'
                }`}
                style={{
                  background: isDark ? 'var(--color-accent)' : 'transparent',
                  color: isDark ? '#fff' : 'var(--text-secondary)'
                }}
              >
                <Moon size={18} />
                Dark Mode
              </button>
            </div>
          </div>

          {/* Color Themes */}
          <div className="glass-panel p-6 rounded-2xl shadow-premium border border-slate-100/50">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Palette size={16} /> Color Theme Accents
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition duration-200 hover:scale-[1.03] ${
                    colorThemeId === t.id 
                      ? 'shadow-md' 
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                  style={{
                    borderColor: colorThemeId === t.id ? t.accent : 'transparent',
                    background: colorThemeId === t.id ? `${t.accent}12` : 'rgba(255, 255, 255, 0.02)'
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner relative"
                    style={{ background: `linear-gradient(135deg, ${t.dark}, ${t.accent})` }}
                  >
                    {colorThemeId === t.id && (
                      <Check size={18} className="text-white" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {t.emoji} {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Photos Customization */}
          <div className="glass-panel p-6 rounded-2xl shadow-premium border border-slate-100/50 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>📷</span> Personal Photos & background
            </h3>

            {/* Profile Photo */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Profile Avatar Photo
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div
                  className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 shadow-premium"
                  style={{
                    background: profilePhoto ? 'transparent' : `linear-gradient(135deg, ${colorTheme.dark}, ${colorTheme.accent})`,
                    border: `3px solid var(--color-accent)`,
                  }}
                >
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl text-white">👤</span>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-1 w-full">
                  <div className="flex gap-2">
                    <button
                      onClick={() => profileFileRef.current.click()}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow transition hover:opacity-90"
                      style={{ background: 'var(--color-accent)' }}
                    >
                      <Upload size={14} />
                      Upload Avatar
                    </button>
                    {profilePhoto && (
                      <button
                        onClick={() => updateProfilePhoto(null)}
                        className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50/50 transition"
                        title="Remove Photo"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Supports PNG, JPG or GIF. Maximum size 2MB.
                  </p>
                </div>
              </div>
              <input
                ref={profileFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoUpload(e, updateProfilePhoto)}
              />
            </div>

            <hr style={{ borderColor: 'var(--border-color)' }} />

            {/* Personal Dashboard Background Photo */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Dashboard Wallpaper Background
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div
                  className="w-32 h-20 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-premium bg-slate-100 relative border border-dashed border-slate-300"
                  style={{
                    backgroundImage: bgPhoto ? `url(${bgPhoto})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!bgPhoto && (
                    <Image size={24} className="text-slate-400" />
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-1 w-full">
                  <div className="flex gap-2">
                    <button
                      onClick={() => bgFileRef.current.click()}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow transition hover:opacity-90"
                      style={{ background: 'var(--color-accent)' }}
                    >
                      <Upload size={14} />
                      Upload Wallpaper
                    </button>
                    {bgPhoto && (
                      <button
                        onClick={() => updateBgPhoto(null)}
                        className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50/50 transition"
                        title="Remove Background"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Stretch your personal photo over the entire system.
                  </p>
                </div>
              </div>
              <input
                ref={bgFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoUpload(e, updateBgPhoto)}
              />
            </div>

          </div>

        </div>

        {/* Real-time Preview Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-6">
            <div className="glass-panel p-6 rounded-2xl shadow-premium border border-slate-100/50 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Sparkles size={16} className="text-amber-500" /> Dashboard Live Preview
              </h3>
              <p className="text-xs text-slate-400">
                This is a live preview of how your theme widgets, buttons, and wallpapers render.
              </p>

              {/* Sample Dashboard Container */}
              <div 
                className="rounded-2xl p-4 space-y-4 border transition duration-300 relative overflow-hidden"
                style={{ 
                  background: isDark ? '#0F172A' : colorTheme.light, 
                  borderColor: 'var(--border-color)',
                  backgroundImage: bgPhoto ? `linear-gradient(${isDark ? 'rgba(15,23,42,0.85)' : 'rgba(240,244,248,0.9)'}, ${isDark ? 'rgba(15,23,42,0.85)' : 'rgba(240,244,248,0.9)'}), url(${bgPhoto})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Simulated Header */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shadow-sm"
                      style={{
                        background: profilePhoto ? 'transparent' : `linear-gradient(135deg, ${colorTheme.dark}, ${colorTheme.accent})`,
                        border: `2px solid var(--color-accent)`,
                      }}
                    >
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-white font-bold">JD</span>
                      )}
                    </div>
                    <div>
                      <div className="h-2 w-16 rounded-full" style={{ background: 'var(--text-primary)' }} />
                      <div className="h-1.5 w-10 rounded-full mt-1 opacity-60" style={{ background: 'var(--text-secondary)' }} />
                    </div>
                  </div>
                  <span className="text-xs">📅 Today</span>
                </div>

                {/* Simulated Widget Card */}
                <div className="glass-panel p-4 rounded-xl border border-slate-100/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                      Schedule Completion
                    </span>
                    <span className="text-xs font-extrabold" style={{ color: 'var(--color-accent)' }}>75%</span>
                  </div>
                  <div className="w-full bg-slate-200/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: '75%', background: 'var(--color-accent)' }}
                    />
                  </div>
                </div>

                {/* Simulated Action Row */}
                <div className="flex gap-2">
                  <button 
                    className="flex-1 text-[10px] font-bold py-2 rounded-lg text-white shadow-sm transition"
                    style={{ background: 'var(--color-accent)' }}
                  >
                    Create Task
                  </button>
                  <button 
                    className="flex-1 text-[10px] font-bold py-2 rounded-lg border transition"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    Settings
                  </button>
                </div>
              </div>

              {/* Status Checklist Banner */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-semibold">
                <CheckCircle2 size={16} className="flex-shrink-0" />
                <span>Theme is saved globally and applies to all pages instantly!</span>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Theme;

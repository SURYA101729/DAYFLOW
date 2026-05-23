import React, { useRef } from 'react';
import { X, Sun, Moon, Upload, Trash2, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemePanel = ({ onClose }) => {
  const { isDark, toggleDark, colorTheme, colorThemeId, setTheme, themes, profilePhoto, updateProfilePhoto } = useTheme();
  const fileRef = useRef();

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Photo must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => updateProfilePhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              Customize Theme
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Dark / Light toggle */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              APPEARANCE
            </p>
            <div
              className="flex rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--border-color)' }}
            >
              <button
                onClick={() => isDark && toggleDark()}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition"
                style={{
                  background: !isDark ? 'var(--color-accent)' : 'transparent',
                  color: !isDark ? '#fff' : 'var(--text-secondary)',
                }}
              >
                <Sun size={16} />
                Light
              </button>
              <button
                onClick={() => !isDark && toggleDark()}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition"
                style={{
                  background: isDark ? 'var(--color-accent)' : 'transparent',
                  color: isDark ? '#fff' : 'var(--text-secondary)',
                }}
              >
                <Moon size={16} />
                Dark
              </button>
            </div>
          </div>

          {/* Color themes */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              COLOR THEME
            </p>
            <div className="grid grid-cols-4 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition hover:scale-105"
                  style={{
                    border: colorThemeId === theme.id
                      ? `2px solid ${theme.accent}`
                      : '2px solid transparent',
                    background: colorThemeId === theme.id
                      ? `${theme.accent}15`
                      : 'transparent',
                  }}
                  title={theme.name}
                >
                  {/* Color swatch */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-md relative"
                    style={{ background: `linear-gradient(135deg, ${theme.dark}, ${theme.accent})` }}
                  >
                    {colorThemeId === theme.id && (
                      <Check size={16} className="text-white" strokeWidth={3} />
                    )}
                  </div>
                  <span
                    className="text-xs font-medium text-center leading-tight"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {theme.emoji}
                  </span>
                </button>
              ))}
            </div>
            {/* Theme name display */}
            <p
              className="text-center text-sm font-semibold mt-3"
              style={{ color: 'var(--color-accent)' }}
            >
              {colorTheme.emoji} {colorTheme.name}
            </p>
          </div>

          {/* Profile photo */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              PROFILE PHOTO
            </p>
            <div className="flex items-center gap-4">
              {/* Preview */}
              <div
                className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md"
                style={{
                  background: profilePhoto ? 'transparent' : `linear-gradient(135deg, ${colorTheme.dark}, ${colorTheme.accent})`,
                  border: `3px solid var(--color-accent)`,
                }}
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl text-white">👤</span>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 flex-1">
                <button
                  onClick={() => fileRef.current.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition hover:opacity-80"
                  style={{ background: 'var(--color-accent)', color: '#fff' }}
                >
                  <Upload size={14} />
                  {profilePhoto ? 'Change Photo' : 'Upload Photo'}
                </button>
                {profilePhoto && (
                  <button
                    onClick={() => updateProfilePhoto(null)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition hover:opacity-80"
                    style={{
                      background: 'transparent',
                      color: '#E74C3C',
                      border: '1px solid #E74C3C',
                    }}
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                )}
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  JPG, PNG or GIF · Max 2MB
                </p>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          {/* Preview strip */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              PREVIEW
            </p>
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ background: isDark ? '#0F172A' : colorTheme.light, border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${colorTheme.dark}, ${colorTheme.accent})` }}
                />
                <div>
                  <div className="h-2.5 w-24 rounded-full" style={{ background: 'var(--color-accent)' }} />
                  <div className="h-2 w-16 rounded-full mt-1" style={{ background: 'var(--text-secondary)', opacity: 0.4 }} />
                </div>
              </div>
              <div
                className="h-8 rounded-lg"
                style={{ background: `linear-gradient(90deg, ${colorTheme.accent}30, ${colorTheme.dark}20)` }}
              />
              <div className="flex gap-2">
                <div className="h-6 flex-1 rounded-md" style={{ background: 'var(--color-accent)', opacity: 0.8 }} />
                <div className="h-6 flex-1 rounded-md" style={{ background: 'var(--border-color)' }} />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex justify-end"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-sm font-semibold transition hover:opacity-80"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemePanel;

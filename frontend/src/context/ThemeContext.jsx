import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const COLOR_THEMES = [
  { id: 'ocean',   name: 'Ocean Blue',    emoji: '🌊', accent: '#3498DB', dark: '#1E3A5F', light: '#F0F4F8' },
  { id: 'forest',  name: 'Forest Green',  emoji: '🌿', accent: '#27AE60', dark: '#1A3A2A', light: '#F0F7F4' },
  { id: 'sunset',  name: 'Sunset Orange', emoji: '🌅', accent: '#E67E22', dark: '#3D1F0A', light: '#FDF6F0' },
  { id: 'rose',    name: 'Rose Pink',     emoji: '🌸', accent: '#E91E8C', dark: '#3D0A2A', light: '#FDF0F7' },
  { id: 'violet',  name: 'Deep Violet',   emoji: '💜', accent: '#8B5CF6', dark: '#2D1B69', light: '#F5F3FF' },
  { id: 'crimson', name: 'Crimson Red',   emoji: '🔴', accent: '#E74C3C', dark: '#3D0A0A', light: '#FDF0F0' },
  { id: 'teal',    name: 'Teal',          emoji: '🩵', accent: '#14B8A6', dark: '#0A2D2D', light: '#F0FAFA' },
  { id: 'gold',    name: 'Golden',        emoji: '✨', accent: '#F59E0B', dark: '#3D2A00', light: '#FFFBEB' },
];

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('dayflow_dark') === 'true');
  const [colorThemeId, setColorThemeId] = useState(() => localStorage.getItem('dayflow_theme') || 'ocean');
  const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem('dayflow_photo') || null);
  const [bgPhoto, setBgPhoto] = useState(() => localStorage.getItem('dayflow_bg') || null);

  const colorTheme = COLOR_THEMES.find(t => t.id === colorThemeId) || COLOR_THEMES[0];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-accent', colorTheme.accent);
    root.style.setProperty('--color-primary-dark', colorTheme.dark);
    root.style.setProperty('--color-primary-light', colorTheme.light);

    if (isDark) {
      root.classList.add('dark');
      root.style.setProperty('--bg-main',       '#0F172A');
      root.style.setProperty('--bg-sidebar',    '#1E293B');
      root.style.setProperty('--bg-card',       '#1E293B');
      root.style.setProperty('--text-primary',  '#F1F5F9');
      root.style.setProperty('--text-secondary','#94A3B8');
      root.style.setProperty('--border-color',  '#334155');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--bg-main',       colorTheme.light);
      root.style.setProperty('--bg-sidebar',    '#FFFFFF');
      root.style.setProperty('--bg-card',       '#FFFFFF');
      root.style.setProperty('--text-primary',  colorTheme.dark);
      root.style.setProperty('--text-secondary','#64748B');
      root.style.setProperty('--border-color',  '#E2E8F0');
    }

    // Apply background photo to DOM
    if (bgPhoto) {
      root.style.setProperty('--bg-photo-url', `url("${bgPhoto}")`);
      root.classList.add('has-bg-photo');
    } else {
      root.style.removeProperty('--bg-photo-url');
      root.classList.remove('has-bg-photo');
    }

    localStorage.setItem('dayflow_dark', isDark);
    localStorage.setItem('dayflow_theme', colorThemeId);
  }, [isDark, colorThemeId, colorTheme, bgPhoto]);

  const toggleDark = () => setIsDark(p => !p);
  const setTheme = (id) => { setColorThemeId(id); localStorage.setItem('dayflow_theme', id); };
  const updateProfilePhoto = (d) => { setProfilePhoto(d); d ? localStorage.setItem('dayflow_photo', d) : localStorage.removeItem('dayflow_photo'); };
  const updateBgPhoto = (d) => { setBgPhoto(d); d ? localStorage.setItem('dayflow_bg', d) : localStorage.removeItem('dayflow_bg'); };

  return (
    <ThemeContext.Provider value={{
      isDark, toggleDark,
      colorTheme, colorThemeId, setTheme,
      themes: COLOR_THEMES,
      profilePhoto, updateProfilePhoto,
      bgPhoto, updateBgPhoto,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

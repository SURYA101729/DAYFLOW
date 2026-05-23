import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemePanel from './ThemePanel';
import {
  Home,
  Lightbulb,
  BarChart3,
  HelpCircle,
  LogOut,
  Shield,
  Menu,
  X,
  Palette,
  Sun,
  Moon,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleDark, colorTheme, profilePhoto } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showTheme, setShowTheme] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Advice', path: '/advice', icon: Lightbulb },
    { name: 'Analysis', path: '/analysis', icon: BarChart3 },
    { name: 'Support', path: '/support', icon: HelpCircle },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'Admin Support', path: '/admin/support', icon: Shield });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 font-medium text-sm ${
      isActive ? 'text-white shadow-md' : ''
    }`;

  const linkStyle = (isActive) => isActive
    ? { background: 'var(--color-accent)' }
    : { color: 'var(--text-secondary)' };

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="lg:hidden flex items-center justify-between p-4 sticky top-0 z-40"
        style={{ background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🌊</span>
          <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
            DayFlow
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Dark mode toggle - mobile */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg transition hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg transition hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-45 w-64 flex flex-col justify-between h-screen transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-color)' }}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🌊</span>
              <span
                className="font-extrabold text-2xl tracking-tight"
                style={{ color: 'var(--color-accent)' }}
              >
                DayFlow
              </span>
            </div>
            {/* Dark mode toggle - desktop */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg transition hover:opacity-70"
              style={{ color: 'var(--text-secondary)' }}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setIsOpen(false)}
                className={linkClass}
                style={({ isActive }) => linkStyle(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={20}
                      style={{ color: isActive ? '#fff' : 'var(--text-secondary)' }}
                    />
                    <span style={{ color: isActive ? '#fff' : 'var(--text-secondary)' }}>
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="p-6 space-y-3" style={{ borderTop: '1px solid var(--border-color)' }}>

          {/* Theme button */}
          <button
            onClick={() => { setShowTheme(true); setIsOpen(false); }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--border-color)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Palette size={20} />
            <span>Customize Theme</span>
          </button>

          {/* User profile */}
          {user && (
            <div className="flex items-center space-x-3 px-1">
              <div
                className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{
                  background: profilePhoto ? 'transparent' : `linear-gradient(135deg, ${colorTheme.dark}, ${colorTheme.accent})`,
                  border: `2px solid var(--color-accent)`,
                }}
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {user.name}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 font-medium text-sm"
            style={{ color: '#E74C3C' }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Theme Panel */}
      {showTheme && <ThemePanel onClose={() => setShowTheme(false)} />}
    </>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Lightbulb,
  BarChart3,
  HelpCircle,
  LogOut,
  Shield,
  Menu,
  X,
  User as UserIcon
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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
    `flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 ${
      isActive
        ? 'bg-primary-accent text-white shadow-premium'
        : 'text-slate-600 hover:bg-slate-100 hover:text-[#1E3A5F]'
    }`;

  return (
    <>
      {/* Mobile top navigation */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🌊</span>
          <span className="font-bold text-xl tracking-tight text-[#1E3A5F]">DayFlow</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar background drawer on mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-[#1E3A5F]/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-45 w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="hidden lg:flex items-center space-x-3 mb-8">
            <span className="text-3xl">🌊</span>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary-dark to-primary-accent bg-clip-text text-transparent">
              DayFlow
            </span>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={linkClass}
              >
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-6 border-t border-slate-100 space-y-4">
          {user && (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-primary-dark">
                <UserIcon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-danger hover:bg-red-50 hover:text-red-700 transition duration-200 font-medium text-sm"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

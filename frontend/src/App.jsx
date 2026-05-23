import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Advice from './pages/Advice';
import Analysis from './pages/Analysis';
import Support from './pages/Support';
import AdminSupport from './pages/AdminSupport';
import Theme from './pages/Theme';
import Login from './pages/Login';
import Register from './pages/Register';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen" style={{ background: 'var(--bg-main)' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout><Home /></DashboardLayout></ProtectedRoute>} />
      <Route path="/advice" element={<ProtectedRoute><DashboardLayout><Advice /></DashboardLayout></ProtectedRoute>} />
      <Route path="/analysis" element={<ProtectedRoute><DashboardLayout><Analysis /></DashboardLayout></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute><DashboardLayout><Support /></DashboardLayout></ProtectedRoute>} />
      <Route path="/theme" element={<ProtectedRoute><DashboardLayout><Theme /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/support" element={<ProtectedRoute requiredRole="ADMIN"><DashboardLayout><AdminSupport /></DashboardLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

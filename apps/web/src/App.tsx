import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import SwapRequests from './pages/SwapRequests';
import Navbar from './components/Navbar';
import { NotificationProvider } from './context/NotificationContext';
import NotificationToast from './components/NotificationToast';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const stored = localStorage.getItem('skillswap_user');
    return stored ? JSON.parse(stored) : null;
  });

  const handleLoginSuccess = (user: any) => {
    localStorage.setItem('skillswap_user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('skillswap_user');
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <BrowserRouter>
        <Login onLoginSuccess={handleLoginSuccess} />
      </BrowserRouter>
    );
  }

  const handleUpdateUser = (updatedUser: any) => {
    const merged = { ...currentUser, ...updatedUser };
    localStorage.setItem('skillswap_user', JSON.stringify(merged));
    setCurrentUser(merged);
  };

  return (
    <BrowserRouter>
      <NotificationProvider currentUser={currentUser}>
        <div className="min-h-screen bg-gray-50">
          <Navbar currentUser={currentUser} onLogout={handleLogout} />
          <NotificationToast />
          <main className="max-w-7xl mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Dashboard currentUser={currentUser} />} />
              <Route path="/profile" element={<Profile currentUser={currentUser} onUpdateUser={handleUpdateUser} />} />
              <Route path="/explore" element={<Explore currentUser={currentUser} />} />
              <Route path="/swap-requests" element={<SwapRequests currentUser={currentUser} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </NotificationProvider>
    </BrowserRouter>
  );
}

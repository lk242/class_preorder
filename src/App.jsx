import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import MyBookingsPage from './pages/MyBookingsPage';

export default function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#0a0c14] text-slate-200 font-sans selection:bg-amber-500/30 overflow-x-hidden">
            {/* 背景裝飾 */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[150px] rounded-full animate-pulse"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[150px] rounded-full"></div>
            </div>

            <Navbar />

            <main className="relative z-10 pt-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
                <Route path="/admin/login" element={<LoginPage />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>

            <footer className="max-w-6xl mx-auto p-20 text-center border-t border-indigo-900/20 mt-20 relative z-10 opacity-30">
              <p className="text-indigo-500/40 text-[9px] tracking-[0.6em] uppercase font-light">
                &copy; 2026 Cosmic Light Language Studio. 讓每一束光都找到回家的路。
              </p>
            </footer>

            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              .animate-spin-slow { animation: spin-slow 25s linear infinite; }
            `}} />
          </div>
        </BrowserRouter>
      </CourseProvider>
    </AuthProvider>
  );
}

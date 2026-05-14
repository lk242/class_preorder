import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const MyBookingsPage = lazy(() => import('./pages/MyBookingsPage'));

export default function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <BrowserRouter>
          <div className="min-h-screen overflow-x-hidden bg-[#0a0c14] font-sans text-slate-200 selection:bg-amber-500/30">
            <div className="pointer-events-none fixed inset-0 z-0">
              <div className="absolute left-[-10%] top-[-20%] h-[60%] w-[60%] rounded-full bg-purple-900/10 blur-[150px] animate-pulse"></div>
              <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-900/10 blur-[150px]"></div>
            </div>

            <Navbar />

            <main className="relative z-10 pt-4">
              <Suspense
                fallback={
                  <div className="flex min-h-[60vh] items-center justify-center p-6 text-sm tracking-widest text-indigo-300/70">
                    載入中...
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/booking" element={<BookingPage />} />
                  <Route path="/my-bookings" element={<MyBookingsPage />} />
                  <Route path="/admin/login" element={<LoginPage />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </main>

            <footer className="relative z-10 mx-auto mt-20 max-w-6xl border-t border-indigo-900/20 p-10 text-center opacity-30 sm:p-20">
              <p className="text-[9px] font-light uppercase tracking-[0.6em] text-indigo-500/40">
                &copy; 2026 Cosmic Light Language Studio. 讓每一束光都找到回家的路。
              </p>
            </footer>

            <style
              dangerouslySetInnerHTML={{
                __html: `
                  @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                  .animate-spin-slow { animation: spin-slow 25s linear infinite; }
                `
              }}
            />
          </div>
        </BrowserRouter>
      </CourseProvider>
    </AuthProvider>
  );
}

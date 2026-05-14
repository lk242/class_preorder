import React from 'react';
import { Navigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <RefreshCw className="animate-spin text-indigo-400" size={32} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8">
        <div className="bg-[#121625] rounded-[3rem] p-12 border border-red-500/20 max-w-sm">
          <h2 className="text-xl font-bold text-red-400 tracking-widest mb-4">存取被拒</h2>
          <p className="text-indigo-300/60 text-sm mb-2">此帳號未被授權管理權限。</p>
          <p className="text-indigo-500/40 text-[10px] tracking-widest mb-8">{user.email}</p>
          <Navigate to="/admin/login" replace />
        </div>
      </div>
    );
  }

  return children;
}

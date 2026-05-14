import React, { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = location.pathname.startsWith('/admin');
  const tapRef = useRef({ count: 0, timer: null });

  const handleLogoClick = (e) => {
    if (isAdmin) return;
    const tap = tapRef.current;
    tap.count++;
    clearTimeout(tap.timer);
    if (tap.count >= 5) {
      tap.count = 0;
      e.preventDefault();
      navigate('/admin/login');
    } else {
      tap.timer = setTimeout(() => { tap.count = 0; }, 2000);
    }
  };

  return (
    <nav className="bg-[#121625]/60 backdrop-blur-xl border-b border-indigo-900/30 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" onClick={handleLogoClick} className="flex items-center space-x-3 group">
        <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <div>
          <span className="font-bold text-xl tracking-wider text-amber-50 block">宇宙光語</span>
          <span className="text-[9px] text-indigo-400 uppercase tracking-[0.3em] font-light">Cosmic Light Language</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className={`text-sm tracking-widest uppercase transition-colors ${location.pathname === '/' ? 'text-amber-400 font-bold' : 'text-indigo-300 hover:text-amber-200'}`}>
          靈魂導引
        </Link>
        <Link to="/booking" className={`text-sm tracking-widest uppercase transition-colors ${location.pathname === '/booking' ? 'text-amber-400 font-bold' : 'text-indigo-300 hover:text-amber-200'}`}>
          預約場域
        </Link>
        <Link to="/my-bookings" className={`text-sm tracking-widest uppercase transition-colors ${location.pathname === '/my-bookings' ? 'text-amber-400 font-bold' : 'text-indigo-300 hover:text-amber-200'}`}>
          我的預約
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {user && !isAdmin && (
          <div className="hidden sm:flex items-center space-x-2 bg-indigo-950/40 px-3 py-1.5 rounded-full border border-indigo-500/20">
            {user.photoURL && <img src={user.photoURL} referrerPolicy="no-referrer" className="w-5 h-5 rounded-full border border-amber-500/30" alt="user" />}
            <span className="text-[10px] text-amber-100 font-bold tracking-widest uppercase">Connected</span>
          </div>
        )}
        {isAdmin && user && (
          <button onClick={logout} className="flex items-center space-x-2 text-indigo-400 hover:text-red-400 transition-colors text-sm">
            <LogOut size={16} />
            <span className="hidden sm:inline tracking-widest uppercase text-xs">登出</span>
          </button>
        )}
        <Link to="/booking" className="bg-indigo-600/20 border border-indigo-500/30 px-5 py-2 rounded-full text-xs tracking-widest text-indigo-100 font-bold uppercase shadow-lg shadow-indigo-900/20 hover:bg-indigo-600/40 transition-all">
          BOOK NOW
        </Link>
      </div>
    </nav>
  );
}

import React, { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Sparkles } from 'lucide-react';
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
    tap.count += 1;
    clearTimeout(tap.timer);

    if (tap.count >= 5) {
      tap.count = 0;
      e.preventDefault();
      navigate('/admin/login');
    } else {
      tap.timer = setTimeout(() => {
        tap.count = 0;
      }, 2000);
    }
  };

  const navLinkClass = (path) =>
    `text-xs uppercase tracking-[0.25em] transition-colors sm:text-sm ${
      location.pathname === path ? 'text-amber-400 font-bold' : 'text-indigo-300 hover:text-amber-200'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-indigo-900/30 bg-[#121625]/80 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" onClick={handleLogoClick} className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 shadow-lg transition-transform group-active:scale-90">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block text-lg font-bold tracking-wide text-amber-50 sm:text-xl">光語預約</span>
              <span className="text-[9px] font-light uppercase tracking-[0.3em] text-indigo-400">Cosmic Light Language</span>
            </div>
          </Link>

          {isAdmin && user && (
            <button onClick={logout} className="flex items-center gap-2 text-xs tracking-widest text-indigo-400 transition-colors hover:text-red-400 lg:hidden">
              <LogOut size={16} />
              <span>登出</span>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8">
            <Link to="/" className={navLinkClass('/')}>首頁</Link>
            <Link to="/booking" className={navLinkClass('/booking')}>課程預約</Link>
            <Link to="/my-bookings" className={navLinkClass('/my-bookings')}>我的預約</Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {user && !isAdmin && (
              <div className="hidden items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-950/40 px-3 py-1.5 sm:flex">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    referrerPolicy="no-referrer"
                    className="h-5 w-5 rounded-full border border-amber-500/30"
                    alt="user"
                  />
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-100">Connected</span>
              </div>
            )}

            {isAdmin && user && (
              <button onClick={logout} className="hidden items-center gap-2 text-sm text-indigo-400 transition-colors hover:text-red-400 lg:flex">
                <LogOut size={16} />
                <span className="text-xs uppercase tracking-widest">登出</span>
              </button>
            )}

            <Link
              to="/booking"
              className="inline-flex items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-600/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-indigo-100 shadow-lg shadow-indigo-900/20 transition-all hover:bg-indigo-600/40 sm:px-5"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

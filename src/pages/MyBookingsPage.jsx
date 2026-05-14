import React, { useState } from 'react';
import { CalendarCheck, ExternalLink, Inbox, Search } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, isConfigured } from '../config/firebase';
import { useCourses } from '../contexts/CourseContext';
import { buildCalendarUrl } from '../utils/calendar';

export default function MyBookingsPage() {
  const { courses } = useCourses();
  const [searchType, setSearchType] = useState('email');
  const [searchValue, setSearchValue] = useState('');
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim() || !isConfigured) return;

    setLoading(true);
    setSearched(true);
    try {
      const q = query(collection(db, 'registrations'), where(searchType, '==', searchValue.trim()));
      const snap = await getDocs(q);
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('booking search failed:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getCourse = (courseId) => courses.find(c => c.id === courseId);

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-4 sm:p-6">
      <div className="rounded-[2rem] border border-indigo-900/40 bg-[#121625] p-6 shadow-2xl sm:rounded-[2.5rem] sm:p-10">
        <h2 className="mb-2 flex items-center text-2xl font-bold tracking-widest text-amber-50">
          <Search className="mr-3 text-indigo-500" size={24} />
          我的預約
        </h2>
        <p className="mb-8 text-xs italic tracking-widest text-indigo-400/60 uppercase">查詢你已報名的場次</p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSearchType('email')}
              className={`rounded-xl px-4 py-2 text-xs font-bold tracking-widest transition-all ${
                searchType === 'email' ? 'bg-indigo-600 text-white' : 'border border-indigo-900/50 bg-[#0a0c14] text-indigo-400'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setSearchType('phone')}
              className={`rounded-xl px-4 py-2 text-xs font-bold tracking-widest transition-all ${
                searchType === 'phone' ? 'bg-indigo-600 text-white' : 'border border-indigo-900/50 bg-[#0a0c14] text-indigo-400'
              }`}
            >
              電話
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              required
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder={searchType === 'email' ? '請輸入報名時的 Email' : '請輸入報名時的電話'}
              className="flex-1 rounded-2xl border border-indigo-900/50 bg-[#0a0c14] p-4 text-white outline-none focus:ring-1 focus:ring-amber-500 sm:p-5"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-black uppercase tracking-widest text-[#0f111a] shadow-xl disabled:opacity-50 sm:py-5"
            >
              查詢
            </button>
          </div>
        </form>
      </div>

      {searched && (
        <div className="rounded-[2rem] border border-indigo-900/40 bg-[#121625] p-6 shadow-2xl sm:rounded-[2.5rem] sm:p-10">
          {loading ? (
            <div className="py-12 text-center tracking-widest text-indigo-400 animate-pulse">搜尋中...</div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center">
              <Inbox size={48} className="mx-auto mb-4 text-indigo-900/40" />
              <p className="text-sm tracking-widest text-indigo-400/60">找不到相關預約紀錄</p>
              <p className="mt-2 text-xs text-indigo-500/30">請確認輸入資訊與報名時一致</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="mb-4 text-lg font-bold text-amber-100">找到 {bookings.length} 筆預約</h3>
              {bookings.map((booking) => {
                const course = getCourse(booking.courseId);
                return (
                  <div key={booking.id} className="rounded-2xl border border-indigo-900/20 bg-[#0a0c14]/50 p-5 sm:p-6">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-indigo-100">{booking.courseTitle}</h4>
                        <p className="mt-1 text-[10px] font-mono text-indigo-500">
                          報名人：{booking.name} | {booking.time}
                        </p>
                      </div>
                    </div>

                    {course ? (
                      <div className="mt-3 flex flex-col gap-3 border-t border-indigo-900/20 pt-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-indigo-400">
                          {course.date} {course.start} - {course.end}
                        </p>
                        <a
                          href={buildCalendarUrl(course)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-indigo-500/30 bg-indigo-600/20 px-4 py-2 text-xs text-indigo-200 transition-all hover:bg-indigo-600/40"
                        >
                          <CalendarCheck size={14} />
                          <span className="font-bold uppercase tracking-widest">加入日曆</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs italic text-indigo-500/40">此場次已被管理員移除</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

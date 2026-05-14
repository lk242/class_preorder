import React, { useState, useEffect } from 'react';
import { Search, CalendarCheck, ExternalLink, Inbox } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
      const q = query(
        collection(db, 'registrations'),
        where(searchType, '==', searchValue.trim())
      );
      const snap = await getDocs(q);
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('查詢失敗:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getCourse = (courseId) => courses.find(c => c.id === courseId);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="bg-[#121625] rounded-[2.5rem] p-10 border border-indigo-900/40 shadow-2xl">
        <h2 className="text-2xl font-bold text-amber-50 tracking-widest mb-2 flex items-center">
          <Search className="mr-3 text-indigo-500" size={24} /> 我的預約
        </h2>
        <p className="text-indigo-400/60 text-xs mb-8 italic tracking-widest uppercase">查詢您已報名的場域</p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex space-x-2">
            <button type="button" onClick={() => setSearchType('email')}
              className={`px-4 py-2 rounded-xl text-xs tracking-widest font-bold transition-all ${searchType === 'email' ? 'bg-indigo-600 text-white' : 'bg-[#0a0c14] text-indigo-400 border border-indigo-900/50'}`}>
              Email
            </button>
            <button type="button" onClick={() => setSearchType('phone')}
              className={`px-4 py-2 rounded-xl text-xs tracking-widest font-bold transition-all ${searchType === 'phone' ? 'bg-indigo-600 text-white' : 'bg-[#0a0c14] text-indigo-400 border border-indigo-900/50'}`}>
              電話
            </button>
          </div>
          <div className="flex space-x-3">
            <input
              required
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder={searchType === 'email' ? '請輸入報名時的 Email' : '請輸入報名時的電話'}
              className="flex-1 bg-[#0a0c14] p-5 rounded-2xl border border-indigo-900/50 text-white outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button type="submit" disabled={loading}
              className="px-8 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-[#0f111a] rounded-2xl font-black uppercase tracking-widest shadow-xl disabled:opacity-50">
              查詢
            </button>
          </div>
        </form>
      </div>

      {searched && (
        <div className="bg-[#121625] rounded-[2.5rem] p-10 border border-indigo-900/40 shadow-2xl">
          {loading ? (
            <div className="text-center py-12 text-indigo-400 animate-pulse tracking-widest">搜尋中...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <Inbox size={48} className="mx-auto mb-4 text-indigo-900/40" />
              <p className="text-indigo-400/60 tracking-widest text-sm">找不到相關的預約紀錄</p>
              <p className="text-indigo-500/30 text-xs mt-2">請確認輸入的資訊與報名時一致</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-amber-100 mb-4">
                找到 {bookings.length} 筆預約
              </h3>
              {bookings.map(booking => {
                const course = getCourse(booking.courseId);
                return (
                  <div key={booking.id} className="p-6 bg-[#0a0c14]/50 rounded-2xl border border-indigo-900/20">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-indigo-100">{booking.courseTitle}</h4>
                        <p className="text-[10px] text-indigo-500 font-mono mt-1">
                          報名人：{booking.name} | {booking.time}
                        </p>
                      </div>
                    </div>
                    {course ? (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-indigo-900/20">
                        <p className="text-xs text-indigo-400">
                          {course.date} {course.start}–{course.end}
                        </p>
                        <a
                          href={buildCalendarUrl(course)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 hover:bg-indigo-600/40 transition-all"
                        >
                          <CalendarCheck size={14} />
                          <span className="tracking-widest uppercase font-bold">加入日曆</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs text-indigo-500/40 mt-2 italic">此場域已被管理員移除</p>
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

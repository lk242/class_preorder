import React, { useState } from 'react';
import { Plus, Trash2, Users, Zap, LayoutDashboard, CalendarCheck, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../contexts/CourseContext';
import { syncAllCoursesToCalendar } from '../utils/calendar';

export default function AdminPage() {
  const { user, accessToken, loginWithGoogle, logout } = useAuth();
  const { courses, registrations, addCourse, removeCourse, removeRegistration, getRegCount } = useCourses();
  const [isSyncing, setIsSyncing] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '', date: '', start: '', end: '', desc: '', category: '一般', maxParticipants: 10
  });

  const handleAddCourse = (e) => {
    e.preventDefault();
    addCourse(newCourse);
    setNewCourse({ title: '', date: '', start: '', end: '', desc: '', category: '一般', maxParticipants: 10 });
  };

  const handleCalendarSync = async () => {
    setIsSyncing(true);
    try {
      let token = accessToken;
      if (!token) {
        await loginWithGoogle(['https://www.googleapis.com/auth/calendar.events']);
        alert('已取得日曆授權，請再按一次同步按鈕。');
        return;
      }
      if (courses.length === 0) { alert('目前沒有課程可同步。'); return; }
      const results = await syncAllCoursesToCalendar(token, courses);
      if (results.failed > 0) {
        alert(`同步完成：${results.success} 個成功、${results.failed} 個失敗\n\n${results.errors.join('\n')}`);
      } else {
        alert(`同步成功！已將 ${results.success} 個場域加入您的 Google 行事曆。`);
      }
    } catch (err) {
      alert('同步失敗：' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* 頂部管理列 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121625] p-8 rounded-[2rem] border border-indigo-900/40">
        <div>
          <h2 className="text-2xl font-bold text-amber-50 tracking-widest flex items-center"><LayoutDashboard className="mr-3 text-indigo-500" /> 星際管理中樞</h2>
          <p className="text-indigo-400/60 text-xs mt-2 italic font-light tracking-widest uppercase">碎片拼湊完整。</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3 bg-indigo-900/20 px-4 py-2 rounded-xl border border-indigo-500/20">
            {user?.photoURL && <img src={user.photoURL} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-amber-500/40" alt="avatar" />}
            <div className="text-left">
              <p className="text-xs font-bold text-amber-100">{user?.displayName || '管理員'}</p>
              <p className="text-[10px] text-indigo-400">{user?.email}</p>
            </div>
            <button onClick={logout} className="text-indigo-600 hover:text-red-400 p-1"><LogOut size={16} /></button>
          </div>

          <button
            onClick={handleCalendarSync}
            disabled={isSyncing}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl transition-all shadow-xl disabled:opacity-30"
          >
            {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : <CalendarCheck size={18} />}
            <span className="font-bold tracking-widest uppercase text-sm">同步管理日曆</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 新增課程表單 */}
        <div className="bg-[#121625] rounded-[2.5rem] p-10 border border-indigo-900/40 shadow-2xl">
          <h3 className="text-xl font-bold mb-8 flex items-center text-amber-100"><Plus size={20} className="mr-2 text-amber-400" />開啟新能量場</h3>
          <form onSubmit={handleAddCourse} className="space-y-5">
            <input required className="w-full bg-[#0a0c14] p-5 rounded-2xl border border-indigo-900/50 text-white outline-none" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="場域名稱" />
            <div className="grid grid-cols-2 gap-4">
              <input required type="date" className="w-full bg-[#0a0c14] p-5 rounded-2xl border border-indigo-900/50 text-white outline-none" value={newCourse.date} onChange={e => setNewCourse({ ...newCourse, date: e.target.value })} />
              <div className="relative">
                <input required type="number" min="1" className="w-full bg-[#0a0c14] p-5 pr-14 rounded-2xl border border-indigo-900/50 text-white outline-none" value={newCourse.maxParticipants} onChange={e => setNewCourse({ ...newCourse, maxParticipants: parseInt(e.target.value) })} placeholder="名額" />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-indigo-500 text-xs pointer-events-none">人</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute left-5 top-1.5 text-[10px] text-indigo-500">開始時間</label>
                <input required type="time" className="w-full bg-[#0a0c14] pt-7 pb-3 px-5 rounded-2xl border border-indigo-900/50 text-white outline-none text-sm" value={newCourse.start} onChange={e => setNewCourse({ ...newCourse, start: e.target.value })} />
              </div>
              <div className="relative">
                <label className="absolute left-5 top-1.5 text-[10px] text-indigo-500">結束時間</label>
                <input required type="time" className="w-full bg-[#0a0c14] pt-7 pb-3 px-5 rounded-2xl border border-indigo-900/50 text-white outline-none text-sm" value={newCourse.end} onChange={e => setNewCourse({ ...newCourse, end: e.target.value })} />
              </div>
            </div>
            <textarea className="w-full bg-[#0a0c14] p-5 rounded-2xl border border-indigo-900/50 text-white outline-none h-24" value={newCourse.desc} onChange={e => setNewCourse({ ...newCourse, desc: e.target.value })} placeholder="場域描述..." />
            <button className="w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">發布場域</button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {/* 場域概覽 */}
          <div className="bg-[#121625] rounded-[2.5rem] p-10 border border-indigo-900/40 shadow-2xl text-left">
            <h3 className="text-xl font-bold mb-8 text-amber-100 flex items-center"><Zap className="mr-2 text-amber-400" /> 場域現況概覽</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map(course => {
                const currentReg = getRegCount(course.id);
                const percent = (currentReg / course.maxParticipants) * 100;
                return (
                  <div key={course.id} className="group p-5 bg-[#0a0c14]/50 rounded-2xl border border-indigo-900/20 relative">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-bold text-indigo-100">{course.title}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-indigo-400">{currentReg}/{course.maxParticipants} 人</span>
                        <button onClick={() => { if (confirm(`確定要刪除「${course.title}」嗎？相關報名資料也會一併刪除。`)) removeCourse(course.id); }} className="text-red-500/0 group-hover:text-red-500/60 hover:!text-red-400 transition-colors p-1" title="刪除場域"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-indigo-950 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 transition-all duration-700" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 報名名單 */}
          <div className="bg-[#121625] rounded-[2.5rem] p-10 border border-indigo-900/40 shadow-2xl min-h-[300px] text-left">
            <h3 className="text-xl font-bold mb-8 text-emerald-400 flex items-center"><Users className="mr-2" /> 靈魂報名名單</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-indigo-900/30 text-[10px] text-indigo-500/60 uppercase tracking-widest font-bold">
                  <tr><th className="pb-4 px-2">課程</th><th className="pb-4">連結者</th><th className="pb-4 text-center">報名時間</th><th className="pb-4 text-right"></th></tr>
                </thead>
                <tbody className="divide-y divide-indigo-900/10">
                  {registrations.map(reg => (
                    <tr key={reg.id} className="group hover:bg-indigo-900/10 transition-colors">
                      <td className="py-6 px-2"><div className="font-bold text-indigo-100">{reg.courseTitle}</div><div className="text-[10px] text-indigo-500 font-mono">{reg.email}</div></td>
                      <td className="py-6"><div className="text-amber-100 font-medium">{reg.name}</div><div className="text-[10px] text-amber-500/60 font-mono">LINE: {reg.lineId || 'N/A'}</div></td>
                      <td className="py-6 text-center text-[10px] font-mono text-indigo-400">{reg.time}</td>
                      <td className="py-6 text-right"><button onClick={() => removeRegistration(reg.id)} className="text-red-500/20 group-hover:text-red-500 transition-colors p-2"><Trash2 size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

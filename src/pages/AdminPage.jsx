import React, { useEffect, useState } from 'react';
import {
  Bell,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Users,
  Zap
} from 'lucide-react';
import { doc, onSnapshot, serverTimestamp, setDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../contexts/CourseContext';
import { syncAllCoursesToCalendar } from '../utils/calendar';

const EMPTY_COURSE = {
  title: '',
  date: '',
  start: '',
  end: '',
  desc: '',
  category: '一般',
  maxParticipants: 10
};

const DEFAULT_NOTIFICATION_SETTINGS = {
  adminRegistrationEmailEnabled: false,
  adminNotificationEmails: (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
};

export default function AdminPage() {
  const { user, accessToken, loginWithGoogle, logout } = useAuth();
  const { courses, addCourse, removeCourse, removeRegistration, getRegCount } = useCourses();
  const [registrations, setRegistrations] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [newCourse, setNewCourse] = useState(EMPTY_COURSE);
  const [notificationSettings, setNotificationSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS);
  const [notificationEmailInput, setNotificationEmailInput] = useState('');

  useEffect(() => {
    if (!db) return undefined;

    const unsubRegistrations = onSnapshot(collection(db, 'registrations'), (snap) => {
      const items = snap.docs.map((item) => ({ id: item.id, ...item.data() }));
      items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setRegistrations(items);
    });

    const settingsRef = doc(db, 'appSettings', 'notifications');
    const unsubSettings = onSnapshot(settingsRef, (snap) => {
      const nextSettings = snap.exists()
        ? { ...DEFAULT_NOTIFICATION_SETTINGS, ...snap.data() }
        : DEFAULT_NOTIFICATION_SETTINGS;

      setNotificationSettings(nextSettings);
      setNotificationEmailInput((nextSettings.adminNotificationEmails || []).join(', '));
    });

    return () => {
      unsubRegistrations();
      unsubSettings();
    };
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (isSavingCourse) return;

    try {
      setIsSavingCourse(true);
      await addCourse({
        ...newCourse,
        maxParticipants: Number(newCourse.maxParticipants) || 1,
        createdAt: serverTimestamp()
      });
      setNewCourse(EMPTY_COURSE);
    } catch (err) {
      console.error('add course failed:', err);
      alert(`新增場域失敗：${err.message}`);
    } finally {
      setIsSavingCourse(false);
    }
  };

  const handleCalendarSync = async () => {
    setIsSyncing(true);
    try {
      let token = accessToken;
      if (!token) {
        await loginWithGoogle(['https://www.googleapis.com/auth/calendar.events']);
        alert('已要求 Google 日曆授權，請再次按下同步按鈕完成同步。');
        return;
      }

      if (courses.length === 0) {
        alert('目前沒有任何場域可同步。');
        return;
      }

      const results = await syncAllCoursesToCalendar(token, courses);
      if (results.failed > 0) {
        alert(`同步完成：成功 ${results.success} 筆，失敗 ${results.failed} 筆。\n\n${results.errors.join('\n')}`);
      } else {
        alert(`同步成功，已將 ${results.success} 個場域加入 Google 日曆。`);
      }
    } catch (err) {
      alert(`同步失敗：${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    if (isSavingSettings) return;

    const emails = notificationEmailInput
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    try {
      setIsSavingSettings(true);
      await setDoc(
        doc(db, 'appSettings', 'notifications'),
        {
          adminRegistrationEmailEnabled: notificationSettings.adminRegistrationEmailEnabled,
          adminNotificationEmails: emails,
          updatedAt: serverTimestamp(),
          updatedBy: user?.email || null
        },
        { merge: true }
      );
      alert('通知設定已儲存。');
    } catch (err) {
      console.error('save notification settings failed:', err);
      alert(`儲存通知設定失敗：${err.message}`);
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:space-y-8">
      <div className="rounded-[2rem] border border-indigo-900/40 bg-[#121625] p-5 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center text-xl font-bold tracking-widest text-amber-50 sm:text-2xl">
              <LayoutDashboard className="mr-3 text-indigo-500" />
              管理後台
            </h2>
            <p className="mt-2 text-xs italic uppercase tracking-widest text-indigo-400/60">管理課程、報名、通知與日曆同步</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-900/20 px-4 py-3">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  referrerPolicy="no-referrer"
                  className="h-8 w-8 rounded-full border border-amber-500/40"
                  alt="avatar"
                />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-amber-100">{user?.displayName || '管理員'}</p>
                <p className="truncate text-[10px] text-indigo-400">{user?.email}</p>
              </div>
              <button onClick={logout} className="p-1 text-indigo-500 transition hover:text-red-400" aria-label="登出">
                <LogOut size={16} />
              </button>
            </div>

            <button
              onClick={handleCalendarSync}
              disabled={isSyncing}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold tracking-widest text-white shadow-xl transition-all hover:bg-indigo-500 disabled:opacity-40"
            >
              {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : <CalendarCheck size={18} />}
              <span>同步日曆</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="space-y-6 lg:space-y-8">
          <div className="rounded-[2rem] border border-indigo-900/40 bg-[#121625] p-5 shadow-2xl sm:rounded-[2.5rem] sm:p-8 lg:p-10">
            <h3 className="mb-6 flex items-center text-lg font-bold text-amber-100 sm:mb-8 sm:text-xl">
              <Plus size={20} className="mr-2 text-amber-400" />
              開啟新能量場
            </h3>

            <form onSubmit={handleAddCourse} className="space-y-4 sm:space-y-5">
              <input
                required
                className="w-full rounded-2xl border border-indigo-900/50 bg-[#0a0c14] p-4 text-white outline-none sm:p-5"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                placeholder="場域名稱"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  required
                  type="date"
                  className="w-full rounded-2xl border border-indigo-900/50 bg-[#0a0c14] p-4 text-white outline-none sm:p-5"
                  value={newCourse.date}
                  onChange={(e) => setNewCourse({ ...newCourse, date: e.target.value })}
                />
                <div className="relative">
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full rounded-2xl border border-indigo-900/50 bg-[#0a0c14] p-4 pr-14 text-white outline-none sm:p-5"
                    value={newCourse.maxParticipants}
                    onChange={(e) => setNewCourse({ ...newCourse, maxParticipants: e.target.value })}
                    placeholder="名額"
                  />
                  <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs text-indigo-500">人</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="relative">
                  <label className="absolute left-5 top-1.5 text-[10px] text-indigo-500">開始時間</label>
                  <input
                    required
                    type="time"
                    className="w-full rounded-2xl border border-indigo-900/50 bg-[#0a0c14] px-5 pb-3 pt-7 text-sm text-white outline-none"
                    value={newCourse.start}
                    onChange={(e) => setNewCourse({ ...newCourse, start: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <label className="absolute left-5 top-1.5 text-[10px] text-indigo-500">結束時間</label>
                  <input
                    required
                    type="time"
                    className="w-full rounded-2xl border border-indigo-900/50 bg-[#0a0c14] px-5 pb-3 pt-7 text-sm text-white outline-none"
                    value={newCourse.end}
                    onChange={(e) => setNewCourse({ ...newCourse, end: e.target.value })}
                  />
                </div>
              </div>

              <textarea
                className="h-24 w-full rounded-2xl border border-indigo-900/50 bg-[#0a0c14] p-4 text-white outline-none sm:p-5"
                value={newCourse.desc}
                onChange={(e) => setNewCourse({ ...newCourse, desc: e.target.value })}
                placeholder="場域描述..."
              />

              <button
                disabled={isSavingCourse}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 py-4 font-black tracking-widest text-white shadow-xl disabled:opacity-40 sm:py-5"
              >
                {isSavingCourse ? '發布中...' : '發布場域'}
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-indigo-900/40 bg-[#121625] p-5 shadow-2xl sm:rounded-[2.5rem] sm:p-8 lg:p-10">
            <h3 className="mb-6 flex items-center text-lg font-bold text-amber-100 sm:mb-8 sm:text-xl">
              <Bell size={20} className="mr-2 text-amber-400" />
              報名通知
            </h3>

            <div className="space-y-5">
              <label className="flex items-center justify-between gap-4 rounded-2xl border border-indigo-900/30 bg-[#0a0c14]/60 p-4">
                <div>
                  <p className="text-sm font-bold text-indigo-100">報名後自動寄信通知管理者</p>
                  <p className="mt-1 text-xs text-indigo-400/70">關閉時只寫入報名資料，不發送 Email。</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      adminRegistrationEmailEnabled: !prev.adminRegistrationEmailEnabled
                    }))
                  }
                  className={`relative h-7 w-14 rounded-full transition ${
                    notificationSettings.adminRegistrationEmailEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      notificationSettings.adminRegistrationEmailEnabled ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </label>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-indigo-400">通知收件者</label>
                <textarea
                  value={notificationEmailInput}
                  onChange={(e) => setNotificationEmailInput(e.target.value)}
                  className="h-24 w-full rounded-2xl border border-indigo-900/50 bg-[#0a0c14] p-4 text-white outline-none"
                  placeholder="用逗號分隔多個 Email，例如：a@example.com, b@example.com"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveNotificationSettings}
                disabled={isSavingSettings}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 py-4 font-black tracking-widest text-[#0f111a] shadow-xl disabled:opacity-40"
              >
                <Save size={16} />
                <span>{isSavingSettings ? '儲存中...' : '儲存通知設定'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2 lg:space-y-8">
          <div className="rounded-[2rem] border border-indigo-900/40 bg-[#121625] p-5 text-left shadow-2xl sm:rounded-[2.5rem] sm:p-8 lg:p-10">
            <h3 className="mb-6 flex items-center text-lg font-bold text-amber-100 sm:mb-8 sm:text-xl">
              <Zap className="mr-2 text-amber-400" />
              場域現況概覽
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {courses.map((course) => {
                const currentReg = getRegCount(course.id);
                const percent = course.maxParticipants ? (currentReg / course.maxParticipants) * 100 : 0;
                return (
                  <div key={course.id} className="group relative rounded-2xl border border-indigo-900/20 bg-[#0a0c14]/50 p-5">
                    <div className="mb-2 flex items-start justify-between gap-3 text-xs">
                      <span className="font-bold text-indigo-100">{course.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-indigo-400">
                          {currentReg}/{course.maxParticipants} 人
                        </span>
                        <button
                          onClick={() => {
                            if (confirm(`確定要刪除「${course.title}」嗎？相關報名資料也會一併刪除。`)) {
                              removeCourse(course.id);
                            }
                          }}
                          className="p-1 text-red-500/30 transition-colors group-hover:text-red-500/70 hover:!text-red-400"
                          title="刪除場域"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-indigo-950">
                      <div className="h-full bg-amber-500 transition-all duration-700" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="min-h-[300px] rounded-[2rem] border border-indigo-900/40 bg-[#121625] p-5 text-left shadow-2xl sm:rounded-[2.5rem] sm:p-8 lg:p-10">
            <h3 className="mb-6 flex items-center text-lg font-bold text-emerald-400 sm:mb-8 sm:text-xl">
              <Users className="mr-2" />
              報名名單
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="border-b border-indigo-900/30 text-[10px] font-bold uppercase tracking-widest text-indigo-500/60">
                  <tr>
                    <th className="px-2 pb-4">課程</th>
                    <th className="pb-4">報名者</th>
                    <th className="pb-4 text-center">報名時間</th>
                    <th className="pb-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-900/10">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="group transition-colors hover:bg-indigo-900/10">
                      <td className="px-2 py-6">
                        <div className="font-bold text-indigo-100">{reg.courseTitle}</div>
                        <div className="text-[10px] font-mono text-indigo-500">{reg.email}</div>
                      </td>
                      <td className="py-6">
                        <div className="font-medium text-amber-100">{reg.name}</div>
                        <div className="text-[10px] font-mono text-amber-500/60">LINE: {reg.lineId || 'N/A'}</div>
                      </td>
                      <td className="py-6 text-center text-[10px] font-mono text-indigo-400">{reg.time}</td>
                      <td className="py-6 text-right">
                        <button
                          onClick={() => removeRegistration(reg.id, reg.courseId)}
                          className="p-2 text-red-500/20 transition-colors group-hover:text-red-500 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
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

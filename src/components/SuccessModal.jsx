import React from 'react';
import { CalendarCheck, CheckCircle2, ExternalLink } from 'lucide-react';
import { buildCalendarUrl } from '../utils/calendar';

export default function SuccessModal({ course, onClose }) {
  const calendarUrl = buildCalendarUrl(course);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07080c]/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border-2 border-emerald-500 bg-[#121625] p-6 text-center shadow-[0_0_50px_rgba(16,185,129,0.2)] sm:rounded-[3rem] sm:p-10">
        <div className="pointer-events-none absolute left-[-20%] top-[-20%] h-full w-full rounded-full bg-emerald-500/5 blur-[60px]"></div>

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 size={48} className="text-emerald-500" />
        </div>
        <h3 className="mb-2 text-2xl font-black tracking-[0.25em] text-emerald-500">報名成功</h3>
        <p className="mb-8 text-sm font-light italic leading-relaxed text-indigo-200">
          我們已收到你的預約資料，也建議你把時間加入 Google 日曆，避免錯過場次。
        </p>

        <div className="space-y-4">
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 font-bold text-white transition-all shadow-xl hover:bg-indigo-500"
          >
            <CalendarCheck size={18} />
            <span className="text-sm uppercase tracking-widest">加入 Google 日曆</span>
            <ExternalLink size={14} />
          </a>

          <p className="text-[10px] tracking-widest text-indigo-500/40">若未自動開啟，請允許新分頁或彈出視窗。</p>

          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-transparent py-3 text-xs font-bold uppercase tracking-widest text-indigo-400 transition-colors hover:text-white"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}

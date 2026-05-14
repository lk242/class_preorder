import React from 'react';
import { CheckCircle2, CalendarCheck, ExternalLink } from 'lucide-react';
import { buildCalendarUrl } from '../utils/calendar';

export default function SuccessModal({ course, onClose }) {
  const calendarUrl = buildCalendarUrl(course);

  return (
    <div className="fixed inset-0 bg-[#07080c]/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-[#121625] rounded-[3rem] w-full max-w-sm p-10 border-2 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)] text-center relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} className="text-emerald-500" />
        </div>
        <h3 className="text-2xl font-black text-emerald-500 tracking-widest mb-2">共振成功</h3>
        <p className="text-indigo-200 text-sm mb-8 leading-relaxed font-light uppercase tracking-tighter italic">
          「您的光已被星際辨識，期待與您相遇。」
        </p>

        <div className="space-y-4">
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-indigo-500 transition-all shadow-xl"
          >
            <CalendarCheck size={18} />
            <span className="tracking-widest uppercase text-sm">加入 Google 日曆</span>
            <ExternalLink size={14} />
          </a>

          <p className="text-indigo-500/40 text-[10px] tracking-widest">
            也可稍後在「我的預約」中同步
          </p>

          <button
            onClick={onClose}
            className="w-full py-3 bg-transparent text-indigo-400 rounded-2xl text-xs tracking-widest hover:text-white transition-colors uppercase font-bold"
          >
            關閉並返回
          </button>
        </div>
      </div>
    </div>
  );
}

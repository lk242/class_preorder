import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Moon } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 pb-24 pt-16 text-center sm:pt-20 sm:pb-32">
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-950/30 px-4 py-2">
        <Moon size={14} className="text-amber-300" />
        <span className="text-[10px] uppercase tracking-[0.35em] text-indigo-300">預約你的光語體驗</span>
      </div>

      <h1 className="mb-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-transparent bg-gradient-to-b from-white via-white to-indigo-400 bg-clip-text sm:text-6xl md:text-7xl">
        在合適的時間
        <br />
        預約你的專屬場次
      </h1>

      <p className="mb-10 max-w-2xl text-base font-light italic leading-relaxed text-indigo-200/70 sm:mb-12 sm:text-lg">
        透過簡單清楚的預約流程，快速選擇日期、填寫資料並完成報名，讓每一次相遇都更準時、更順手。
      </p>

      <button
        onClick={() => navigate('/booking')}
        className="group flex items-center rounded-[2rem] bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-base font-black text-[#0f111a] shadow-[0_20px_40px_rgba(245,158,11,0.2)] transition-all hover:scale-105 sm:px-10 sm:py-5 sm:text-lg"
      >
        前往預約
        <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
      </button>
    </section>
  );
}

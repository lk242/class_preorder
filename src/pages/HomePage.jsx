import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">
      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-950/30 border border-indigo-500/20 rounded-full mb-8 animate-bounce">
        <Moon size={14} className="text-amber-300" />
        <span className="text-[10px] tracking-[0.4em] uppercase text-indigo-300">月光、晨露與頻率的對話</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-indigo-400 leading-tight">
        在星際的裂縫中<br />找回你的原始頻率
      </h1>
      <p className="max-w-2xl text-lg text-indigo-200/70 leading-relaxed font-light mb-12 italic">
        「將瑣碎的微光拼湊，直至你學會愛上自己。」
      </p>
      <button
        onClick={() => navigate('/booking')}
        className="px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-[#0f111a] rounded-[2rem] font-black text-lg shadow-[0_20px_40px_rgba(245,158,11,0.2)] hover:scale-105 transition-all flex items-center group"
      >
        進入預約場域 <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </section>
  );
}

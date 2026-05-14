import React from 'react';
import { useCourses } from '../contexts/CourseContext';

export default function CourseCard({ course, onBook }) {
  const { getRegCount } = useCourses();
  const currentReg = getRegCount(course.id);
  const isFull = currentReg >= course.maxParticipants;

  return (
    <div className={`p-8 rounded-[2rem] border transition-all ${isFull ? 'border-slate-800 bg-slate-900/20 opacity-60' : 'border-indigo-800/40 bg-gradient-to-br from-[#1c2237] to-[#121625] hover:border-amber-500/50'}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.3em] bg-amber-400/10 px-3 py-1 rounded">{course.category}</span>
        <div className="text-right">
          <div className={`text-xs font-mono ${isFull ? 'text-red-400' : 'text-indigo-400'}`}>{currentReg} / {course.maxParticipants} 人</div>
        </div>
      </div>
      <h4 className="font-bold text-xl mb-3 text-amber-50">{course.title}</h4>
      <p className="text-indigo-300/80 text-sm mb-8 leading-relaxed font-light">{course.desc}</p>
      <button
        onClick={() => { if (!isFull) onBook(course); }}
        disabled={isFull}
        className={`w-full py-4 rounded-2xl font-black shadow-lg uppercase tracking-widest transition-all ${isFull ? 'bg-slate-800 text-slate-500' : 'bg-gradient-to-r from-amber-500 to-amber-600 text-[#0f111a] active:scale-95'}`}
      >
        {isFull ? '能量場已滿載' : '立即連結'}
      </button>
    </div>
  );
}

import React from 'react';
import { useCourses } from '../contexts/CourseContext';

export default function CourseCard({ course, onBook }) {
  const { getRegCount } = useCourses();
  const currentReg = getRegCount(course.id);
  const isFull = currentReg >= course.maxParticipants;

  return (
    <div
      className={`rounded-[1.75rem] border p-5 transition-all sm:p-8 ${
        isFull
          ? 'border-slate-800 bg-slate-900/20 opacity-60'
          : 'border-indigo-800/40 bg-gradient-to-br from-[#1c2237] to-[#121625] hover:border-amber-500/50'
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <span className="rounded bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400">
          {course.category}
        </span>
        <div className="text-right">
          <div className={`text-xs font-mono ${isFull ? 'text-red-400' : 'text-indigo-400'}`}>
            {currentReg} / {course.maxParticipants} 人
          </div>
        </div>
      </div>

      <h4 className="mb-3 text-lg font-bold text-amber-50 sm:text-xl">{course.title}</h4>
      <p className="mb-6 text-sm font-light leading-relaxed text-indigo-300/80 sm:mb-8">{course.desc}</p>

      <button
        onClick={() => {
          if (!isFull) onBook(course);
        }}
        disabled={isFull}
        className={`w-full rounded-2xl py-4 text-sm font-black tracking-[0.25em] shadow-lg transition-all sm:text-base ${
          isFull
            ? 'bg-slate-800 text-slate-500'
            : 'bg-gradient-to-r from-amber-500 to-amber-600 text-[#0f111a] active:scale-95'
        }`}
      >
        {isFull ? '本場已額滿' : '立即報名'}
      </button>
    </div>
  );
}

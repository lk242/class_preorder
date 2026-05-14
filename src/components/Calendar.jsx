import React from 'react';
import { ChevronLeft, ChevronRight, Moon } from 'lucide-react';
import { useCourses } from '../contexts/CourseContext';

function getDaysInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = [];
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= lastDate; i++) days.push(new Date(year, month, i));
  return days;
}

function formatDate(date) {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function Calendar({ currentMonth, setCurrentMonth, selectedDate, setSelectedDate }) {
  const { courses } = useCourses();
  const days = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="bg-[#121625] rounded-[2.5rem] p-10 shadow-2xl border border-indigo-900/40">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold flex items-center text-amber-50 tracking-[0.2em]">
          <Moon className="mr-3 text-amber-200" size={24} />
          {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
        </h2>
        <div className="flex space-x-3">
          <button onClick={prevMonth} className="p-3 bg-[#1c2237] hover:bg-indigo-800 rounded-full transition text-indigo-300"><ChevronLeft size={20} /></button>
          <button onClick={nextMonth} className="p-3 bg-[#1c2237] hover:bg-indigo-800 rounded-full transition text-indigo-300"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
          <div key={d} className="text-center text-xs font-bold text-indigo-400/40 uppercase tracking-[0.3em] pb-6">{d}</div>
        ))}
        {days.map((date, i) => {
          const dateStr = formatDate(date);
          const hasCourse = courses.some(c => c.date === dateStr);
          const isSelected = selectedDate === dateStr;
          return (
            <div key={i} onClick={() => date && setSelectedDate(dateStr)}
              className={`h-16 md:h-24 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden
                ${!date ? 'opacity-0 cursor-default' : 'border border-indigo-900/20 bg-[#1c2237]/30'}
                ${isSelected ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-white border-amber-400 scale-105 shadow-2xl z-10' : 'hover:border-indigo-500/50 hover:bg-[#1c2237]'}
              `}>
              {date && (
                <>
                  <span className={`text-lg font-light ${isSelected ? 'font-bold' : 'text-indigo-100'}`}>{date.getDate()}</span>
                  {hasCourse && !isSelected && (
                    <div className="absolute bottom-3 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse"></div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

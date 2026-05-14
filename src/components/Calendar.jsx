import React from 'react';
import { ChevronLeft, ChevronRight, Moon } from 'lucide-react';
import { useCourses } from '../contexts/CourseContext';

const WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

function getDaysInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = [];
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i += 1) days.push(null);
  for (let i = 1; i <= lastDate; i += 1) days.push(new Date(year, month, i));

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
    <div className="rounded-[2rem] border border-indigo-900/40 bg-[#121625] p-4 shadow-2xl sm:rounded-[2.5rem] sm:p-6 lg:p-10">
      <div className="mb-6 flex items-center justify-between gap-3 sm:mb-10">
        <h2 className="flex items-center text-lg font-bold tracking-[0.15em] text-amber-50 sm:text-2xl">
          <Moon className="mr-2 text-amber-200 sm:mr-3" size={22} />
          {currentMonth.getFullYear()} 年 {currentMonth.getMonth() + 1} 月
        </h2>
        <div className="flex gap-2 sm:gap-3">
          <button onClick={prevMonth} className="rounded-full bg-[#1c2237] p-2 text-indigo-300 transition hover:bg-indigo-800 sm:p-3">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="rounded-full bg-[#1c2237] p-2 text-indigo-300 transition hover:bg-indigo-800 sm:p-3">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
        {WEEK_LABELS.map((day) => (
          <div key={day} className="pb-2 text-center text-[10px] font-bold tracking-[0.2em] text-indigo-400/50 sm:pb-4 sm:text-xs">
            {day}
          </div>
        ))}

        {days.map((date, i) => {
          const dateStr = formatDate(date);
          const hasCourse = courses.some(c => c.date === dateStr);
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={i}
              type="button"
              onClick={() => date && setSelectedDate(dateStr)}
              disabled={!date}
              className={`relative flex h-12 flex-col items-center justify-center overflow-hidden rounded-xl border text-sm transition-all sm:h-16 sm:rounded-2xl sm:text-base md:h-24 ${
                !date
                  ? 'cursor-default border-transparent bg-transparent opacity-0'
                  : 'border-indigo-900/20 bg-[#1c2237]/30'
              } ${
                isSelected
                  ? 'z-10 scale-105 border-amber-400 bg-gradient-to-b from-amber-500 to-amber-700 text-white shadow-2xl'
                  : 'hover:border-indigo-500/50 hover:bg-[#1c2237]'
              }`}
            >
              {date && (
                <>
                  <span className={`font-light ${isSelected ? 'font-bold' : 'text-indigo-100'}`}>{date.getDate()}</span>
                  {hasCourse && !isSelected && (
                    <div className="absolute bottom-2 h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse sm:bottom-3" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

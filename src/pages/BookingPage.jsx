import React, { useState } from 'react';
import { Sun, Compass } from 'lucide-react';
import Calendar from '../components/Calendar';
import CourseCard from '../components/CourseCard';
import RegModal from '../components/RegModal';
import SuccessModal from '../components/SuccessModal';
import { useCourses } from '../contexts/CourseContext';

export default function BookingPage() {
  const { courses } = useCourses();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [successCourse, setSuccessCourse] = useState(null);

  const filteredCourses = selectedDate
    ? courses.filter(c => c.date === selectedDate)
    : [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Calendar
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-[#121625] rounded-[2.5rem] p-10 shadow-2xl border border-indigo-900/40 min-h-[500px]">
            <h3 className="text-xl font-bold mb-8 text-amber-50 flex items-center border-b border-indigo-900/20 pb-4">
              <Sun className="mr-3 text-amber-400" size={22} />
              {selectedDate ? `${selectedDate} 能量場` : '選擇日期感知'}
            </h3>
            <div className="space-y-6">
              {selectedDate ? (
                filteredCourses.length > 0 ? (
                  filteredCourses.map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onBook={(c) => setSelectedCourse(c)}
                    />
                  ))
                ) : (
                  <div className="text-center py-24 text-indigo-400/40 italic font-light tracking-widest">沈睡的時刻，暫無場域開啟。</div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-indigo-400/20">
                  <Compass size={64} className="mb-6 opacity-10 animate-spin-slow" />
                  <p className="text-center italic font-light tracking-widest text-sm">旋轉靈魂的羅盤<br />找尋與你共鳴的日期</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedCourse && (
        <RegModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onSuccess={(course) => setSuccessCourse(course)}
        />
      )}

      {successCourse && (
        <SuccessModal
          course={successCourse}
          onClose={() => setSuccessCourse(null)}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Compass, Sun } from 'lucide-react';
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

  const filteredCourses = selectedDate ? courses.filter(c => c.date === selectedDate) : [];

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <Calendar
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>

        <div className="space-y-6">
          <div className="min-h-[320px] rounded-[2rem] border border-indigo-900/40 bg-[#121625] p-5 shadow-2xl sm:min-h-[500px] sm:rounded-[2.5rem] sm:p-8 lg:p-10">
            <h3 className="mb-6 flex items-center border-b border-indigo-900/20 pb-4 text-lg font-bold text-amber-50 sm:mb-8 sm:text-xl">
              <Sun className="mr-3 text-amber-400" size={22} />
              {selectedDate ? `${selectedDate} 的可預約場次` : '請先選擇日期'}
            </h3>

            <div className="space-y-5 sm:space-y-6">
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
                  <div className="py-16 text-center text-sm italic tracking-widest text-indigo-400/50 sm:py-24">
                    這一天目前沒有開放場次。
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-indigo-400/30 sm:py-24">
                  <Compass size={56} className="mb-6 opacity-20 animate-spin-slow" />
                  <p className="text-center text-sm italic tracking-widest">
                    先從左側日曆選一天
                    <br />
                    再查看可報名場次
                  </p>
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

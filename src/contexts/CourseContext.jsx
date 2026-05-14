import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { db, isConfigured } from '../config/firebase';

const CourseContext = createContext(null);

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured || !db) { setLoading(false); return; }

    const unsubCourses = onSnapshot(
      collection(db, 'courses'),
      (snap) => {
        setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => { console.error('courses listener:', err); setLoading(false); }
    );

    const unsubRegs = onSnapshot(
      collection(db, 'registrations'),
      (snap) => {
        setRegistrations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      },
      (err) => { console.error('registrations listener:', err); }
    );

    return () => { unsubCourses(); unsubRegs(); };
  }, []);

  const addCourse = async (course) => {
    await addDoc(collection(db, 'courses'), {
      ...course,
      createdAt: serverTimestamp()
    });
  };

  const removeCourse = async (id) => {
    await deleteDoc(doc(db, 'courses', id));
    const related = registrations.filter(r => r.courseId === id);
    await Promise.all(related.map(r => deleteDoc(doc(db, 'registrations', r.id))));
  };

  const addRegistration = async (reg) => {
    await addDoc(collection(db, 'registrations'), {
      ...reg,
      createdAt: serverTimestamp()
    });
  };

  const removeRegistration = async (id) => {
    await deleteDoc(doc(db, 'registrations', id));
  };

  const getRegCount = (courseId) => {
    return registrations.filter(r => r.courseId === courseId).length;
  };

  return (
    <CourseContext.Provider value={{
      courses, registrations, loading,
      addCourse, removeCourse, addRegistration, removeRegistration, getRegCount
    }}>
      {children}
    </CourseContext.Provider>
  );
}

export const useCourses = () => useContext(CourseContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp,
  updateDoc, increment, query, where, getDocs
} from 'firebase/firestore';
import { db, isConfigured } from '../config/firebase';

const CourseContext = createContext(null);

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
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

    return () => { unsubCourses(); };
  }, []);

  const addCourse = async (course) => {
    await addDoc(collection(db, 'courses'), {
      ...course,
      currentParticipants: 0,
      createdAt: serverTimestamp()
    });
  };

  const removeCourse = async (id) => {
    await deleteDoc(doc(db, 'courses', id));
    const regSnap = await getDocs(query(collection(db, 'registrations'), where('courseId', '==', id)));
    await Promise.all(regSnap.docs.map(d => deleteDoc(d.ref)));
  };

  const addRegistration = async (reg) => {
    await addDoc(collection(db, 'registrations'), {
      ...reg,
      createdAt: serverTimestamp()
    });
    await updateDoc(doc(db, 'courses', reg.courseId), {
      currentParticipants: increment(1)
    });
  };

  const removeRegistration = async (id, courseId) => {
    await deleteDoc(doc(db, 'registrations', id));
    if (courseId) {
      await updateDoc(doc(db, 'courses', courseId), {
        currentParticipants: increment(-1)
      });
    }
  };

  const getRegCount = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course?.currentParticipants || 0;
  };

  return (
    <CourseContext.Provider value={{
      courses, loading,
      addCourse, removeCourse, addRegistration, removeRegistration, getRegCount
    }}>
      {children}
    </CourseContext.Provider>
  );
}

export const useCourses = () => useContext(CourseContext);

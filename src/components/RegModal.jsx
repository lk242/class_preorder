import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCourses } from '../contexts/CourseContext';

const PHONE_RE = /^09\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegModal({ course, onClose, onSuccess }) {
  const { addRegistration, getRegCount } = useCourses();
  const [form, setForm] = useState({ name: '', phone: '', email: '', lineId: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (fields = form) => {
    const errs = {};
    if (!fields.name.trim()) errs.name = '請輸入姓名';
    else if (fields.name.trim().length < 2) errs.name = '姓名至少 2 個字';
    if (!fields.phone.trim()) errs.phone = '請輸入電話';
    else if (!PHONE_RE.test(fields.phone.trim())) errs.phone = '請輸入有效手機號碼（09 開頭共 10 碼）';
    if (!fields.email.trim()) errs.email = '請輸入 Email';
    else if (!EMAIL_RE.test(fields.email.trim())) errs.email = '請輸入有效的 Email 格式';
    return errs;
  };

  const handleChange = (field, value) => {
    const next = { ...form, [field]: value };
    setForm(next);
    if (touched[field]) {
      const errs = validate(next);
      setErrors(prev => ({ ...prev, [field]: errs[field] || undefined }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errs = validate();
    setErrors(prev => ({ ...prev, [field]: errs[field] || undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ name: true, phone: true, email: true });
    if (Object.keys(errs).length > 0) return;

    const currentCount = getRegCount(course.id);
    if (currentCount >= course.maxParticipants) {
      alert('能量場已滿載。');
      return;
    }

    addRegistration({
      courseId: course.id,
      courseTitle: course.title,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      lineId: form.lineId.trim(),
      time: new Date().toLocaleString()
    });

    onClose();
    onSuccess(course);
  };

  const inputClass = (field) =>
    `w-full px-6 py-5 bg-[#0a0c14] border rounded-2xl text-white outline-none focus:ring-1 ${
      errors[field] && touched[field]
        ? 'border-red-500/60 focus:ring-red-500'
        : 'border-indigo-900/50 focus:ring-amber-500'
    }`;

  return (
    <div className="fixed inset-0 bg-[#07080c]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#121625] rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-indigo-800/20">
        <div className="bg-gradient-to-br from-indigo-800 to-indigo-950 p-12 text-white relative">
          <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition"><X size={20} /></button>
          <h3 className="text-3xl font-black tracking-widest uppercase">啟動連結</h3>
          <p className="text-indigo-200 mt-3 font-light italic text-sm">{course.title}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-12 space-y-6 bg-[#121625]" noValidate>
          <div className="space-y-4">
            <div>
              <input value={form.name} onChange={e => handleChange('name', e.target.value)} onBlur={() => handleBlur('name')} placeholder="您的靈魂稱謂 (姓名)" className={inputClass('name')} />
              {errors.name && touched.name && <p className="text-red-400 text-xs mt-1.5 ml-2">{errors.name}</p>}
            </div>
            <div>
              <input value={form.phone} onChange={e => handleChange('phone', e.target.value)} onBlur={() => handleBlur('phone')} placeholder="共振頻率 (電話 09xxxxxxxx)" className={inputClass('phone')} />
              {errors.phone && touched.phone && <p className="text-red-400 text-xs mt-1.5 ml-2">{errors.phone}</p>}
            </div>
            <div>
              <input value={form.email} onChange={e => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')} type="email" placeholder="星際郵件 (Email)" className={inputClass('email')} />
              {errors.email && touched.email && <p className="text-red-400 text-xs mt-1.5 ml-2">{errors.email}</p>}
            </div>
            <input value={form.lineId} onChange={e => handleChange('lineId', e.target.value)} placeholder="LINE 通訊 (選填)" className="w-full px-6 py-5 bg-[#0a0c14] border border-indigo-900/50 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500" />
          </div>
          <button type="submit" className="w-full py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-[#0f111a] rounded-[2rem] font-black text-lg uppercase tracking-widest mt-4 shadow-xl active:scale-95 transition-all">確認共振</button>
        </form>
      </div>
    </div>
  );
}

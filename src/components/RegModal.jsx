import React, { useState } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import { useCourses } from '../contexts/CourseContext';

const PHONE_RE = /^09\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegModal({ course, onClose, onSuccess }) {
  const { addRegistration, getRegCount } = useCourses();
  const [form, setForm] = useState({ name: '', phone: '', email: '', lineId: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (fields = form) => {
    const errs = {};

    if (!fields.name.trim()) errs.name = '請輸入姓名。';
    else if (fields.name.trim().length < 2) errs.name = '姓名至少需要 2 個字。';

    if (!fields.phone.trim()) errs.phone = '請輸入手機號碼。';
    else if (!PHONE_RE.test(fields.phone.trim())) errs.phone = '請輸入正確的台灣手機號碼，例如 09xxxxxxxx。';

    if (!fields.email.trim()) errs.email = '請輸入 Email。';
    else if (!EMAIL_RE.test(fields.email.trim())) errs.email = '請輸入正確的 Email 格式。';

    return errs;
  };

  const handleChange = (field, value) => {
    const next = { ...form, [field]: value };
    setForm(next);
    setSubmitError('');

    if (touched[field]) {
      const nextErrors = validate(next);
      setErrors(prev => ({ ...prev, [field]: nextErrors[field] || undefined }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const nextErrors = validate();
    setErrors(prev => ({ ...prev, [field]: nextErrors[field] || undefined }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    setTouched({ name: true, phone: true, email: true });
    setSubmitError('');

    if (Object.keys(nextErrors).length > 0) return;

    const currentCount = getRegCount(course.id);
    if (currentCount >= course.maxParticipants) {
      setSubmitError('這個場次已額滿，請改選其他日期或時段。');
      return;
    }

    try {
      setIsSubmitting(true);
      await addRegistration({
        courseId: course.id,
        courseTitle: course.title,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        lineId: form.lineId.trim(),
        time: new Date().toLocaleString('zh-TW')
      });

      onClose();
      onSuccess(course);
    } catch (err) {
      console.error('registration failed:', err);
      setSubmitError('報名送出失敗，請稍後再試一次。若持續失敗，請檢查 Firebase 或 Firestore 規則設定。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-2xl border bg-[#0a0c14] px-4 py-4 text-sm text-white outline-none transition focus:ring-1 sm:px-6 sm:py-5 ${
      errors[field] && touched[field]
        ? 'border-red-500/60 focus:ring-red-500'
        : 'border-indigo-900/50 focus:ring-amber-500'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07080c]/80 p-4 backdrop-blur-md">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[2rem] border border-indigo-800/20 bg-[#121625] shadow-2xl sm:rounded-[3rem]">
        <div className="relative bg-gradient-to-br from-indigo-800 to-indigo-950 px-6 py-8 text-white sm:px-10 sm:py-10">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 transition hover:bg-white/10"
            aria-label="關閉"
          >
            <X size={20} />
          </button>
          <h3 className="pr-10 text-2xl font-black tracking-[0.25em] text-amber-50 sm:text-3xl">預約報名</h3>
          <p className="mt-3 text-sm font-light italic text-indigo-100/90">{course.title}</p>
          <p className="mt-2 text-xs tracking-wider text-indigo-200/70">
            {course.date} {course.start} - {course.end}
          </p>
        </div>

        <div className="space-y-5 p-6 sm:p-10">
          <div className="space-y-4">
            <div>
              <input
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="姓名"
                className={inputClass('name')}
              />
              {errors.name && touched.name && <p className="ml-2 mt-1.5 text-xs text-red-400">{errors.name}</p>}
            </div>

            <div>
              <input
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                inputMode="numeric"
                placeholder="手機號碼，例如 09xxxxxxxx"
                className={inputClass('phone')}
              />
              {errors.phone && touched.phone && <p className="ml-2 mt-1.5 text-xs text-red-400">{errors.phone}</p>}
            </div>

            <div>
              <input
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                type="email"
                placeholder="Email"
                className={inputClass('email')}
              />
              {errors.email && touched.email && <p className="ml-2 mt-1.5 text-xs text-red-400">{errors.email}</p>}
            </div>

            <input
              value={form.lineId}
              onChange={e => handleChange('lineId', e.target.value)}
              placeholder="LINE ID（選填）"
              className="w-full rounded-2xl border border-indigo-900/50 bg-[#0a0c14] px-4 py-4 text-sm text-white outline-none transition focus:ring-1 focus:ring-amber-500 sm:px-6 sm:py-5"
            />
          </div>

          {submitError && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{submitError}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-[1.5rem] bg-gradient-to-r from-amber-500 to-amber-600 py-4 text-base font-black tracking-[0.25em] text-[#0f111a] shadow-xl transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <LoaderCircle size={18} className="animate-spin" />}
            <span>{isSubmitting ? '送出中' : '確認報名'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

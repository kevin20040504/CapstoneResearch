import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { staffApi } from '../lib/api/staffApi';

const defaultForm = {
  student_number: '',
  first_name: '',
  last_name: '',
  date_of_birth: '',
  email: '',
  contact_number: '',
  address: '',
  enrollment_date: '',
  graduation_date: '',
  GPA: '',
};

const TOTAL_PHASES = 3;

const formatDateForInput = (val) => {
  if (!val) return '';
  const d = typeof val === 'string' ? new Date(val) : val;
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};

const StaffEditStudentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const studentFromState = location.state?.student;
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [currentPhase, setCurrentPhase] = useState(1);

  useEffect(() => {
    const applyStudent = (s) => {
      if (!s) return;
      const parts = s.name ? s.name.split(' ') : [];
      setForm({
        student_number: s.student_number ?? s.student_id ?? '',
        first_name: s.first_name ?? parts[0] ?? '',
        last_name: s.last_name ?? parts.slice(1).join(' ') ?? '',
        date_of_birth: formatDateForInput(s.date_of_birth),
        email: s.email ?? '',
        contact_number: s.contact_number ?? '',
        address: s.address ?? '',
        enrollment_date: formatDateForInput(s.enrollment_date) || new Date().toISOString().slice(0, 10),
        graduation_date: formatDateForInput(s.graduation_date),
        GPA: s.GPA != null ? String(s.GPA) : '',
      });
    };

    if (studentFromState) {
      applyStudent(studentFromState);
      setFetchLoading(false);
      return;
    }

    if (!id) {
      setFetchLoading(false);
      return;
    }

    setFetchLoading(true);
    staffApi
      .getStudentById(id)
      .then((res) => {
        const s = res?.student ?? res;
        applyStudent(s);
      })
      .catch(() => setSubmitStatus('Failed to load student. Please try again.'))
      .finally(() => setFetchLoading(false));
  }, [id, studentFromState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    if (submitStatus) setSubmitStatus(null);
  };

  const validatePhase = (phase) => {
    const err = {};
    if (phase === 1) {
      if (!form.student_number?.trim()) err.student_number = 'Student number is required.';
      if (!form.first_name?.trim()) err.first_name = 'First name is required.';
      if (!form.last_name?.trim()) err.last_name = 'Last name is required.';
      if (!form.date_of_birth) err.date_of_birth = 'Date of birth is required.';
    }
    if (phase === 2) {
      if (!form.email?.trim()) err.email = 'Email is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Enter a valid email.';
    }
    if (phase === 3) {
      if (!form.enrollment_date) err.enrollment_date = 'Enrollment date is required.';
      if (form.GPA !== '' && (isNaN(parseFloat(form.GPA)) || parseFloat(form.GPA) < 0 || parseFloat(form.GPA) > 5)) {
        err.GPA = 'GPA must be between 0 and 5.00.';
      }
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validate = () => {
    const err = {};
    if (!form.student_number?.trim()) err.student_number = 'Student number is required.';
    if (!form.first_name?.trim()) err.first_name = 'First name is required.';
    if (!form.last_name?.trim()) err.last_name = 'Last name is required.';
    if (!form.date_of_birth) err.date_of_birth = 'Date of birth is required.';
    if (!form.email?.trim()) err.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Enter a valid email.';
    if (!form.enrollment_date) err.enrollment_date = 'Enrollment date is required.';
    if (form.GPA !== '' && (isNaN(parseFloat(form.GPA)) || parseFloat(form.GPA) < 0 || parseFloat(form.GPA) > 5)) {
      err.GPA = 'GPA must be between 0 and 5.00.';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const goToPhase = (phase) => {
    if (phase < currentPhase || validatePhase(phase)) {
      setCurrentPhase(phase);
      if (phase < currentPhase) setErrors({});
    }
  };

  const goNext = () => {
    if (!validatePhase(currentPhase)) return;
    setCurrentPhase((p) => Math.min(p + 1, TOTAL_PHASES));
  };

  const goPrev = () => {
    setCurrentPhase((p) => Math.max(p - 1, 1));
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    if (!validate()) return;

    setLoading(true);
    const updateId = id ?? studentFromState?.student_id ?? studentFromState?.id;
    if (!updateId) {
      setSubmitStatus('Cannot update: student ID is missing.');
      setLoading(false);
      return;
    }

    try {
      await staffApi.updateStudent(updateId, {
        student_number: form.student_number.trim(),
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        date_of_birth: form.date_of_birth,
        email: form.email.trim(),
        contact_number: form.contact_number?.trim() || null,
        address: form.address?.trim() || null,
        enrollment_date: form.enrollment_date,
        graduation_date: form.graduation_date || null,
        GPA: form.GPA !== '' ? parseFloat(form.GPA) : null,
      });
      setSubmitStatus('success');
      setTimeout(() => navigate('/staff/students'), 1500);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : 'Failed to update student.';
      setSubmitStatus(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'py-2.5 px-4 rounded-lg text-base border transition-colors focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc';
  const inputError = 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/20';
  const inputNormal = 'border-gray-300';

  if (fetchLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-2 border-tmcc border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-sm text-gray-600">Loading student...</p>
      </div>
    );
  }

  return (
    <>
      <Link to="/staff/students" className="inline-flex items-center gap-2 mb-6 text-tmcc text-sm font-medium no-underline hover:text-tmcc-dark hover:underline">
        <FiArrowLeft /> Back to Student Records
      </Link>

      <section className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="mt-0 mb-2 text-xl font-bold text-gray-800">Edit Student</h3>
          <p className="m-0 text-gray-600 text-sm">
            Update student information. All fields marked with * are required. Changes are saved to the student records database per ASRMS thesis requirements.
          </p>
        </div>

        <div className="p-6">
          {submitStatus === 'success' && (
            <div className="py-3 px-4 rounded-lg mb-4 bg-green-100 text-green-800 border border-green-200 text-sm" role="status">
              <p className="m-0 font-medium">Student updated successfully. Redirecting to Student Records...</p>
            </div>
          )}
          {submitStatus && submitStatus !== 'success' && (
            <div className="py-3 px-4 rounded-lg mb-4 bg-red-100 text-red-800 border border-red-200 text-sm" role="alert">
              {submitStatus}
            </div>
          )}

          {/* Phase stepper — clickable to switch phases */}
          <div className="flex items-center justify-center gap-0 py-4 mb-6 bg-gray-50 rounded-lg" aria-label="Form phases">
            {[1, 2, 3].map((phase) => (
              <div key={phase} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPhase(phase)}
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-tmcc/50 ${
                    currentPhase === phase || currentPhase > phase ? 'bg-tmcc text-white hover:bg-tmcc-dark' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  aria-pressed={currentPhase === phase}
                  aria-label={`Phase ${phase}`}
                >
                  {phase}
                </button>
                <button
                  type="button"
                  onClick={() => goToPhase(phase)}
                  className={`text-sm mr-2 focus:outline-none focus:ring-2 focus:ring-tmcc/30 rounded px-1 ${currentPhase === phase ? 'text-tmcc font-semibold' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Phase {phase}
                </button>
                {phase < 3 && <span className={`w-10 h-0.5 mx-1 ${currentPhase > phase ? 'bg-tmcc' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="max-w-[720px]">
            {currentPhase === 1 && (
              <div className="mb-8 p-6 bg-white rounded-xl border-l-4 border-tmcc shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100">
                <h4 className="flex items-center gap-3 m-0 mb-5 pb-3 text-base font-semibold text-gray-800 border-b-2 border-gray-200">
                  <span className="inline-flex items-center justify-center min-w-[4.5rem] py-1.5 px-3 bg-tmcc text-white text-sm font-bold rounded-md tracking-wide">Phase 1</span>
                  Personal Information
                </h4>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="student_number" className="text-sm font-medium text-gray-600">Student Number *</label>
                    <input id="student_number" name="student_number" type="text" value={form.student_number} onChange={handleChange} placeholder="e.g. STU-2025-001" maxLength={20} className={`${inputBase} ${errors.student_number ? inputError : inputNormal}`} aria-invalid={!!errors.student_number} />
                    {errors.student_number && <span className="text-xs text-red-600">{errors.student_number}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="date_of_birth" className="text-sm font-medium text-gray-600">Date of Birth *</label>
                    <input id="date_of_birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} className={`${inputBase} ${errors.date_of_birth ? inputError : inputNormal}`} aria-invalid={!!errors.date_of_birth} />
                    {errors.date_of_birth && <span className="text-xs text-red-600">{errors.date_of_birth}</span>}
                  </div>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="first_name" className="text-sm font-medium text-gray-600">First Name *</label>
                    <input id="first_name" name="first_name" type="text" value={form.first_name} onChange={handleChange} placeholder="Given name" maxLength={50} className={`${inputBase} ${errors.first_name ? inputError : inputNormal}`} aria-invalid={!!errors.first_name} />
                    {errors.first_name && <span className="text-xs text-red-600">{errors.first_name}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="last_name" className="text-sm font-medium text-gray-600">Last Name *</label>
                    <input id="last_name" name="last_name" type="text" value={form.last_name} onChange={handleChange} placeholder="Family name" maxLength={50} className={`${inputBase} ${errors.last_name ? inputError : inputNormal}`} aria-invalid={!!errors.last_name} />
                    {errors.last_name && <span className="text-xs text-red-600">{errors.last_name}</span>}
                  </div>
                </div>
              </div>
            )}

            {currentPhase === 2 && (
              <div className="mb-8 p-6 bg-white rounded-xl border-l-4 border-tmcc shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100">
                <h4 className="flex items-center gap-3 m-0 mb-5 pb-3 text-base font-semibold text-gray-800 border-b-2 border-gray-200">
                  <span className="inline-flex items-center justify-center min-w-[4.5rem] py-1.5 px-3 bg-tmcc text-white text-sm font-bold rounded-md tracking-wide">Phase 2</span>
                  Contact Information
                </h4>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-gray-600">Email *</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@tmcc.edu.ph" maxLength={100} className={`${inputBase} ${errors.email ? inputError : inputNormal}`} aria-invalid={!!errors.email} />
                    {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact_number" className="text-sm font-medium text-gray-600">Contact Number</label>
                    <input id="contact_number" name="contact_number" type="tel" value={form.contact_number} onChange={handleChange} placeholder="09XXXXXXXXX" maxLength={15} className={`${inputBase} ${inputNormal}`} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="address" className="text-sm font-medium text-gray-600">Address</label>
                  <input id="address" name="address" type="text" value={form.address} onChange={handleChange} placeholder="Street, Barangay, City" maxLength={150} className={`${inputBase} ${inputNormal}`} />
                </div>
              </div>
            )}

            {currentPhase === 3 && (
              <div className="mb-8 p-6 bg-white rounded-xl border-l-4 border-tmcc shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100">
                <h4 className="flex items-center gap-3 m-0 mb-5 pb-3 text-base font-semibold text-gray-800 border-b-2 border-gray-200">
                  <span className="inline-flex items-center justify-center min-w-[4.5rem] py-1.5 px-3 bg-tmcc text-white text-sm font-bold rounded-md tracking-wide">Phase 3</span>
                  Enrollment Information
                </h4>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="enrollment_date" className="text-sm font-medium text-gray-600">Enrollment Date *</label>
                    <input id="enrollment_date" name="enrollment_date" type="date" value={form.enrollment_date} onChange={handleChange} className={`${inputBase} ${errors.enrollment_date ? inputError : inputNormal}`} aria-invalid={!!errors.enrollment_date} />
                    {errors.enrollment_date && <span className="text-xs text-red-600">{errors.enrollment_date}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="graduation_date" className="text-sm font-medium text-gray-600">Graduation Date</label>
                    <input id="graduation_date" name="graduation_date" type="date" value={form.graduation_date} onChange={handleChange} className={`${inputBase} ${inputNormal}`} />
                  </div>
                  <div className="flex flex-col gap-1.5 max-w-[120px]">
                    <label htmlFor="GPA" className="text-sm font-medium text-gray-600">GPA</label>
                    <input id="GPA" name="GPA" type="number" step="0.01" min="0" max="5" value={form.GPA} onChange={handleChange} placeholder="0.00–5.00" className={`${inputBase} ${errors.GPA ? inputError : inputNormal}`} aria-invalid={!!errors.GPA} />
                    {errors.GPA && <span className="text-xs text-red-600">{errors.GPA}</span>}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6 pt-4 border-t border-gray-200">
              {currentPhase > 1 && (
                <button type="button" className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg text-base font-medium bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-70 disabled:cursor-not-allowed" onClick={goPrev} disabled={loading}>
                  <FiArrowLeft /> Previous
                </button>
              )}
              {currentPhase < TOTAL_PHASES ? (
                <button type="button" className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg text-base font-medium bg-tmcc text-white hover:bg-tmcc-dark" onClick={goNext}>
                  Next <FiArrowRight />
                </button>
              ) : (
                <>
                  <button type="submit" className="py-2.5 px-5 rounded-lg text-base font-medium bg-tmcc text-white hover:bg-tmcc-dark disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <Link to="/staff/students" className="py-2.5 px-5 rounded-lg text-base font-medium bg-gray-600 text-white hover:bg-gray-700 no-underline inline-block" onClick={(e) => loading && e.preventDefault()}>
                    Cancel
                  </Link>
                </>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default StaffEditStudentPage;

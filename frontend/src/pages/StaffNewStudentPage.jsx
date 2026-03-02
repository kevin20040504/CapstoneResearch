import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';
import { staffToast } from '../lib/notifications';
import Modal from '../components/ui/Modal';

const defaultForm = {
  student_number: '',
  first_name: '',
  last_name: '',
  date_of_birth: '',
  email: '',
  contact_number: '',
  address: '',
  enrollment_date: new Date().toISOString().slice(0, 10),
  graduation_date: '',
  GPA: '',
};

const TOTAL_PHASES = 3;

const StaffNewStudentPage = ({ basePath = '/staff' }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [createdAccount, setCreatedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);

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
    setCreatedAccount(null);
    if (!validate()) return;

    setLoading(true);
    // UI only — backend connection disabled for now
    await new Promise((r) => setTimeout(r, 500));
    setSubmitStatus('success');
    setCreatedAccount({
      username: form.student_number.trim(),
      password: 'password123',
    });
    setForm(defaultForm);
    setErrors({});
    setCurrentPhase(1);
    setLoading(false);
    staffToast.success('Student created', `Account ${form.student_number.trim()} has been registered.`);
  };

  const clearForm = () => {
    setForm(defaultForm);
    setErrors({});
    setSubmitStatus(null);
    setCreatedAccount(null);
    setCurrentPhase(1);
  };

  const closeSuccessModal = () => {
    setCreatedAccount(null);
    setSubmitStatus(null);
  };

  const inputBase = 'py-2.5 px-4 rounded-lg text-base border transition-colors focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc';
  const inputError = 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/20';
  const inputNormal = 'border-gray-300';

  return (
    <>
      <Link to={`${basePath}/students`} className="inline-flex items-center gap-2 mb-6 text-tmcc text-sm font-medium no-underline hover:text-tmcc-dark hover:underline">
        <FiArrowLeft /> Back to Student Records
      </Link>

      <section className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="mt-0 mb-2 text-xl font-bold text-gray-800">Add New Student</h3>
          <p className="m-0 text-gray-600 text-sm">
            Register a new student account. All fields marked with * are required. Data is saved to the student records database per ASRMS thesis requirements.
          </p>
        </div>

        <div className="p-6">
          {submitStatus === 'success' && (
            <div className="py-3 px-4 rounded-lg mb-4 bg-green-100 text-green-800 border border-green-200 text-sm" role="status">
              <p className="m-0 mb-2 font-medium">Student and account created successfully. You can add another below.</p>
              {createdAccount && (
                <p className="m-0 text-xs">
                  Account: <strong>Username</strong> {createdAccount.username} · <strong>Password</strong> {createdAccount.password}
                </p>
              )}
            </div>
          )}
          {submitStatus && submitStatus !== 'success' && (
            <div className="py-3 px-4 rounded-lg mb-4 bg-red-100 text-red-800 border border-red-200 text-sm" role="alert">
              {submitStatus}
            </div>
          )}

          {/* Phase stepper */}
          <div className="flex items-center justify-center gap-0 py-4 mb-6 bg-gray-50 rounded-lg" aria-label="Form phases">
            {[1, 2, 3].map((phase) => (
              <div key={phase} className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                    currentPhase === phase || currentPhase > phase ? 'bg-tmcc text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {phase}
                </span>
                <span className={`text-sm mr-2 ${currentPhase === phase ? 'text-tmcc font-semibold' : 'text-gray-600'}`}>
                  Phase {phase}
                </span>
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
              <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
                <h5 className="m-0 mb-3 text-sm font-semibold text-amber-900">Account for Student</h5>
                <p className="m-0 mb-2 text-sm text-amber-800">A login account will be created automatically:</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span><strong>Username:</strong> <code className="px-1.5 py-0.5 rounded bg-amber-100 font-mono">{form.student_number || '(student number from Phase 1)'}</code></span>
                  <span><strong>Password:</strong> <code className="px-1.5 py-0.5 rounded bg-amber-100 font-mono">password123</code> <span className="text-amber-700">(mock, auto-generated later)</span></span>
                </div>
              </div>
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
                  {loading ? 'Saving...' : 'Add Student'}
                </button>
                <button type="button" className="py-2.5 px-5 rounded-lg text-base font-medium bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-70 disabled:cursor-not-allowed" onClick={clearForm} disabled={loading}>
                  Clear Form
                </button>
              </>
            )}
          </div>
        </form>
        </div>
      </section>

      <Modal isOpen={!!createdAccount} onClose={closeSuccessModal} title="Student created" titleId="create-success-title" maxWidth="max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 mb-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white">
              <FiCheck className="w-5 h-5" />
            </span>
            <p className="m-0 text-sm text-green-800 font-medium">Student and login account have been created successfully.</p>
          </div>
          {createdAccount && (
            <div className="mb-4 p-4 rounded-lg bg-gray-50 border border-gray-200 text-sm">
              <p className="m-0 mb-2 font-medium text-gray-700">Credentials (share securely):</p>
              <p className="m-0"><strong>Username:</strong> <code className="px-1.5 py-0.5 rounded bg-gray-200 font-mono">{createdAccount.username}</code></p>
              <p className="m-0 mt-1"><strong>Password:</strong> <code className="px-1.5 py-0.5 rounded bg-gray-200 font-mono">{createdAccount.password}</code></p>
            </div>
          )}
          <div className="flex flex-wrap gap-3 justify-end">
            <button type="button" onClick={() => { closeSuccessModal(); clearForm(); }} className="py-2.5 px-5 rounded-lg text-sm font-medium bg-tmcc text-white hover:bg-tmcc-dark focus:ring-2 focus:ring-tmcc/30">
              Add another
            </button>
            <button type="button" onClick={() => { closeSuccessModal(); navigate(`${basePath}/students`); }} className="py-2.5 px-5 rounded-lg text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500/30">
              Go to Student Records
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StaffNewStudentPage;

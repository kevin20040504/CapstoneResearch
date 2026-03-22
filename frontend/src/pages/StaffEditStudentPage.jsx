import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { staffApi } from '../lib/api/staffApi';
import { staffToast } from '../lib/notifications';
import { queryKeys } from '../lib/react-query/queryKeys';

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

const TOTAL_PHASES = 4;

const SEMESTER_OPTIONS = ['1st', '2nd', 'Summer'];
const ENROLLMENT_STATUS_OPTIONS = ['enrolled', 'completed', 'dropped'];

const formatDateForInput = (val) => {
  if (!val) return '';
  const d = typeof val === 'string' ? new Date(val) : val;
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};

const StaffEditStudentPage = ({ basePath = '/staff' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const studentFromState = location.state?.student;
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [studentDetail, setStudentDetail] = useState({ enrollments: [], grades: [] });
  const [subjects, setSubjects] = useState([]);
  const [enrollmentForm, setEnrollmentForm] = useState({ subject_id: '', academic_year: '', semester: '1st', status: 'enrolled' });
  const [gradeForm, setGradeForm] = useState({ subject_id: '', academic_year: '', semester: '1st', grade_value: '', remarks: '' });
  const [editingEnrollmentId, setEditingEnrollmentId] = useState(null);
  const [editingGradeId, setEditingGradeId] = useState(null);
  const [enrollmentErrors, setEnrollmentErrors] = useState({});
  const [gradeErrors, setGradeErrors] = useState({});

  const refreshStudentDetail = (studentId) => {
    if (!studentId) return;
    staffApi.getStudentById(studentId).then((res) => {
      const s = res?.student ?? res;
      if (s) {
        setStudentDetail({
          enrollments: s.enrollments || [],
          grades: s.grades || [],
        });
      }
    }).catch(() => {});
  };

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
      setStudentDetail({
        enrollments: s.enrollments || [],
        grades: s.grades || [],
      });
    };

    if (!id) {
      if (studentFromState) applyStudent(studentFromState);
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

  useEffect(() => {
    staffApi.getSubjects().then((res) => setSubjects(res?.subjects || [])).catch(() => setSubjects([]));
  }, []);

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

  const studentId = id ?? studentFromState?.student_id ?? studentFromState?.id;

  const handleAddEnrollment = async (e) => {
    e.preventDefault();
    setEnrollmentErrors({});
    if (!enrollmentForm.subject_id || !enrollmentForm.academic_year?.trim() || !enrollmentForm.semester?.trim()) {
      setEnrollmentErrors({
        subject_id: !enrollmentForm.subject_id ? 'Subject is required.' : null,
        academic_year: !enrollmentForm.academic_year?.trim() ? 'Academic year is required.' : null,
        semester: !enrollmentForm.semester?.trim() ? 'Semester is required.' : null,
      });
      return;
    }
    if (!studentId) return;
    try {
      await staffApi.createEnrollment(studentId, {
        subject_id: Number(enrollmentForm.subject_id),
        academic_year: enrollmentForm.academic_year.trim(),
        semester: enrollmentForm.semester.trim(),
        status: enrollmentForm.status || 'enrolled',
      });
      staffToast.success('Enrollment added', 'Subject enrollment recorded.');
      setEnrollmentForm({ subject_id: '', academic_year: '', semester: '1st', status: 'enrolled' });
      refreshStudentDetail(studentId);
    } catch (err) {
      const data = err?.response?.data;
      const errList = data?.errors || {};
      setEnrollmentErrors(Object.fromEntries(Object.entries(errList).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])));
      staffToast.error('Enrollment failed', data?.message || 'Could not add enrollment.');
    }
  };

  const handleUpdateEnrollment = async (e) => {
    e.preventDefault();
    if (editingEnrollmentId == null || !studentId) return;
    setEnrollmentErrors({});
    const enr = studentDetail.enrollments.find((e) => e.id === editingEnrollmentId);
    if (!enr) return;
    const payload = { status: enrollmentForm.status || 'enrolled' };
    try {
      await staffApi.updateEnrollment(studentId, editingEnrollmentId, payload);
      staffToast.success('Enrollment updated', 'Status updated.');
      setEditingEnrollmentId(null);
      setEnrollmentForm({ subject_id: '', academic_year: '', semester: '1st', status: 'enrolled' });
      refreshStudentDetail(studentId);
    } catch (err) {
      staffToast.error('Update failed', err?.response?.data?.message || 'Could not update enrollment.');
    }
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    if (!studentId || !window.confirm('Remove this enrollment?')) return;
    try {
      await staffApi.deleteEnrollment(studentId, enrollmentId);
      staffToast.success('Enrollment removed', '');
      refreshStudentDetail(studentId);
    } catch (err) {
      staffToast.error('Delete failed', err?.response?.data?.message || 'Could not remove enrollment.');
    }
  };

  const startEditEnrollment = (enrollment) => {
    setEditingEnrollmentId(enrollment.id);
    setEnrollmentForm({
      subject_id: enrollment.subject_id,
      academic_year: enrollment.academic_year,
      semester: enrollment.semester,
      status: enrollment.status || 'enrolled',
    });
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    setGradeErrors({});
    if (!gradeForm.subject_id || !gradeForm.academic_year?.trim() || !gradeForm.semester?.trim()) {
      setGradeErrors({
        subject_id: !gradeForm.subject_id ? 'Subject is required.' : null,
        academic_year: !gradeForm.academic_year?.trim() ? 'Academic year is required.' : null,
        semester: !gradeForm.semester?.trim() ? 'Semester is required.' : null,
      });
      return;
    }
    const gv = gradeForm.grade_value !== '' && gradeForm.grade_value != null ? parseFloat(gradeForm.grade_value) : null;
    if (gv != null && (isNaN(gv) || gv < 0 || gv > 5)) {
      setGradeErrors({ grade_value: 'Grade must be between 0 and 5.00.' });
      return;
    }
    if (!studentId) return;
    try {
      await staffApi.createGrade(studentId, {
        subject_id: Number(gradeForm.subject_id),
        academic_year: gradeForm.academic_year.trim(),
        semester: gradeForm.semester.trim(),
        grade_value: gv,
        remarks: gradeForm.remarks?.trim() || null,
      });
      staffToast.success('Grade added', 'Grade recorded.');
      setGradeForm({ subject_id: '', academic_year: '', semester: '1st', grade_value: '', remarks: '' });
      refreshStudentDetail(studentId);
    } catch (err) {
      const data = err?.response?.data;
      const errList = data?.errors || {};
      setGradeErrors(Object.fromEntries(Object.entries(errList).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])));
      staffToast.error('Grade failed', data?.message || 'Could not add grade.');
    }
  };

  const handleUpdateGrade = async (e) => {
    e.preventDefault();
    if (editingGradeId == null || !studentId) return;
    setGradeErrors({});
    const gv = gradeForm.grade_value !== '' && gradeForm.grade_value != null ? parseFloat(gradeForm.grade_value) : null;
    if (gv != null && (isNaN(gv) || gv < 0 || gv > 5)) {
      setGradeErrors({ grade_value: 'Grade must be between 0 and 5.00.' });
      return;
    }
    try {
      await staffApi.updateGrade(studentId, editingGradeId, {
        grade_value: gv,
        remarks: gradeForm.remarks?.trim() || null,
      });
      staffToast.success('Grade updated', '');
      setEditingGradeId(null);
      setGradeForm({ subject_id: '', academic_year: '', semester: '1st', grade_value: '', remarks: '' });
      refreshStudentDetail(studentId);
    } catch (err) {
      staffToast.error('Update failed', err?.response?.data?.message || 'Could not update grade.');
    }
  };

  const handleDeleteGrade = async (gradeId) => {
    if (!studentId || !window.confirm('Remove this grade?')) return;
    try {
      await staffApi.deleteGrade(studentId, gradeId);
      staffToast.success('Grade removed', '');
      refreshStudentDetail(studentId);
    } catch (err) {
      staffToast.error('Delete failed', err?.response?.data?.message || 'Could not remove grade.');
    }
  };

  const startEditGrade = (grade) => {
    setEditingGradeId(grade.id);
    setGradeForm({
      subject_id: grade.subject_id,
      academic_year: grade.academic_year,
      semester: grade.semester,
      grade_value: grade.grade_value != null ? String(grade.grade_value) : '',
      remarks: grade.remarks || '',
    });
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
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
      queryClient.invalidateQueries({ queryKey: [...queryKeys.staff.all, 'students'] });
      setSubmitStatus('success');
      staffToast.success('Student updated', 'Record saved successfully. Redirecting to Student Records.');
      setTimeout(() => navigate(`${basePath}/students`), 1500);
    } catch (err) {
      const data = err?.response?.data;
      let msg = data?.message || 'Failed to update student.';
      const errors = data?.errors;
      if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
        const parts = Object.values(errors).flat().filter(Boolean);
        if (parts.length) msg = parts.join(' ');
      }
      setSubmitStatus(msg);
      staffToast.error('Update failed', msg);
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
      <Link to={`${basePath}/students`} className="inline-flex items-center gap-2 mb-6 text-tmcc text-sm font-medium no-underline hover:text-tmcc-dark hover:underline">
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

          <div className="flex items-center justify-center gap-0 py-4 mb-6 bg-gray-50 rounded-lg flex-wrap" aria-label="Form steps">
            {[1, 2, 3, 4].map((phase) => (
              <div key={phase} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPhase(phase)}
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-tmcc/50 ${
                    currentPhase === phase || currentPhase > phase ? 'bg-tmcc text-white hover:bg-tmcc-dark' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  aria-pressed={currentPhase === phase}
                  aria-label={`Step ${phase}`}
                >
                  {phase}
                </button>
                <button
                  type="button"
                  onClick={() => goToPhase(phase)}
                  className={`text-sm mr-2 focus:outline-none focus:ring-2 focus:ring-tmcc/30 rounded px-1 ${currentPhase === phase ? 'text-tmcc font-semibold' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Step {phase}
                </button>
                {phase < 4 && <span className={`w-10 h-0.5 mx-1 ${currentPhase > phase ? 'bg-tmcc' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <div className="max-w-[720px]">
            {currentPhase === 1 && (
              <div className="mb-8 p-6 bg-white rounded-xl border-l-4 border-tmcc shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100">
                <h4 className="flex items-center gap-3 m-0 mb-5 pb-3 text-base font-semibold text-gray-800 border-b-2 border-gray-200">
                  <span className="inline-flex items-center justify-center min-w-[4.5rem] py-1.5 px-3 bg-tmcc text-white text-sm font-bold rounded-md tracking-wide">Step 1</span>
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
                  <span className="inline-flex items-center justify-center min-w-[4.5rem] py-1.5 px-3 bg-tmcc text-white text-sm font-bold rounded-md tracking-wide">Step 2</span>
                  Contact Information
                </h4>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-gray-600">Email *</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@tmcc.edu.ph" maxLength={100} className={`${inputBase} ${errors.email ? inputError : inputNormal}`} aria-invalid={!!errors.email} />
                    {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact_number" className="text-sm font-medium text-gray-600">Contact Number (optional)</label>
                    <input id="contact_number" name="contact_number" type="tel" value={form.contact_number} onChange={handleChange} placeholder="09XXXXXXXXX" maxLength={15} className={`${inputBase} ${inputNormal}`} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="address" className="text-sm font-medium text-gray-600">Address (optional)</label>
                  <input id="address" name="address" type="text" value={form.address} onChange={handleChange} placeholder="Street, Barangay, City" maxLength={150} className={`${inputBase} ${inputNormal}`} />
                </div>
              </div>
            )}

            {currentPhase === 3 && (
              <div className="mb-8 p-6 bg-white rounded-xl border-l-4 border-tmcc shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100">
                <h4 className="flex items-center gap-3 m-0 mb-5 pb-3 text-base font-semibold text-gray-800 border-b-2 border-gray-200">
                  <span className="inline-flex items-center justify-center min-w-[4.5rem] py-1.5 px-3 bg-tmcc text-white text-sm font-bold rounded-md tracking-wide">Step 3</span>
                  Enrollment Information
                </h4>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="enrollment_date" className="text-sm font-medium text-gray-600">Enrollment Date *</label>
                    <input id="enrollment_date" name="enrollment_date" type="date" value={form.enrollment_date} onChange={handleChange} className={`${inputBase} ${errors.enrollment_date ? inputError : inputNormal}`} aria-invalid={!!errors.enrollment_date} />
                    {errors.enrollment_date && <span className="text-xs text-red-600">{errors.enrollment_date}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="graduation_date" className="text-sm font-medium text-gray-600">Graduation Date (optional)</label>
                    <input id="graduation_date" name="graduation_date" type="date" value={form.graduation_date} onChange={handleChange} className={`${inputBase} ${inputNormal}`} />
                  </div>
                  <div className="flex flex-col gap-1.5 max-w-[120px]">
                    <label htmlFor="GPA" className="text-sm font-medium text-gray-600">GPA (optional)</label>
                    <input id="GPA" name="GPA" type="number" step="0.01" min="0" max="5" value={form.GPA} onChange={handleChange} placeholder="0.00–5.00" className={`${inputBase} ${errors.GPA ? inputError : inputNormal}`} aria-invalid={!!errors.GPA} />
                    {errors.GPA && <span className="text-xs text-red-600">{errors.GPA}</span>}
                  </div>
                </div>
              </div>
            )}

            {currentPhase === 4 && (
              <div className="mb-8 space-y-8">
                <p className="text-gray-600 text-sm m-0">
                  Manage subject enrollments and grades per thesis data model: <strong>enrollments</strong> (student–subject–academic year–semester–status) and <strong>grades</strong> (student–subject–academic year–semester–grade value–remarks). Fields marked * are required.
                </p>

                {/* Enrollments */}
                <div className="p-6 bg-white rounded-xl border-l-4 border-tmcc shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100">
                  <h4 className="m-0 mb-4 text-base font-semibold text-gray-800">Subject Enrollments</h4>
                  {studentDetail.enrollments.length > 0 ? (
                    <div className="overflow-x-auto mb-4">
                      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-2 px-3 border-b border-gray-200">Subject</th>
                            <th className="text-left py-2 px-3 border-b border-gray-200">Academic Year</th>
                            <th className="text-left py-2 px-3 border-b border-gray-200">Semester</th>
                            <th className="text-left py-2 px-3 border-b border-gray-200">Status</th>
                            <th className="text-right py-2 px-3 border-b border-gray-200">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentDetail.enrollments.map((enr) => (
                            <tr key={enr.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                              <td className="py-2 px-3">{enr.subject ? `${enr.subject.code} – ${enr.subject.title}` : enr.subject_id}</td>
                              <td className="py-2 px-3">{enr.academic_year}</td>
                              <td className="py-2 px-3">{enr.semester}</td>
                              <td className="py-2 px-3 capitalize">{enr.status}</td>
                              <td className="py-2 px-3 text-right">
                                <button type="button" onClick={() => startEditEnrollment(enr)} className="text-tmcc hover:underline mr-2" aria-label="Edit enrollment"><FiEdit2 className="inline" /></button>
                                <button type="button" onClick={() => handleDeleteEnrollment(enr.id)} className="text-red-600 hover:underline" aria-label="Delete enrollment"><FiTrash2 className="inline" /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm mb-4">No enrollments yet. Add one below.</p>
                  )}
                  {editingEnrollmentId ? (
                    <form onSubmit={handleUpdateEnrollment} className="flex flex-wrap items-end gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <span className="text-sm text-amber-800 font-medium w-full">Editing status</span>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Status (optional)</label>
                        <select value={enrollmentForm.status} onChange={(e) => setEnrollmentForm((p) => ({ ...p, status: e.target.value }))} className={`${inputBase} ${inputNormal} min-w-[140px]`}>
                          {ENROLLMENT_STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <button type="submit" className="py-2 px-4 rounded-lg bg-tmcc text-white text-sm font-medium">Save</button>
                      <button type="button" onClick={() => { setEditingEnrollmentId(null); setEnrollmentForm({ subject_id: '', academic_year: '', semester: '1st', status: 'enrolled' }); }} className="py-2 px-4 rounded-lg bg-gray-500 text-white text-sm">Cancel</button>
                    </form>
                  ) : (
                    <form onSubmit={handleAddEnrollment} className="flex flex-wrap items-end gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Subject *</label>
                        <select value={enrollmentForm.subject_id} onChange={(e) => setEnrollmentForm((p) => ({ ...p, subject_id: e.target.value }))} className={`${inputBase} ${enrollmentErrors.subject_id ? inputError : inputNormal} min-w-[200px]`} required>
                          <option value="">Select subject</option>
                          {subjects.map((sub) => (
                            <option key={sub.id} value={sub.id}>{sub.code} – {sub.title}</option>
                          ))}
                        </select>
                        {enrollmentErrors.subject_id && <span className="text-xs text-red-600">{enrollmentErrors.subject_id}</span>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Academic Year *</label>
                        <input type="text" value={enrollmentForm.academic_year} onChange={(e) => setEnrollmentForm((p) => ({ ...p, academic_year: e.target.value }))} placeholder="e.g. 2025-2026" className={`${inputBase} ${enrollmentErrors.academic_year ? inputError : inputNormal} w-32`} />
                        {enrollmentErrors.academic_year && <span className="text-xs text-red-600">{enrollmentErrors.academic_year}</span>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Semester *</label>
                        <select value={enrollmentForm.semester} onChange={(e) => setEnrollmentForm((p) => ({ ...p, semester: e.target.value }))} className={`${inputBase} ${enrollmentErrors.semester ? inputError : inputNormal} min-w-[100px]`}>
                          {SEMESTER_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        {enrollmentErrors.semester && <span className="text-xs text-red-600">{enrollmentErrors.semester}</span>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Status (optional)</label>
                        <select value={enrollmentForm.status} onChange={(e) => setEnrollmentForm((p) => ({ ...p, status: e.target.value }))} className={`${inputBase} ${inputNormal} min-w-[120px]`}>
                          {ENROLLMENT_STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <button type="submit" className="inline-flex items-center gap-1 py-2 px-4 rounded-lg bg-tmcc text-white text-sm font-medium"><FiPlus className="inline" /> Add Enrollment</button>
                    </form>
                  )}
                </div>

                {/* Grades */}
                <div className="p-6 bg-white rounded-xl border-l-4 border-tmcc shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100">
                  <h4 className="m-0 mb-4 text-base font-semibold text-gray-800">Grades</h4>
                  {studentDetail.grades.length > 0 ? (
                    <div className="overflow-x-auto mb-4">
                      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-2 px-3 border-b border-gray-200">Subject</th>
                            <th className="text-left py-2 px-3 border-b border-gray-200">Academic Year</th>
                            <th className="text-left py-2 px-3 border-b border-gray-200">Semester</th>
                            <th className="text-left py-2 px-3 border-b border-gray-200">Grade</th>
                            <th className="text-left py-2 px-3 border-b border-gray-200">Remarks</th>
                            <th className="text-right py-2 px-3 border-b border-gray-200">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentDetail.grades.map((g) => (
                            <tr key={g.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                              <td className="py-2 px-3">{g.subject ? `${g.subject.code} – ${g.subject.title}` : g.subject_id}</td>
                              <td className="py-2 px-3">{g.academic_year}</td>
                              <td className="py-2 px-3">{g.semester}</td>
                              <td className="py-2 px-3">{g.grade_value != null ? Number(g.grade_value) : '—'}</td>
                              <td className="py-2 px-3">{g.remarks || '—'}</td>
                              <td className="py-2 px-3 text-right">
                                <button type="button" onClick={() => startEditGrade(g)} className="text-tmcc hover:underline mr-2" aria-label="Edit grade"><FiEdit2 className="inline" /></button>
                                <button type="button" onClick={() => handleDeleteGrade(g.id)} className="text-red-600 hover:underline" aria-label="Delete grade"><FiTrash2 className="inline" /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm mb-4">No grades yet. Add one below.</p>
                  )}
                  {editingGradeId ? (
                    <form onSubmit={handleUpdateGrade} className="flex flex-wrap items-end gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <span className="text-sm text-amber-800 font-medium w-full">Editing grade</span>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Grade value (optional)</label>
                        <input type="number" step="0.01" min="0" max="5" value={gradeForm.grade_value} onChange={(e) => setGradeForm((p) => ({ ...p, grade_value: e.target.value }))} placeholder="0–5" className={`${inputBase} ${gradeErrors.grade_value ? inputError : inputNormal} w-24`} />
                        {gradeErrors.grade_value && <span className="text-xs text-red-600">{gradeErrors.grade_value}</span>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Remarks (optional)</label>
                        <input type="text" value={gradeForm.remarks} onChange={(e) => setGradeForm((p) => ({ ...p, remarks: e.target.value }))} placeholder="Passed, Failed, INC" maxLength={50} className={`${inputBase} ${inputNormal} w-32`} />
                      </div>
                      <button type="submit" className="py-2 px-4 rounded-lg bg-tmcc text-white text-sm font-medium">Save</button>
                      <button type="button" onClick={() => { setEditingGradeId(null); setGradeForm({ subject_id: '', academic_year: '', semester: '1st', grade_value: '', remarks: '' }); }} className="py-2 px-4 rounded-lg bg-gray-500 text-white text-sm">Cancel</button>
                    </form>
                  ) : (
                    <form onSubmit={handleAddGrade} className="flex flex-wrap items-end gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Subject *</label>
                        <select value={gradeForm.subject_id} onChange={(e) => setGradeForm((p) => ({ ...p, subject_id: e.target.value }))} className={`${inputBase} ${gradeErrors.subject_id ? inputError : inputNormal} min-w-[200px]`} required>
                          <option value="">Select subject</option>
                          {subjects.map((sub) => (
                            <option key={sub.id} value={sub.id}>{sub.code} – {sub.title}</option>
                          ))}
                        </select>
                        {gradeErrors.subject_id && <span className="text-xs text-red-600">{gradeErrors.subject_id}</span>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Academic Year *</label>
                        <input type="text" value={gradeForm.academic_year} onChange={(e) => setGradeForm((p) => ({ ...p, academic_year: e.target.value }))} placeholder="e.g. 2025-2026" className={`${inputBase} ${gradeErrors.academic_year ? inputError : inputNormal} w-32`} />
                        {gradeErrors.academic_year && <span className="text-xs text-red-600">{gradeErrors.academic_year}</span>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Semester *</label>
                        <select value={gradeForm.semester} onChange={(e) => setGradeForm((p) => ({ ...p, semester: e.target.value }))} className={`${inputBase} ${gradeErrors.semester ? inputError : inputNormal} min-w-[100px]`}>
                          {SEMESTER_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        {gradeErrors.semester && <span className="text-xs text-red-600">{gradeErrors.semester}</span>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Grade value (optional)</label>
                        <input type="number" step="0.01" min="0" max="5" value={gradeForm.grade_value} onChange={(e) => setGradeForm((p) => ({ ...p, grade_value: e.target.value }))} placeholder="0–5" className={`${inputBase} ${gradeErrors.grade_value ? inputError : inputNormal} w-24`} />
                        {gradeErrors.grade_value && <span className="text-xs text-red-600">{gradeErrors.grade_value}</span>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Remarks (optional)</label>
                        <input type="text" value={gradeForm.remarks} onChange={(e) => setGradeForm((p) => ({ ...p, remarks: e.target.value }))} placeholder="Passed, Failed, INC" maxLength={50} className={`${inputBase} ${inputNormal} w-32`} />
                      </div>
                      <button type="submit" className="inline-flex items-center gap-1 py-2 px-4 rounded-lg bg-tmcc text-white text-sm font-medium"><FiPlus className="inline" /> Add Grade</button>
                    </form>
                  )}
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
                  <button type="button" onClick={handleSubmit} className="py-2.5 px-5 rounded-lg text-base font-medium bg-tmcc text-white hover:bg-tmcc-dark disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <Link to={`${basePath}/students`} className="py-2.5 px-5 rounded-lg text-base font-medium bg-gray-600 text-white hover:bg-gray-700 no-underline inline-block" onClick={(e) => loading && e.preventDefault()}>
                    Cancel
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StaffEditStudentPage;

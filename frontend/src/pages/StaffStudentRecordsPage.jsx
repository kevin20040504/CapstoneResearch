import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUserPlus, FiEye, FiEdit2, FiSearch, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import ViewStudentModal from '../components/ViewStudentModal';
import { staffApi } from '../lib/api/staffApi';

const mockGetStudentById = (id) =>
  Promise.resolve({
    student: {
      id,
      student_id: `STU-2024-${String(id).padStart(3, '0')}`,
      student_number: `STU-2024-${String(id).padStart(3, '0')}`,
      first_name: 'Student',
      last_name: `#${id}`,
      name: `Student #${id}`,
      email: `student${id}@tmcc.edu.ph`,
      contact_number: '',
      address: '',
      date_of_birth: '2000-01-15',
      enrollment_date: '2024-08-01',
      graduation_date: null,
      GPA: null,
      course: 'BSIT',
      status: 'ENROLLED',
    },
  });

const ENTRIES_OPTIONS = [5, 10, 25, 50];

const sortData = (data, key, dir) => {
  if (!data.length) return data;
  const mult = dir === 'asc' ? 1 : -1;
  return [...data].sort((a, b) => {
    let va = a[key];
    let vb = b[key];
    if (typeof va === 'string') va = (va || '').toLowerCase();
    if (typeof vb === 'string') vb = (vb || '').toLowerCase();
    if (va < vb) return -1 * mult;
    if (va > vb) return 1 * mult;
    return 0;
  });
};

const StaffStudentRecordsPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilterCourse, setStudentFilterCourse] = useState('');
  const [studentFilterStatus, setStudentFilterStatus] = useState('');
  const [studentSortKey, setStudentSortKey] = useState('name');
  const [studentSortDir, setStudentSortDir] = useState('asc');
  const [studentEntries, setStudentEntries] = useState(10);
  const [studentPage, setStudentPage] = useState(1);
  const [viewingStudent, setViewingStudent] = useState(null);

  useEffect(() => {
    setStudents([
      { id: 1, student_id: 'STU-2024-001', name: 'Juan Dela Cruz', course: 'BSIT', status: 'ENROLLED' },
      { id: 2, student_id: 'STU-2024-002', name: 'Maria Santos', course: 'BSCE', status: 'ENROLLED' },
      { id: 3, student_id: 'STU-2024-003', name: 'Pedro Reyes', course: 'BSCS', status: 'ENROLLED' },
    ]);
  }, []);

  const toggleSort = (key) => {
    if (key === studentSortKey) setStudentSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setStudentSortKey(key);
      setStudentSortDir('asc');
    }
  };

  const SortableTh = ({ label, sortKey }) => (
    <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">
      <button
        type="button"
        className="flex items-center gap-1 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-tmcc/30 rounded"
        onClick={() => toggleSort(sortKey)}
      >
        {label}
        {studentSortKey === sortKey ? (
          studentSortDir === 'asc' ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />
        ) : (
          <span className="w-4 h-4 inline-block opacity-40"><FiChevronUp className="w-3 h-3" /></span>
        )}
      </button>
    </th>
  );

  const studentFiltered = useMemo(() => {
    let list = students.filter((s) => {
      const matchSearch = !studentSearch ||
        (s.name && s.name.toLowerCase().includes(studentSearch.toLowerCase())) ||
        (s.student_id && s.student_id.toLowerCase().includes(studentSearch.toLowerCase()));
      const matchCourse = !studentFilterCourse || s.course === studentFilterCourse;
      const matchStatus = !studentFilterStatus || s.status === studentFilterStatus;
      return matchSearch && matchCourse && matchStatus;
    });
    return sortData(list, studentSortKey, studentSortDir);
  }, [students, studentSearch, studentFilterCourse, studentFilterStatus, studentSortKey, studentSortDir]);

  const studentPaginated = useMemo(() => {
    const start = (studentPage - 1) * studentEntries;
    return studentFiltered.slice(start, start + studentEntries);
  }, [studentFiltered, studentPage, studentEntries]);

  const studentCourses = useMemo(() => [...new Set(students.map((s) => s.course).filter(Boolean))], [students]);
  const studentStatuses = useMemo(() => [...new Set(students.map((s) => s.status).filter(Boolean))], [students]);

  return (
    <>
      <section className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="m-0 text-2xl font-bold text-gray-800">Student Records</h2>
        <Link to="/staff/students/new" className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium bg-tmcc text-white no-underline hover:bg-tmcc-dark shadow-sm">
          <FiUserPlus /> New Student
        </Link>
      </section>
      <section className=" p-5 bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="p-6 pt-0 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search by name or student ID..."
                value={studentSearch}
                onChange={(e) => { setStudentSearch(e.target.value); setStudentPage(1); }}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc"
                aria-label="Search students"
              />
            </div>
            <select
              value={studentFilterCourse}
              onChange={(e) => { setStudentFilterCourse(e.target.value); setStudentPage(1); }}
              className="py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc"
              aria-label="Filter by course"
            >
              <option value="">All courses</option>
              {studentCourses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={studentFilterStatus}
              onChange={(e) => { setStudentFilterStatus(e.target.value); setStudentPage(1); }}
              className="py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc"
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              {studentStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={studentEntries}
                onChange={(e) => { setStudentEntries(Number(e.target.value)); setStudentPage(1); }}
                className="py-1.5 px-2 border border-gray-300 rounded text-sm"
              >
                {ENTRIES_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span>entries</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <SortableTh label="Student ID" sortKey="student_id" />
                <SortableTh label="Name" sortKey="name" />
                <SortableTh label="Course" sortKey="course" />
                <SortableTh label="Status" sortKey="status" />
                <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentPaginated.length > 0 ? (
                studentPaginated.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                    <td className="py-3 px-4 text-gray-800">{student.student_id}</td>
                    <td className="py-3 px-4 text-gray-800">{student.name}</td>
                    <td className="py-3 px-4 text-gray-700">{student.course}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-green-100 text-green-800">{student.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewingStudent(student)}
                          className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-sm bg-tmcc text-white hover:bg-tmcc-dark focus:outline-none focus:ring-2 focus:ring-tmcc/30 transition-colors"
                          aria-label={`View details for ${student.name}`}
                        >
                          <FiEye /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/staff/students/${student.id}/edit`, { state: { student } })}
                          className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-sm bg-amber-600 text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-colors"
                          aria-label={`Edit ${student.name}`}
                        >
                          <FiEdit2 /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-8 px-4 text-center text-gray-500 italic">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {studentFiltered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500">
            Showing {((studentPage - 1) * studentEntries) + 1} to {Math.min(studentPage * studentEntries, studentFiltered.length)} of {studentFiltered.length} entries
          </div>
        )}
      </section>

      <ViewStudentModal
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        student={viewingStudent}
        studentId={viewingStudent?.id}
        onFetchStudent={(id) => staffApi.getStudentById(id).catch(() => mockGetStudentById(id))}
        onEdit={(s) => {
          setViewingStudent(null);
          navigate(`/staff/students/${s.id ?? s.student_id}/edit`, { state: { student: s } });
        }}
      />
    </>
  );
};

export default StaffStudentRecordsPage;

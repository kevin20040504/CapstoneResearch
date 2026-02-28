import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiKey,
  FiLogOut,
  FiAlertTriangle,
  FiInfo,
  FiFileText,
  FiLayers,
  FiClipboard,
  FiBook,
  FiPrinter,
} from 'react-icons/fi';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setStudent({
      id: 1,
      student_id: 'TMCC-2025-001',
      first_name: 'Juan',
      last_name: 'Dela Cruz',
      middle_initial: 'S',
      email: 'juan.delacruz@tmcc.edu.ph',
      course: 'BS Information Technology',
      year_level: 2,
      semester: 'SECOND SEMESTER',
      academic_year: 'AY 2025-2026',
      college: 'College of Informatics and Computing Sciences',
      campus: 'Trece Martires City College - Main Campus',
      status: 'ENROLLED',
      profile_photo: '/logo.png',
    });
  }, []);

  const handleSignOut = () => navigate('/');
  const handleChangePassword = () => {};

  if (!student) return <div className="sd-loading">Loading...</div>;

  const fullName = `${student.last_name.toUpperCase()}, ${student.first_name.toUpperCase()} ${student.middle_initial}.`;

  return (
    <div className="student-dashboard">
      <div className="sd-page-container">
      {/* ========== HEADER ========== */}
      <header className="sd-header">
        <div className="sd-header-inner">
          <div className="sd-brand">
            <img src="/logo.png" alt="TMCC" className="sd-logo" onError={(e) => { e.target.style.display = 'none'; }} />
            <h1 className="sd-college-name">Trece Martires City College</h1>
          </div>
          <div className="sd-header-right">
            <div className="sd-datetime">
              <span className="sd-date">{currentDate}</span>
              <span className="sd-time">{currentTime}</span>
            </div>
            <button type="button" className="sd-link-btn" onClick={handleChangePassword} aria-label="Change Password">
              <FiKey className="sd-icon" />
              Change Password
            </button>
            <button type="button" className="sd-link-btn sd-signout" onClick={handleSignOut} aria-label="Sign out">
              <FiLogOut className="sd-icon" />
              Sign-out
            </button>
          </div>
        </div>
      </header>

      {/* ========== PROFILE HERO ========== */}
      <section className="sd-profile-hero">
        <div className="sd-profile-bg" aria-hidden="true" />
        <div className="sd-profile-inner">
          <img src={student.profile_photo} alt="" className="sd-profile-photo" />
          <div className="sd-profile-info ">
          <div className="bg-white/60 px-5 w-fit" >
            <h2 className="sd-profile-name">{fullName}</h2>
            <ul className="sd-academic-list">
              <li>{student.semester} {student.academic_year}</li>
              <li>{student.college} - {student.campus}</li>
              <li>{student.course} - {student.year_level === 1 ? 'FIRST' : student.year_level === 2 ? 'SECOND' : student.year_level === 3 ? 'THIRD' : 'FOURTH'} YEAR</li>
              <li className="sd-status-enrolled !text-green-900">{student.status}</li>
            </ul>
          </div>
          </div>
        </div>
      </section>

      {/* ========== ADVISORY + REGISTRAR SECTION ========== */}
      <section className="sd-top-section">
        <div className="sd-advisory-box">
          <h3 className="sd-advisory-title">
            <FiAlertTriangle className="sd-advisory-icon" />
            Advisory
          </h3>
          <p className="sd-advisory-text">
            TMCC students are reminded to use their <strong>official student portal accounts</strong> for the Automated Student Records Management System (ASRMS). Do not share your password with anyone. For record requests and verification, coordinate with the <strong>Registrar&apos;s Office</strong>. This system supports faster processing of academic documents as stated in the ASRMS capstone project.
          </p>
        </div>
        <div className="sd-office-box">
          <h3 className="sd-office-title">Registrar&apos;s Office</h3>
          <ul className="sd-office-list">
            <li>Policies on Shifters and Transferees</li>
            <li>Student Records Management – ASRMS User Guide AY 2025-2026</li>
          </ul>
        </div>
      </section>

      {/* ========== MAIN NAV ========== */}
      <nav className="sd-main-nav">
        <Link to="/dashboard" className="sd-main-nav-item active">Home</Link>
        <Link to="/request" className="sd-main-nav-item">Request Record</Link>
      </nav>

      {/* ========== ENROLLMENT SECTION ========== */}
      <section className="sd-content">
        <div className="sd-enrollment-section">
          <h2 className="sd-section-title sd-title-red">Enrollment - {student.semester} {student.academic_year}</h2>
          <p className="sd-filter-hint">
            <FiInfo className="sd-info-icon" />
            Click &quot;Filter Option..&quot; button to change the default schoolyear / semester
          </p>
          <button type="button" className="sd-filter-btn">Filter Option..</button>

          <div className="sd-quick-links">
            <Link to="/request" className="sd-quick-link"><span className="sd-quick-icon"><FiFileText /></span> Certificate of Registration (COR)</Link>
            <Link to="/request" className="sd-quick-link"><span className="sd-quick-icon"><FiFileText /></span> Request Academic Record (Transcript, Certificate, etc.)</Link>
            <button type="button" className="sd-quick-link"><span className="sd-quick-icon"><FiLayers /></span> Subjects</button>
            <button type="button" className="sd-quick-link"><span className="sd-quick-icon"><FiClipboard /></span> Grades</button>
            <button type="button" className="sd-quick-link"><span className="sd-quick-icon"><FiBook /></span> Curriculum</button>
            <button type="button" className="sd-quick-link"><span className="sd-quick-icon"><FiPrinter /></span> View Copy of Grades</button>
          </div>
        </div>

        {/* ========== RECORD UPDATE (SIS/SIUF - student records) ========== */}
        <h2 className="sd-section-title sd-title-red">Record Update</h2>
        <div className="sd-cards-row">
          <div className="sd-feature-card"><span className="sd-card-icon"><FiFileText /></span><div><strong>Student Information Sheet (SIS) and Student Information Updating Form (SIUF)</strong><br /><small>Update your student records for the Registrar</small></div></div>
        </div>

        {/* ========== TRUNKLINES + LOCAL NUMBERS ========== */}
        <div className="sd-bottom-panels">
          <div className="sd-panel sd-panel-trunklines">
            <h3 className="sd-panel-title">Trunklines</h3>
            <div className="sd-trunkline-table">
              <div className="sd-trunkline-row"><strong>TRECE MARTIRES CITY COLLEGE</strong><span>(046) 419-XXXX</span></div>
              <div className="sd-trunkline-row"><strong>REGISTRAR&apos;S OFFICE</strong><span>(046) 419-XXXX local XXXX</span></div>
            </div>
            <h3 className="sd-panel-title">Local Numbers and Emails</h3>
            <div className="sd-tabs-row">
              <button type="button" className="sd-tab active">Registrar</button>
            </div>
            <div className="sd-email-table">
              <div className="sd-trunkline-row"><strong>Registrar</strong><span>registrar@tmcc.edu.ph</span></div>
            </div>
          </div>
          <div className="sd-panel sd-panel-logos">
            <div className="sd-logo-placeholder">TMCC</div>
            <div className="sd-logo-placeholder small">CHED</div>
            <div className="sd-logo-placeholder small">Partner</div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default StudentDashboard;

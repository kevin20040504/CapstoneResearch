import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiInfo,
  FiFileText,
  FiLayers,
  FiClipboard,
  FiPrinter,
} from 'react-icons/fi';
import RequestRecordModal from '../components/student/RequestRecordModal';
import SubjectsModal from '../components/student/SubjectsModal';
import GradesModal from '../components/student/GradesModal';
import ViewCopyOfGradesModal from '../components/student/ViewCopyOfGradesModal';
import { studentApi } from '../lib/api/studentApi';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState({ requestRecord: false, subjects: false, grades: false, viewCopyOfGrades: false });

  React.useEffect(() => {
    studentApi.getProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  const academicYear = profile?.academic_year || '';
  const semester = profile?.semester || '';
  const student = profile?.student || null;

  const hasValue = (v) => v !== null && v !== undefined && String(v).trim() !== '';
  const needsSisUpdate = student
    ? ![
      student.address,
      student.place_of_birth,
      student.sex,
      student.guardian_name,
      student.citizenship,
      student.elementary_school,
      student.elementary_year,
      student.high_school,
      student.high_school_year,
      student.previous_school,
      student.previous_course,
    ].every(hasValue)
    : false;

  return (
    <>
      {/* ========== ENROLLMENT SECTION ========== */}
      <section className="sd-content">
        <div className="sd-enrollment-section">
          <h2 className="sd-section-title sd-title-red">Enrollment - {semester} {academicYear}</h2>
          <p className="sd-filter-hint">
            <FiInfo className="sd-info-icon" />
            Use the links below to view your subjects, grades, or request academic records.
          </p>

          <div className="sd-quick-links">
            <button type="button" className="sd-quick-link" onClick={() => setModalOpen((m) => ({ ...m, requestRecord: true }))}>
              <span className="sd-quick-icon"><FiFileText /></span> Request Academic Record (Transcript, Certificate, etc.)
            </button>
            <button type="button" className="sd-quick-link" onClick={() => setModalOpen((m) => ({ ...m, subjects: true }))}>
              <span className="sd-quick-icon"><FiLayers /></span> Subjects
            </button>
            <button type="button" className="sd-quick-link" onClick={() => setModalOpen((m) => ({ ...m, grades: true }))}>
              <span className="sd-quick-icon"><FiClipboard /></span> Grades
            </button>
            <button type="button" className="sd-quick-link" onClick={() => setModalOpen((m) => ({ ...m, viewCopyOfGrades: true }))}>
              <span className="sd-quick-icon"><FiPrinter /></span> View Copy of Grades
            </button>
          </div>
        </div>

        {/* ========== RECORD UPDATE (SIS/SIUF - student records) ========== */}
        <h2 className="sd-section-title sd-title-red">Record Update</h2>
        <div className="sd-cards-row">
          <button
            type="button"
            className="sd-feature-card"
            style={{ textAlign: 'left', position: 'relative' }}
            onClick={() => navigate('/dashboard/sis')}
          >
            {needsSisUpdate && (
              <span
                aria-label="SIS not yet updated"
                title="SIS not yet updated"
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: '#ef4444',
                  boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.15)',
                }}
              />
            )}
            <span className="sd-card-icon"><FiFileText /></span>
            <div>
              <strong>Student Information Sheet (SIS) and Student Information Updating Form (SIUF)</strong>
              <br />
              <small>Update your student records for the Registrar</small>
            </div>
          </button>
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

      <RequestRecordModal
        isOpen={modalOpen.requestRecord}
        onClose={() => setModalOpen((m) => ({ ...m, requestRecord: false }))}
        onSuccess={() => setModalOpen((m) => ({ ...m, requestRecord: false }))}
      />
      <SubjectsModal isOpen={modalOpen.subjects} onClose={() => setModalOpen((m) => ({ ...m, subjects: false }))} />
      <GradesModal isOpen={modalOpen.grades} onClose={() => setModalOpen((m) => ({ ...m, grades: false }))} />
      <ViewCopyOfGradesModal isOpen={modalOpen.viewCopyOfGrades} onClose={() => setModalOpen((m) => ({ ...m, viewCopyOfGrades: false }))} />
    </>
  );
};

export default StudentDashboard;

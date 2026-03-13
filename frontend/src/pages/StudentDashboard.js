import React, { useState } from 'react';
import {
  FiInfo,
  FiFileText,
  FiLayers,
  FiClipboard,
  FiBook,
  FiPrinter,
} from 'react-icons/fi';
import CORModal from '../components/student/CORModal';
import RequestRecordModal from '../components/student/RequestRecordModal';
import SubjectsModal from '../components/student/SubjectsModal';
import GradesModal from '../components/student/GradesModal';
import CurriculumModal from '../components/student/CurriculumModal';
import ViewCopyOfGradesModal from '../components/student/ViewCopyOfGradesModal';
import { studentApi } from '../lib/api/studentApi';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState({ cor: false, requestRecord: false, subjects: false, grades: false, curriculum: false, viewCopyOfGrades: false });

  React.useEffect(() => {
    studentApi.getProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  const academicYear = profile?.academic_year || '';
  const semester = profile?.semester || '';

  return (
    <>
      {/* ========== ENROLLMENT SECTION ========== */}
      <section className="sd-content">
        <div className="sd-enrollment-section">
          <h2 className="sd-section-title sd-title-red">Enrollment - {semester} {academicYear}</h2>
          <p className="sd-filter-hint">
            <FiInfo className="sd-info-icon" />
            Use the links below to view your COR, subjects, grades, curriculum, or request academic records.
          </p>

          <div className="sd-quick-links">
            <button type="button" className="sd-quick-link" onClick={() => setModalOpen((m) => ({ ...m, cor: true }))}>
              <span className="sd-quick-icon"><FiFileText /></span> Certificate of Registration (COR)
            </button>
            <button type="button" className="sd-quick-link" onClick={() => setModalOpen((m) => ({ ...m, requestRecord: true }))}>
              <span className="sd-quick-icon"><FiFileText /></span> Request Academic Record (Transcript, Certificate, etc.)
            </button>
            <button type="button" className="sd-quick-link" onClick={() => setModalOpen((m) => ({ ...m, subjects: true }))}>
              <span className="sd-quick-icon"><FiLayers /></span> Subjects
            </button>
            <button type="button" className="sd-quick-link" onClick={() => setModalOpen((m) => ({ ...m, grades: true }))}>
              <span className="sd-quick-icon"><FiClipboard /></span> Grades
            </button>
            <button type="button" className="sd-quick-link" onClick={() => setModalOpen((m) => ({ ...m, curriculum: true }))}>
              <span className="sd-quick-icon"><FiBook /></span> Curriculum
            </button>
            <button type="button" className="sd-quick-link" onClick={() => setModalOpen((m) => ({ ...m, viewCopyOfGrades: true }))}>
              <span className="sd-quick-icon"><FiPrinter /></span> View Copy of Grades
            </button>
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

      <CORModal isOpen={modalOpen.cor} onClose={() => setModalOpen((m) => ({ ...m, cor: false }))} />
      <RequestRecordModal
        isOpen={modalOpen.requestRecord}
        onClose={() => setModalOpen((m) => ({ ...m, requestRecord: false }))}
        onSuccess={() => setModalOpen((m) => ({ ...m, requestRecord: false }))}
      />
      <SubjectsModal isOpen={modalOpen.subjects} onClose={() => setModalOpen((m) => ({ ...m, subjects: false }))} />
      <GradesModal isOpen={modalOpen.grades} onClose={() => setModalOpen((m) => ({ ...m, grades: false }))} />
      <CurriculumModal isOpen={modalOpen.curriculum} onClose={() => setModalOpen((m) => ({ ...m, curriculum: false }))} />
      <ViewCopyOfGradesModal isOpen={modalOpen.viewCopyOfGrades} onClose={() => setModalOpen((m) => ({ ...m, viewCopyOfGrades: false }))} />
    </>
  );
};

export default StudentDashboard;

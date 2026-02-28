import React, { useState, useEffect } from 'react';
import { FiInbox, FiUsers, FiBarChart2, FiCheck, FiX, FiEye, FiEdit2 } from 'react-icons/fi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending-requests');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    // Mock data
    setPendingRequests([
      {
        id: 1,
        student_id: 1,
        student_name: 'Juan Dela Cruz',
        record_type: 'transcript',
        purpose: 'Job application',
        requested_at: '2026-02-28',
        status: 'pending'
      },
      {
        id: 2,
        student_id: 2,
        student_name: 'Maria Santos',
        record_type: 'certificate',
        purpose: 'Scholarship',
        requested_at: '2026-02-27',
        status: 'pending'
      },
      {
        id: 3,
        student_id: 3,
        student_name: 'Pedro Reyes',
        record_type: 'diploma',
        purpose: 'Professional license',
        requested_at: '2026-02-26',
        status: 'pending'
      }
    ]);

    setStudents([
      { id: 1, student_id: 'STU-2024-001', name: 'Juan Dela Cruz', course: 'BSIT', active: true },
      { id: 2, student_id: 'STU-2024-002', name: 'Maria Santos', course: 'BSCE', active: true },
      { id: 3, student_id: 'STU-2024-003', name: 'Pedro Reyes', course: 'BSCS', active: true }
    ]);
  }, []);

  const handleApprove = (id) => {
    alert(`Request ${id} approved!`);
    // TODO: Call API to approve
  };

  const handleReject = (id) => {
    alert(`Request ${id} rejected!`);
    // TODO: Call API to reject
  };

  const handleRelease = (id) => {
    alert(`Record ${id} released!`);
    // TODO: Call API to release
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h2>Registrar Dashboard</h2>

        <div className="dashboard-tabs">
          <button
            className={activeTab === 'pending-requests' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('pending-requests')}
          >
            <FiInbox style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Pending Requests ({pendingRequests.length})
          </button>
          <button
            className={activeTab === 'students' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('students')}
          >
            <FiUsers style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Students ({students.length})
          </button>
          <button
            className={activeTab === 'reports' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('reports')}
          >
            <FiBarChart2 style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Reports
          </button>
        </div>

        {/* Pending Requests Section */}
        {activeTab === 'pending-requests' && (
          <section className="section">
            <h3>Pending Record Requests</h3>
            {pendingRequests.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Record Type</th>
                    <th>Purpose</th>
                    <th>Requested</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.student_name}</td>
                      <td>{req.record_type}</td>
                      <td>{req.purpose}</td>
                      <td>{req.requested_at}</td>
                      <td className="actions">
                        <button className="btn-approve" onClick={() => handleApprove(req.id)}>
                          Approve
                        </button>
                        <button className="btn-reject" onClick={() => handleReject(req.id)}>
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No pending requests</p>
            )}
          </section>
        )}

        {/* Students Section */}
        {activeTab === 'students' && (
          <section className="section">
            <h3>Student Records</h3>
            {students.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.student_id}</td>
                      <td>{student.name}</td>
                      <td>{student.course}</td>
                      <td><span className="badge active">{student.active ? 'Active' : 'Inactive'}</span></td>
                      <td className="actions">
                        <button className="btn-view"><FiEye style={{ marginRight: '4px', verticalAlign: 'middle' }} />View</button>
                        <button className="btn-edit"><FiEdit2 style={{ marginRight: '4px', verticalAlign: 'middle' }} />Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No students found</p>
            )}
          </section>
        )}

        {/* Reports Section */}
        {activeTab === 'reports' && (
          <section className="section">
            <h3>System Reports</h3>
            <div className="reports-grid">
              <div className="report-card">
                <FiInbox style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#666' }} />
                <h4>Total Requests</h4>
                <p className="report-number">24</p>
                <small>This month</small>
              </div>
              <div className="report-card">
                <FiBarChart2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#666' }} />
                <h4>Avg. Processing Time</h4>
                <p className="report-number">2.5 days</p>
                <small>From request to release</small>
              </div>
              <div className="report-card">
                <FiUsers style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#666' }} />
                <h4>Active Students</h4>
                <p className="report-number">982</p>
                <small>Current enrollment</small>
              </div>
              <div className="report-card">
                <FiCheck style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#666' }} />
                <h4>Approval Rate</h4>
                <p className="report-number">95%</p>
                <small>Successful approvals</small>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

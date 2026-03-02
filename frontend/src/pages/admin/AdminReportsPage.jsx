import React, { useState } from 'react';
import { FiInbox, FiUsers, FiCheck, FiClock, FiDownload } from 'react-icons/fi';
import { adminToast } from '../../lib/notifications';

const MOCK_SUMMARY = {
  totalRequestsMonth: 24,
  avgProcessingDays: 2.5,
  activeStudents: 982,
  approvalRate: 95,
};

const MOCK_RECENT_REQUESTS = [
  { id: 1, student_name: 'Juan Dela Cruz', record_type: 'Transcript', status: 'Released', date: '2026-02-28' },
  { id: 2, student_name: 'Maria Santos', record_type: 'Certificate', status: 'Approved', date: '2026-02-27' },
  { id: 3, student_name: 'Pedro Reyes', record_type: 'Diploma', status: 'Pending', date: '2026-02-26' },
  { id: 4, student_name: 'Ana Lopez', record_type: 'Transcript', status: 'Released', date: '2026-02-25' },
  { id: 5, student_name: 'Carlos Mendoza', record_type: 'Certificate', status: 'Rejected', date: '2026-02-24' },
];

const statusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'released': return 'bg-green-100 text-green-800';
    case 'approved': return 'bg-blue-100 text-blue-800';
    case 'pending': return 'bg-amber-100 text-amber-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const AdminReportsPage = () => {
  const [summary] = useState(MOCK_SUMMARY);
  const [recentRequests] = useState(MOCK_RECENT_REQUESTS);
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportCSV = async () => {
    setExportLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setExportLoading(false);
    adminToast.success('Export completed', 'Report exported as CSV. (UI mock)');
  };

  const handleExportPDF = async () => {
    setExportLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setExportLoading(false);
    adminToast.success('Export completed', 'Report exported as PDF. (UI mock)');
  };

  return (
    <>
      <section className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="m-0 text-2xl font-bold text-gray-800">Reports</h2>
          <p className="mt-1 m-0 text-gray-600 text-sm">Full reports with export. Admin-only access.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={exportLoading}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium bg-tmcc text-white hover:bg-tmcc-dark disabled:opacity-70"
          >
            <FiDownload /> Export CSV
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={exportLoading}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium bg-staff-red text-white hover:opacity-90 disabled:opacity-70"
          >
            <FiDownload /> Export PDF
          </button>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100">
          <h3 className="mt-0 mb-2 text-lg font-semibold text-gray-800">Summary (This Month)</h3>
          <p className="m-0 text-sm text-gray-500">Key performance indicators — admin full access.</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-gray-50 border-l-4 border-tmcc">
            <FiInbox className="w-7 h-7 mb-2 text-tmcc" aria-hidden />
            <h4 className="m-0 mb-2 text-sm text-gray-500 font-medium">Total Requests</h4>
            <p className="m-0 text-2xl font-bold text-gray-800">{summary.totalRequestsMonth}</p>
            <small className="block mt-1 text-gray-400 text-xs">This month</small>
          </div>
          <div className="p-5 rounded-xl bg-gray-50 border-l-4 border-blue-500">
            <FiClock className="w-7 h-7 mb-2 text-blue-500" aria-hidden />
            <h4 className="m-0 mb-2 text-sm text-gray-500 font-medium">Avg. Processing Time</h4>
            <p className="m-0 text-2xl font-bold text-gray-800">{summary.avgProcessingDays} days</p>
            <small className="block mt-1 text-gray-400 text-xs">From request to release</small>
          </div>
          <div className="p-5 rounded-xl bg-gray-50 border-l-4 border-indigo-500">
            <FiUsers className="w-7 h-7 mb-2 text-indigo-500" aria-hidden />
            <h4 className="m-0 mb-2 text-sm text-gray-500 font-medium">Active Students</h4>
            <p className="m-0 text-2xl font-bold text-gray-800">{summary.activeStudents}</p>
            <small className="block mt-1 text-gray-400 text-xs">Current enrollment</small>
          </div>
          <div className="p-5 rounded-xl bg-gray-50 border-l-4 border-green-500">
            <FiCheck className="w-7 h-7 mb-2 text-green-500" aria-hidden />
            <h4 className="m-0 mb-2 text-sm text-gray-500 font-medium">Approval Rate</h4>
            <p className="m-0 text-2xl font-bold text-gray-800">{summary.approvalRate}%</p>
            <small className="block mt-1 text-gray-400 text-xs">Successful approvals</small>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="mt-0 mb-2 text-lg font-semibold text-gray-800">Transaction History</h3>
          <p className="m-0 text-sm text-gray-500">Full transaction history — export available for admin.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" aria-label="Transaction history">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Student</th>
                <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Record Type</th>
                <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Status</th>
                <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                  <td className="py-3 px-4 text-gray-800">{row.student_name}</td>
                  <td className="py-3 px-4 text-gray-700">{row.record_type}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block py-1 px-3 rounded-full text-xs font-medium ${statusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-sm text-gray-500 flex items-center justify-between">
          <span>Admin: Full report access with CSV and PDF export.</span>
        </div>
      </section>
    </>
  );
};

export default AdminReportsPage;

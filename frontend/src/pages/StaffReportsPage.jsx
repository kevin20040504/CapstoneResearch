import React, { useState, useEffect } from 'react';
import { FiInbox, FiUsers, FiCheck, FiClock } from 'react-icons/fi';
import { staffApi } from '../lib/api/staffApi';
import { parseApiError } from '../lib/api/errors';

const statusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'released':
      return 'bg-green-100 text-green-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const StaffReportsPage = () => {
  const [summary, setSummary] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    Promise.all([
      staffApi.getReportsSummary(),
      staffApi.getTransactionHistory({ per_page: 5 }),
    ])
      .then(([summaryRes, historyRes]) => {
        if (cancelled) return;
        setSummary(summaryRes || {});
        const list = Array.isArray(historyRes?.data) ? historyRes.data : (Array.isArray(historyRes) ? historyRes : []);
        setRecentRequests(list.map((r) => ({
          id: r.id,
          student_name: r.student_name ?? (r.student ? [r.student.first_name, r.student.last_name].filter(Boolean).join(' ') : '—'),
          record_type: r.record_type ? r.record_type.charAt(0).toUpperCase() + r.record_type.slice(1) : '—',
          status: r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : '—',
          date: r.requested_at ? new Date(r.requested_at).toLocaleDateString('en-PH', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '—',
        })));
      })
      .catch((err) => {
        if (!cancelled) {
          const parsed = parseApiError(err);
          setLoadError(parsed.message || 'Failed to load reports.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <section className="mb-6">
        <h2 className="m-0 text-2xl font-bold text-gray-800">Reports</h2>
        <p className="mt-1 m-0 text-gray-600 text-sm">Read-only metrics and summaries. Export is not available for staff role.</p>
      </section>

      {loadError && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm" role="alert">
          {loadError}
        </div>
      )}

      <section className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100">
          <h3 className="mt-0 mb-2 text-lg font-semibold text-gray-800">Summary</h3>
          <p className="m-0 text-sm text-gray-500">Key performance indicators — view only.</p>
        </div>
        {loading && !summary ? (
          <div className="p-8 text-center text-gray-500">Loading summary...</div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-gray-50 border-l-4 border-tmcc">
              <FiInbox className="w-7 h-7 mb-2 text-tmcc" aria-hidden />
              <h4 className="m-0 mb-2 text-sm text-gray-500 font-medium">Pending Requests</h4>
              <p className="m-0 text-2xl font-bold text-gray-800">{summary?.pending_requests ?? '—'}</p>
              <small className="block mt-1 text-gray-400 text-xs">Awaiting review</small>
            </div>
            <div className="p-5 rounded-xl bg-gray-50 border-l-4 border-blue-500">
              <FiClock className="w-7 h-7 mb-2 text-blue-500" aria-hidden />
              <h4 className="m-0 mb-2 text-sm text-gray-500 font-medium">Processed Today</h4>
              <p className="m-0 text-2xl font-bold text-gray-800">{summary?.processed_today ?? '—'}</p>
              <small className="block mt-1 text-gray-400 text-xs">Approved/rejected today</small>
            </div>
            <div className="p-5 rounded-xl bg-gray-50 border-l-4 border-indigo-500">
              <FiUsers className="w-7 h-7 mb-2 text-indigo-500" aria-hidden />
              <h4 className="m-0 mb-2 text-sm text-gray-500 font-medium">Students</h4>
              <p className="m-0 text-2xl font-bold text-gray-800">{summary?.students_count ?? '—'}</p>
              <small className="block mt-1 text-gray-400 text-xs">Total in system</small>
            </div>
            <div className="p-5 rounded-xl bg-gray-50 border-l-4 border-green-500">
              <FiCheck className="w-7 h-7 mb-2 text-green-500" aria-hidden />
              <h4 className="m-0 mb-2 text-sm text-gray-500 font-medium">Approval Rate</h4>
              <p className="m-0 text-2xl font-bold text-gray-800">{summary?.approval_rate != null ? `${summary.approval_rate}%` : '—'}</p>
              <small className="block mt-1 text-gray-400 text-xs">Successful approvals</small>
            </div>
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="mt-0 mb-2 text-lg font-semibold text-gray-800">Recent Request Activity</h3>
          <p className="m-0 text-sm text-gray-500">Last 5 record requests — read-only.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" aria-label="Recent requests">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Student</th>
                <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Record Type</th>
                <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Status</th>
                <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-6 text-center text-gray-500">Loading...</td></tr>
              ) : recentRequests.length === 0 ? (
                <tr><td colSpan={4} className="py-6 text-center text-gray-500 italic">No recent requests.</td></tr>
              ) : recentRequests.map((row) => (
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
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-sm text-gray-500">
          Reports are read-only. Export and bulk actions are not available for staff accounts.
        </div>
      </section>
    </>
  );
};

export default StaffReportsPage;

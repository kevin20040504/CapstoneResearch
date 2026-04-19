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

            {/* staff student created todaya */}
            <div className="p-5 rounded-xl bg-gray-50 border-l-4 border-blue-500">
              <FiClock className="w-7 h-7 mb-2 text-blue-500" aria-hidden />
              <h4 className="m-0 mb-2 text-sm text-gray-500 font-medium">Processed Today</h4>
              <p className="m-0 text-2xl font-bold text-gray-800">{summary?.processed_today ?? '—'}</p>
              <small className="block mt-1 text-gray-400 text-xs">Students created today</small>
            </div>

            <div className="p-5 rounded-xl bg-gray-50 border-l-4 border-indigo-500">
              <FiUsers className="w-7 h-7 mb-2 text-indigo-500" aria-hidden />
              <h4 className="m-0 mb-2 text-sm text-gray-500 font-medium">Students</h4>
              <p className="m-0 text-2xl font-bold text-gray-800">{summary?.students_count ?? '—'}</p>
              <small className="block mt-1 text-gray-400 text-xs">Total in system</small>
            </div>
         
          </div>
        )}
      </section>

    </>
  );
};

export default StaffReportsPage;

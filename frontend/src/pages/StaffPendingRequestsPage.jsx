import React, { useState, useEffect, useMemo } from 'react';
import { FiCheck, FiX, FiSearch, FiChevronUp, FiChevronDown } from 'react-icons/fi';

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

const StaffPendingRequestsPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingSearch, setPendingSearch] = useState('');
  const [pendingFilterType, setPendingFilterType] = useState('');
  const [pendingSortKey, setPendingSortKey] = useState('requested_at');
  const [pendingSortDir, setPendingSortDir] = useState('desc');
  const [pendingEntries, setPendingEntries] = useState(10);
  const [pendingPage, setPendingPage] = useState(1);

  useEffect(() => {
    setPendingRequests([
      { id: 1, student_id: 1, student_name: 'Juan Dela Cruz', record_type: 'transcript', purpose: 'Job application', requested_at: '2026-02-28', status: 'pending' },
      { id: 2, student_id: 2, student_name: 'Maria Santos', record_type: 'certificate', purpose: 'Scholarship', requested_at: '2026-02-27', status: 'pending' },
      { id: 3, student_id: 3, student_name: 'Pedro Reyes', record_type: 'diploma', purpose: 'Professional license', requested_at: '2026-02-26', status: 'pending' },
    ]);
  }, []);

  const handleReject = (id) => setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  const handleApprove = (id) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleSort = (key) => {
    if (key === pendingSortKey) setPendingSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setPendingSortKey(key);
      setPendingSortDir('asc');
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
        {pendingSortKey === sortKey ? (
          pendingSortDir === 'asc' ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />
        ) : (
          <span className="w-4 h-4 inline-block opacity-40"><FiChevronUp className="w-3 h-3" /></span>
        )}
      </button>
    </th>
  );

  const pendingFiltered = useMemo(() => {
    let list = pendingRequests.filter((r) => {
      const matchSearch = !pendingSearch || [r.student_name, r.record_type, r.purpose].some((v) =>
        String(v || '').toLowerCase().includes(pendingSearch.toLowerCase())
      );
      const matchType = !pendingFilterType || r.record_type === pendingFilterType;
      return matchSearch && matchType;
    });
    return sortData(list, pendingSortKey, pendingSortDir);
  }, [pendingRequests, pendingSearch, pendingFilterType, pendingSortKey, pendingSortDir]);

  const pendingPaginated = useMemo(() => {
    const start = (pendingPage - 1) * pendingEntries;
    return pendingFiltered.slice(start, start + pendingEntries);
  }, [pendingFiltered, pendingPage, pendingEntries]);

  const pendingRecordTypes = useMemo(() => [...new Set(pendingRequests.map((r) => r.record_type))], [pendingRequests]);

  return (
    <>
      <section className="mb-6">
        <h2 className="m-0 text-2xl font-bold text-gray-800">Pending Requests</h2>
      </section>
      <section className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="mt-0 mb-4 text-lg font-semibold text-gray-800">Pending Record Requests</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                value={pendingSearch}
                onChange={(e) => { setPendingSearch(e.target.value); setPendingPage(1); }}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc"
                aria-label="Search pending requests"
              />
            </div>
            <select
              value={pendingFilterType}
              onChange={(e) => { setPendingFilterType(e.target.value); setPendingPage(1); }}
              className="py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc"
              aria-label="Filter by record type"
            >
              <option value="">All record types</option>
              {pendingRecordTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={pendingEntries}
                onChange={(e) => { setPendingEntries(Number(e.target.value)); setPendingPage(1); }}
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
                <SortableTh label="Student Name" sortKey="student_name" />
                <SortableTh label="Record Type" sortKey="record_type" />
                <SortableTh label="Purpose" sortKey="purpose" />
                <SortableTh label="Requested" sortKey="requested_at" />
                <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingPaginated.length > 0 ? (
                pendingPaginated.map((req) => (
                  <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                    <td className="py-3 px-4 text-gray-800">{req.student_name}</td>
                    <td className="py-3 px-4 text-gray-700">{req.record_type}</td>
                    <td className="py-3 px-4 text-gray-700">{req.purpose}</td>
                    <td className="py-3 px-4 text-gray-700">{req.requested_at}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 flex-wrap">
                        <button type="button" className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-sm bg-tmcc text-white hover:bg-tmcc-dark" onClick={() => handleApprove(req.id)}><FiCheck /> Approve</button>
                        <button type="button" className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-sm bg-staff-red text-white hover:opacity-90" onClick={() => handleReject(req.id)}><FiX /> Reject</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-8 px-4 text-center text-gray-500 italic">No pending requests.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {pendingFiltered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500">
            Showing {((pendingPage - 1) * pendingEntries) + 1} to {Math.min(pendingPage * pendingEntries, pendingFiltered.length)} of {pendingFiltered.length} entries
          </div>
        )}
      </section>
    </>
  );
};

export default StaffPendingRequestsPage;

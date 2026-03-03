import React, { useState, useEffect, useMemo } from 'react';
import { FiCheck, FiX, FiSearch, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { adminToast } from '../../lib/notifications';

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

const AdminPendingRequestsPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortKey, setSortKey] = useState('requested_at');
  const [sortDir, setSortDir] = useState('desc');
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setPendingRequests([
      { id: 1, student_id: 1, student_name: 'Juan Dela Cruz', record_type: 'transcript', purpose: 'Job application', requested_at: '2026-02-28', status: 'pending' },
      { id: 2, student_id: 2, student_name: 'Maria Santos', record_type: 'certificate', purpose: 'Scholarship', requested_at: '2026-02-27', status: 'pending' },
      { id: 3, student_id: 3, student_name: 'Pedro Reyes', record_type: 'diploma', purpose: 'Professional license', requested_at: '2026-02-26', status: 'pending' },
    ]);
  }, []);

  const handleReject = (id) => {
    setConfirmAction({ type: 'reject', id, student_name: pendingRequests.find((r) => r.id === id)?.student_name });
  };

  const handleApprove = (id) => {
    setConfirmAction({ type: 'approve', id, student_name: pendingRequests.find((r) => r.id === id)?.student_name });
  };

  const onConfirmAction = async () => {
    if (!confirmAction) return;
    setConfirmLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const { type, id, student_name } = confirmAction;
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    setConfirmAction(null);
    setConfirmLoading(false);
    if (type === 'approve') {
      adminToast.success('Request approved', `${student_name}'s record request has been approved.`);
    } else {
      adminToast.warning('Request rejected', `${student_name}'s record request has been rejected.`);
    }
  };

  const toggleSort = (key) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortableTh = ({ label, sortKey: sk }) => (
    <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">
      <button type="button" className="flex items-center gap-1 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-tmcc/30 rounded" onClick={() => toggleSort(sk)}>
        {label}
        {sortKey === sk ? (sortDir === 'asc' ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />) : <span className="w-4 h-4 inline-block opacity-40"><FiChevronUp className="w-3 h-3" /></span>}
      </button>
    </th>
  );

  const filtered = useMemo(() => {
    let list = pendingRequests.filter((r) => {
      const matchSearch = !search || [r.student_name, r.record_type, r.purpose].some((v) => String(v || '').toLowerCase().includes(search.toLowerCase()));
      const matchType = !filterType || r.record_type === filterType;
      return matchSearch && matchType;
    });
    return sortData(list, sortKey, sortDir);
  }, [pendingRequests, search, filterType, sortKey, sortDir]);

  const paginated = useMemo(() => {
    const start = (page - 1) * entries;
    return filtered.slice(start, start + entries);
  }, [filtered, page, entries]);

  const recordTypes = useMemo(() => [...new Set(pendingRequests.map((r) => r.record_type))], [pendingRequests]);
  const isApprove = confirmAction?.type === 'approve';

  return (
    <>
      <section className="mb-6">
        <h2 className="m-0 text-2xl font-bold text-gray-800">Pending Requests</h2>
        <p className="mt-1 m-0 text-gray-600 text-sm">Review and approve or reject record requests from students.</p>
      </section>
      <section className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc"
                aria-label="Search pending requests"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
              className="py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc"
              aria-label="Filter by record type"
            >
              <option value="">All record types</option>
              {recordTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select value={entries} onChange={(e) => { setEntries(Number(e.target.value)); setPage(1); }} className="py-1.5 px-2 border border-gray-300 rounded text-sm">
                {ENTRIES_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
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
              {paginated.length > 0 ? (
                paginated.map((req) => (
                  <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                    <td className="py-3 px-4 text-gray-800">{req.student_name}</td>
                    <td className="py-3 px-4 text-gray-700">{req.record_type}</td>
                    <td className="py-3 px-4 text-gray-700">{req.purpose}</td>
                    <td className="py-3 px-4 text-gray-700">{req.requested_at}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 flex-wrap">
                        <button type="button" className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-sm bg-tmcc text-white hover:bg-tmcc-dark focus:ring-2 focus:ring-tmcc/30" onClick={() => handleApprove(req.id)}><FiCheck /> Approve</button>
                        <button type="button" className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-sm bg-staff-red text-white hover:opacity-90 focus:ring-2 focus:ring-red-500/30" onClick={() => handleReject(req.id)}><FiX /> Reject</button>
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
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500">
            Showing {((page - 1) * entries) + 1} to {Math.min(page * entries, filtered.length)} of {filtered.length} entries
          </div>
        )}
      </section>

      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => !confirmLoading && setConfirmAction(null)}
        onConfirm={onConfirmAction}
        title={isApprove ? 'Approve request' : 'Reject request'}
        message={confirmAction ? (isApprove ? `Approve the record request for ${confirmAction.student_name}? The request will move to Document Release.` : `Reject the record request for ${confirmAction.student_name}? This action cannot be undone.`) : ''}
        confirmLabel={isApprove ? 'Approve' : 'Reject'}
        cancelLabel="Cancel"
        variant={isApprove ? 'success' : 'danger'}
        loading={confirmLoading}
      />
    </>
  );
};

export default AdminPendingRequestsPage;

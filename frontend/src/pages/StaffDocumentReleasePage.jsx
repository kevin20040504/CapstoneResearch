import React, { useState, useEffect, useMemo } from 'react';
import { FiPackage, FiSearch, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { staffToast } from '../lib/notifications';

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

const StaffDocumentReleasePage = () => {
  const [approvedForRelease, setApprovedForRelease] = useState([]);
  const [releaseSearch, setReleaseSearch] = useState('');
  const [releaseFilterType, setReleaseFilterType] = useState('');
  const [releaseSortKey, setReleaseSortKey] = useState('approved_at');
  const [releaseSortDir, setReleaseSortDir] = useState('desc');
  const [releaseEntries, setReleaseEntries] = useState(10);
  const [releasePage, setReleasePage] = useState(1);
  const [releaseConfirm, setReleaseConfirm] = useState(null);
  const [releaseLoading, setReleaseLoading] = useState(false);

  useEffect(() => {
    setApprovedForRelease([
      { id: 4, student_name: 'Ana Lopez', record_type: 'transcript', purpose: 'Further education', approved_at: '2026-02-25', status: 'approved' },
      { id: 5, student_id: 5, student_name: 'Carlos Mendoza', record_type: 'certificate', purpose: 'Employment', approved_at: '2026-02-24', status: 'approved' },
    ]);
  }, []);

  const handleReleaseClick = (row) => {
    setReleaseConfirm(row);
  };

  const onConfirmRelease = async () => {
    if (!releaseConfirm) return;
    setReleaseLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const { id, student_name, record_type } = releaseConfirm;
    setApprovedForRelease((prev) => prev.filter((r) => r.id !== id));
    setReleaseConfirm(null);
    setReleaseLoading(false);
    staffToast.success('Document released', `${student_name}'s ${record_type} has been released and recorded.`);
  };

  const toggleSort = (key) => {
    if (key === releaseSortKey) setReleaseSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setReleaseSortKey(key);
      setReleaseSortDir('asc');
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
        {releaseSortKey === sortKey ? (
          releaseSortDir === 'asc' ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />
        ) : (
          <span className="w-4 h-4 inline-block opacity-40"><FiChevronUp className="w-3 h-3" /></span>
        )}
      </button>
    </th>
  );

  const releaseFiltered = useMemo(() => {
    let list = approvedForRelease.filter((r) => {
      const matchSearch = !releaseSearch || [r.student_name, r.record_type, r.purpose].some((v) =>
        String(v || '').toLowerCase().includes(releaseSearch.toLowerCase())
      );
      const matchType = !releaseFilterType || r.record_type === releaseFilterType;
      return matchSearch && matchType;
    });
    return sortData(list, releaseSortKey, releaseSortDir);
  }, [approvedForRelease, releaseSearch, releaseFilterType, releaseSortKey, releaseSortDir]);

  const releasePaginated = useMemo(() => {
    const start = (releasePage - 1) * releaseEntries;
    return releaseFiltered.slice(start, start + releaseEntries);
  }, [releaseFiltered, releasePage, releaseEntries]);

  const releaseRecordTypes = useMemo(() => [...new Set(approvedForRelease.map((r) => r.record_type))], [approvedForRelease]);

  return (
    <>
      <section className="mb-6">
        <h2 className="m-0 text-2xl font-bold text-gray-800">Document Release</h2>
        <p className="mt-1 m-0 text-gray-600 text-sm">Release approved documents and record transactions.</p>
      </section>
      <section className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="mt-0 mb-2 text-lg font-semibold text-gray-800">Approved requests ready for release</h3>
          <p className="m-0 mb-4 text-sm text-gray-600">Click Release to record the transaction. Status will update to released.</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                value={releaseSearch}
                onChange={(e) => { setReleaseSearch(e.target.value); setReleasePage(1); }}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc"
                aria-label="Search document release"
              />
            </div>
            <select
              value={releaseFilterType}
              onChange={(e) => { setReleaseFilterType(e.target.value); setReleasePage(1); }}
              className="py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc"
              aria-label="Filter by record type"
            >
              <option value="">All record types</option>
              {releaseRecordTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={releaseEntries}
                onChange={(e) => { setReleaseEntries(Number(e.target.value)); setReleasePage(1); }}
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
                <SortableTh label="Approved" sortKey="approved_at" />
                <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {releasePaginated.length > 0 ? (
                releasePaginated.map((req) => (
                  <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                    <td className="py-3 px-4 text-gray-800">{req.student_name}</td>
                    <td className="py-3 px-4 text-gray-700">{req.record_type}</td>
                    <td className="py-3 px-4 text-gray-700">{req.purpose}</td>
                    <td className="py-3 px-4 text-gray-700">{req.approved_at}</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-sm bg-tmcc text-white hover:bg-tmcc-dark focus:ring-2 focus:ring-tmcc/30"
                        onClick={() => handleReleaseClick(req)}
                      >
                        <FiPackage /> Release
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-8 px-4 text-center text-gray-500 italic">No documents pending release.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {releaseFiltered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500">
            Showing {((releasePage - 1) * releaseEntries) + 1} to {Math.min(releasePage * releaseEntries, releaseFiltered.length)} of {releaseFiltered.length} entries
          </div>
        )}
      </section>

      <ConfirmDialog
        isOpen={!!releaseConfirm}
        onClose={() => !releaseLoading && setReleaseConfirm(null)}
        onConfirm={onConfirmRelease}
        title="Release document"
        message={
          releaseConfirm
            ? `Record the release of ${releaseConfirm.record_type} for ${releaseConfirm.student_name}? This will log the transaction.`
            : ''
        }
        confirmLabel="Release"
        cancelLabel="Cancel"
        variant="success"
        loading={releaseLoading}
      />
    </>
  );
};

export default StaffDocumentReleasePage;

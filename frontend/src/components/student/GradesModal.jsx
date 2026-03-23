import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { FiList, FiGrid, FiCheck } from 'react-icons/fi';
import { studentApi } from '../../lib/api/studentApi';

const VIEW_LIST = 'list';
const VIEW_TABLE = 'table';

const GradesModal = ({ isOpen, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState(VIEW_LIST);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    studentApi
      .getGrades()
      .then(setData)
      .catch((err) => setError(err?.parsedApiError?.message || 'Failed to load grades.'))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const grades = data?.grades ?? [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Grades" maxWidth="max-w-3xl">
      <div className="flex flex-col h-full">
        {!loading && !error && data && grades.length > 0 && (
          <div className="shrink-0 px-6 pt-2 pb-3 border-b border-gray-100">
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50/80 p-0.5">
              <button
                type="button"
                onClick={() => setView(VIEW_LIST)}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  view === VIEW_LIST
                    ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FiList className="w-4 h-4" />
                List View
              </button>
              <button
                type="button"
                onClick={() => setView(VIEW_TABLE)}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  view === VIEW_TABLE
                    ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FiGrid className="w-4 h-4" />
                Table View
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && <p className="text-gray-600">Loading...</p>}
          {error && (
            <p className="text-red-600 mb-4" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && data && (
            <>
              {grades.length === 0 ? (
                <p className="text-gray-500 italic">No grades on record.</p>
              ) : view === VIEW_LIST ? (
                /* List View — card-style entries */
                <ul className="space-y-0 divide-y divide-gray-100">
                  {grades.map((g) => (
                    <li key={g.id} className="py-4 first:pt-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {[g.subject?.code, g.subject?.title].filter(Boolean).join(' - ')}
                            {g.subject?.units != null && (
                              <span className="font-normal text-gray-600">
                                {' '}
                                ({Number(g.subject.units)} unit{g.subject.units !== 1 ? 's' : ''})
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {g.instructor_name ?? '—'}
                          </p>
                          <p className="text-sm text-gray-800 mt-1 font-medium">
                            {g.grade_value ?? '—'}
                          </p>
                        </div>
                        <span className="shrink-0 text-emerald-600" aria-hidden="true">
                          <FiCheck className="w-5 h-5" strokeWidth={2.5} />
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                /* Table View */
                <div className="overflow-x-auto -mx-6 px-6">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Code</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Description</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Units</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Grade</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Instructor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((g) => (
                        <tr key={g.id} className="border-b border-gray-100">
                          <td className="py-2.5 px-3 text-gray-800">{g.subject?.code ?? '—'}</td>
                          <td className="py-2.5 px-3 text-gray-800">{g.subject?.title ?? '—'}</td>
                          <td className="py-2.5 px-3 text-gray-800">
                            {g.subject?.units != null ? Number(g.subject.units) : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-gray-800 font-medium">
                            {g.grade_value ?? '—'}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-emerald-600" aria-hidden="true">
                              <FiCheck className="w-5 h-5 inline" strokeWidth={2.5} />
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-gray-700 uppercase">
                            {g.instructor_name ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with Close button */}
        <div className="shrink-0 flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GradesModal;

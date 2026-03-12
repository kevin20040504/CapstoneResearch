import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { studentApi } from '../../lib/api/studentApi';

const CurriculumModal = ({ isOpen, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    studentApi
      .getCurriculum()
      .then(setData)
      .catch((err) => setError(err?.parsedApiError?.message || 'Failed to load curriculum.'))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const program = data?.program;
  const curriculum = data?.curriculum ?? [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Curriculum" maxWidth="max-w-2xl">
      <div className="px-6 py-4">
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600 mb-4" role="alert">{error}</p>}
        {!loading && !error && data && (
          <>
            {program && (
              <div className="mb-4 pb-3 border-b border-gray-200">
                <p className="text-sm text-gray-600">{program.code}</p>
                <p className="font-semibold text-gray-800">{program.name}</p>
              </div>
            )}
            {!program && <p className="text-gray-500 italic mb-4">No program assigned.</p>}
            {curriculum.length === 0 ? (
              <p className="text-gray-500 italic">No curriculum on record.</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Year</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Semester</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Code</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Subject</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Units</th>
                  </tr>
                </thead>
                <tbody>
                  {curriculum.map((c) => (
                    <tr key={c.id} className="border-b border-gray-100">
                      <td className="py-2 px-3 text-gray-800">{c.year_level}</td>
                      <td className="py-2 px-3 text-gray-800">{c.semester}</td>
                      <td className="py-2 px-3 text-gray-800">{c.subject?.code}</td>
                      <td className="py-2 px-3 text-gray-800">{c.subject?.title}</td>
                      <td className="py-2 px-3 text-gray-700">{c.subject?.units ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default CurriculumModal;

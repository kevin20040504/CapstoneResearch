import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { studentApi } from '../../lib/api/studentApi';

const CORModal = ({ isOpen, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    studentApi
      .getCOR()
      .then(setData)
      .catch((err) => setError(err?.parsedApiError?.message || 'Failed to load COR.'))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const student = data?.student;
  const enrollments = data?.enrollments ?? [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Certificate of Registration (COR)" maxWidth="max-w-2xl">
      <div className="px-6 py-4">
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600 mb-4" role="alert">{error}</p>}
        {!loading && !error && data && (
          <>
            <div className="mb-4 pb-3 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                {data.academic_year} — {data.semester} Semester
              </p>
              {student && (
                <p className="font-semibold text-gray-800 mt-1">
                  {student.last_name}, {student.first_name} — {student.student_number}
                </p>
              )}
            </div>
            {enrollments.length === 0 ? (
              <p className="text-gray-500 italic">No enrolled subjects for this term.</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Code</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Subject</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Units</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e) => (
                    <tr key={e.id} className="border-b border-gray-100">
                      <td className="py-2 px-3 text-gray-800">{e.subject?.code}</td>
                      <td className="py-2 px-3 text-gray-800">{e.subject?.title}</td>
                      <td className="py-2 px-3 text-gray-700">{e.subject?.units ?? '—'}</td>
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

export default CORModal;

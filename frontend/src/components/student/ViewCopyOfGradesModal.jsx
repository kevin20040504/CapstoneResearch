import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { studentApi } from '../../lib/api/studentApi';

const ViewCopyOfGradesModal = ({ isOpen, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <Modal isOpen={isOpen} onClose={onClose} title="View Copy of Grades" maxWidth="max-w-2xl">
      <div className="px-6 py-4">
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600 mb-4" role="alert">{error}</p>}
        {!loading && !error && data && (
          <>
            <p className="text-sm text-gray-600 mb-4">This is a copy of your grades on record. For official documents, use Request Academic Record.</p>
            {grades.length === 0 ? (
              <p className="text-gray-500 italic">No grades on record.</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Academic Year</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Semester</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Code</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Subject</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Grade</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g) => (
                    <tr key={g.id} className="border-b border-gray-100">
                      <td className="py-2 px-3 text-gray-800">{g.academic_year}</td>
                      <td className="py-2 px-3 text-gray-800">{g.semester}</td>
                      <td className="py-2 px-3 text-gray-800">{g.subject?.code}</td>
                      <td className="py-2 px-3 text-gray-800">{g.subject?.title}</td>
                      <td className="py-2 px-3 text-gray-800 font-medium">{g.grade_value ?? '—'}</td>
                      <td className="py-2 px-3 text-gray-700">{g.remarks ?? '—'}</td>
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

export default ViewCopyOfGradesModal;

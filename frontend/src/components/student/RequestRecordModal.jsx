import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { studentApi } from '../../lib/api/studentApi';

const RECORD_TYPES = [
  { value: 'transcript', label: 'Official Transcript' },
  { value: 'certificate', label: 'Certificate of Enrollment' },
  { value: 'grade_report', label: 'Grade Report' },
  { value: 'certification', label: 'Certification' },
];

const PURPOSES = [
  { value: 'job-application', label: 'Job Application' },
  { value: 'scholarship', label: 'Scholarship' },
  { value: 'further-education', label: 'Further Education' },
  { value: 'professional-license', label: 'Professional License' },
  { value: 'other', label: 'Other' },
];

const RequestRecordModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    record_type: 'transcript',
    purpose: '',
    copies: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Math.max(1, Math.min(10, parseInt(value, 10) || 1)) : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.purpose) {
      setError('Please select a purpose.');
      return;
    }
    setSubmitting(true);
    try {
      await studentApi.createRecordRequest({
        record_type: formData.record_type,
        purpose: formData.purpose,
        copies: formData.copies,
      });
      onSuccess?.();
      setFormData({ record_type: 'transcript', purpose: '', copies: 1 });
      onClose();
    } catch (err) {
      setError(err?.parsedApiError?.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Academic Record" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="px-6 py-4">
        {error && <p className="text-red-600 mb-4 text-sm" role="alert">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
            <select
              name="record_type"
              value={formData.record_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc"
            >
              {RECORD_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose <span className="text-red-600">*</span></label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc"
            >
              <option value="">— Select Purpose —</option>
              {PURPOSES.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Copies</label>
            <input
              type="number"
              name="copies"
              min={1}
              max={10}
              value={formData.copies}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-lg text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="py-2 px-4 rounded-lg text-sm font-medium bg-tmcc text-white hover:bg-tmcc-dark disabled:opacity-70"
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RequestRecordModal;

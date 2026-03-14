import React, { useState, useEffect, useCallback } from 'react';
import { FiFileText, FiInfo, FiInbox, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { studentApi } from '../lib/api/studentApi';
import { parseApiError } from '../lib/api/errors';

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

const STATUS_LABELS = {
  pending: { label: 'Pending', icon: FiClock, class: 'sd-tag-yellow' },
  approved: { label: 'Approved', icon: FiCheckCircle, class: 'sd-tag-open' },
  rejected: { label: 'Rejected', icon: FiXCircle, class: 'sd-tag-closed' },
};

const formatDate = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? val : d.toLocaleString('en-PH', { dateStyle: 'short', timeStyle: 'short' });
};

const StudentRequestRecordPage = () => {
  const [formData, setFormData] = useState({
    record_type: 'transcript',
    purpose: '',
    copies: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await studentApi.getRecordRequests({ per_page: 50 });
      const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      setRequests(list);
    } catch (err) {
      const parsed = parseApiError(err);
      setLoadError(parsed.message || 'Failed to load your requests.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Math.max(1, Math.min(10, parseInt(value, 10) || 1)) : value,
    }));
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);
    if (!formData.purpose) {
      setFormError('Please select a purpose.');
      return;
    }
    setSubmitting(true);
    try {
      await studentApi.createRecordRequest({
        record_type: formData.record_type,
        purpose: formData.purpose,
        copies: formData.copies,
      });
      setFormSuccess(true);
      setFormData({ record_type: 'transcript', purpose: '', copies: 1 });
      fetchRequests();
      setTimeout(() => setFormSuccess(false), 5000);
    } catch (err) {
      setFormError(parseApiError(err)?.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="sd-content">
      <h2 className="sd-section-title sd-title-red">Request Record</h2>
      <p className="sd-filter-hint mb-6">
        <FiInfo className="sd-info-icon" />
        Submit a request for academic records (transcript, certificate, etc.). Staff at the Registrar&apos;s Office will review and process your request. You can track status below.
      </p>

      {/* New request form card – aligned with dashboard UI */}
      <div className="sd-enrollment-section mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">New Record Request</h3>
        <div className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 p-6 max-w-xl">
          {formSuccess && (
            <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm" role="alert">
              Your request has been submitted. The Registrar&apos;s Office will process it; you can see it in &quot;My Requests&quot; below.
            </div>
          )}
          {formError && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm" role="alert">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
              <select
                name="record_type"
                value={formData.record_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[rgb(0,166,82)]/20 focus:border-[rgb(0,166,82)]"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[rgb(0,166,82)]/20 focus:border-[rgb(0,166,82)]"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[rgb(0,166,82)]/20 focus:border-[rgb(0,166,82)]"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[rgb(0,166,82)] hover:bg-[rgb(0,140,70)] disabled:opacity-70 focus:ring-2 focus:ring-[rgb(0,166,82)]/30"
              >
                <FiFileText className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* My Requests – same card/table style as staff page */}
      <div className="sd-enrollment-section">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiInbox className="w-5 h-5" />
          My Requests
        </h3>
        {loadError && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm" role="alert">
            {loadError}
          </div>
        )}
        <div className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading your requests...</div>
          ) : requests.length === 0 ? (
            <div className="py-12 text-center text-gray-500 italic">No record requests yet. Submit one above.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Record Type</th>
                    <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Purpose</th>
                    <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Copies</th>
                    <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Status</th>
                    <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Requested</th>
                    <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Processed / Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => {
                    const statusMeta = STATUS_LABELS[req.status] || { label: req.status || '—', icon: FiInbox, class: '' };
                    const Icon = statusMeta.icon;
                    return (
                      <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                        <td className="py-3 px-4 text-gray-800">{req.record_type || '—'}</td>
                        <td className="py-3 px-4 text-gray-700">{req.purpose || '—'}</td>
                        <td className="py-3 px-4 text-gray-700">{req.copies ?? '—'}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${statusMeta.class}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{formatDate(req.requested_at)}</td>
                        <td className="py-3 px-4 text-gray-700">
                          {req.status === 'rejected' && req.rejection_reason
                            ? req.rejection_reason
                            : formatDate(req.processed_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Info aligned with thesis / ASRMS flow */}
      <div className="mt-8 p-4 rounded-lg bg-[#fffbeb] border border-[#fcd34d]">
        <h4 className="font-semibold text-gray-800 mb-2">Important</h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Requests are reviewed by the Registrar&apos;s Office (staff). You will see status here once processed.</li>
          <li>Approved requests proceed to document release; rejected requests may include a reason.</li>
          <li>For questions, contact the Registrar&apos;s Office at registrar@tmcc.edu.ph</li>
        </ul>
      </div>
    </section>
  );
};

export default StudentRequestRecordPage;

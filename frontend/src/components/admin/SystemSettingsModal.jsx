import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { adminToast } from '../../lib/notifications';

const SystemSettingsModal = ({ isOpen, onClose, initialSettings, onSuccess }) => {
  const [form, setForm] = useState({
    institutionName: '',
    institutionShortName: '',
    address: '',
    academicYear: '',
    semester: '',
    emailNotifications: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialSettings) {
      setForm({
        institutionName: initialSettings.institutionName || 'Trece Martires City College',
        institutionShortName: initialSettings.institutionShortName || 'TMCC',
        address: initialSettings.address || 'Trece Martires City, Cavite',
        academicYear: initialSettings.academicYear || '2025-2026',
        semester: initialSettings.semester || '2nd Semester',
        emailNotifications: initialSettings.emailNotifications ?? true,
      });
    }
  }, [initialSettings, isOpen]);

  const validate = () => {
    const err = {};
    if (!form.institutionName?.trim()) err.institutionName = 'Institution name is required.';
    if (!form.academicYear?.trim()) err.academicYear = 'Academic year is required.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    onClose();
    adminToast.success('Settings saved', 'System settings have been updated successfully.');
    onSuccess?.(form);
  };

  const inputBase = 'w-full py-2.5 px-4 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc';
  const inputError = 'border-red-500 bg-red-50';
  const inputNormal = 'border-gray-300';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="System Settings" titleId="system-settings-title" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="institution-name" className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
            <input
              id="institution-name"
              type="text"
              value={form.institutionName}
              onChange={(e) => setForm((f) => ({ ...f, institutionName: e.target.value }))}
              className={errors.institutionName ? `${inputBase} ${inputError}` : `${inputBase} ${inputNormal}`}
              placeholder="Trece Martires City College"
              aria-invalid={!!errors.institutionName}
            />
            {errors.institutionName && <p className="mt-1 text-xs text-red-600">{errors.institutionName}</p>}
          </div>
          <div>
            <label htmlFor="institution-short" className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
            <input
              id="institution-short"
              type="text"
              value={form.institutionShortName}
              onChange={(e) => setForm((f) => ({ ...f, institutionShortName: e.target.value }))}
              className={`${inputBase} ${inputNormal}`}
              placeholder="TMCC"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              id="address"
              type="text"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className={`${inputBase} ${inputNormal}`}
              placeholder="Trece Martires City, Cavite"
            />
          </div>
          <div>
            <label htmlFor="academic-year" className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
            <input
              id="academic-year"
              type="text"
              value={form.academicYear}
              onChange={(e) => setForm((f) => ({ ...f, academicYear: e.target.value }))}
              className={errors.academicYear ? `${inputBase} ${inputError}` : `${inputBase} ${inputNormal}`}
              placeholder="2025-2026"
              aria-invalid={!!errors.academicYear}
            />
            {errors.academicYear && <p className="mt-1 text-xs text-red-600">{errors.academicYear}</p>}
          </div>
          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select
              id="semester"
              value={form.semester}
              onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value }))}
              className={`${inputBase} ${inputNormal}`}
            >
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input
              id="email-notifications"
              type="checkbox"
              checked={form.emailNotifications}
              onChange={(e) => setForm((f) => ({ ...f, emailNotifications: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-tmcc focus:ring-tmcc/30"
            />
            <label htmlFor="email-notifications" className="text-sm font-medium text-gray-700">Enable email notifications</label>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button type="button" onClick={onClose} className="py-2.5 px-5 rounded-lg text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="py-2.5 px-5 rounded-lg text-sm font-medium bg-tmcc text-white hover:bg-tmcc-dark focus:ring-2 focus:ring-tmcc/30 disabled:opacity-70">
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SystemSettingsModal;

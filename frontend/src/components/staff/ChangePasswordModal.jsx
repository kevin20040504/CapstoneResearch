import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { staffToast } from '../../lib/notifications';

/**
 * Per thesis: same auth context; modal or dedicated route.
 */
const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const err = {};
    if (!currentPassword.trim()) err.currentPassword = 'Current password is required.';
    if (!newPassword.trim()) err.newPassword = 'New password is required.';
    else if (newPassword.length < 8) err.newPassword = 'New password must be at least 8 characters.';
    if (newPassword !== confirmPassword) err.confirmPassword = 'Passwords do not match.';
    if (currentPassword && newPassword && currentPassword === newPassword) err.newPassword = 'New password must differ from current.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    setLoading(true);
    // UI only — simulate success
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
    staffToast.success('Password updated', 'Your password has been changed successfully.');
  };

  const inputBase = 'w-full py-2.5 px-4 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc';
  const inputError = 'border-red-500 bg-red-50';
  const inputNormal = 'border-gray-300';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password" titleId="change-password-title" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
              Current password
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={errors.currentPassword ? `${inputBase} ${inputError}` : `${inputBase} ${inputNormal}`}
              autoComplete="current-password"
              aria-invalid={!!errors.currentPassword}
            />
            {errors.currentPassword && <p className="mt-1 text-xs text-red-600">{errors.currentPassword}</p>}
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={errors.newPassword ? `${inputBase} ${inputError}` : `${inputBase} ${inputNormal}`}
              autoComplete="new-password"
              aria-invalid={!!errors.newPassword}
            />
            {errors.newPassword && <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>}
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={errors.confirmPassword ? `${inputBase} ${inputError}` : `${inputBase} ${inputNormal}`}
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-lg text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-5 rounded-lg text-sm font-medium bg-tmcc text-white hover:bg-tmcc-dark focus:outline-none focus:ring-2 focus:ring-tmcc/30 disabled:opacity-70"
          >
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;

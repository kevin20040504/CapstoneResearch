import React from 'react';
import Modal from './Modal';

/**
 * Confirmation dialog for Approve, Reject, Release, Delete, etc.
 * variant: 'danger' | 'success' | 'warning' | 'neutral'
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'neutral',
  loading = false,
}) => {
  const variantStyles = {
    danger: 'bg-staff-red hover:bg-red-700 focus:ring-red-500/30 text-white',
    success: 'bg-tmcc hover:bg-tmcc-dark focus:ring-tmcc/30 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500/30 text-white',
    neutral: 'bg-gray-700 hover:bg-gray-800 focus:ring-gray-500/30 text-white',
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} titleId="confirm-dialog-title" maxWidth="max-w-md" closeOnBackdrop={!loading}>
      <div className="px-6 py-5">
        <p id="confirm-dialog-desc" className="m-0 text-gray-700">
          {message}
        </p>
        <div className="flex flex-wrap gap-3 mt-6 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="py-2.5 px-5 rounded-lg text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-70 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`py-2.5 px-5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 disabled:opacity-70 transition-colors ${variantStyles[variant]}`}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

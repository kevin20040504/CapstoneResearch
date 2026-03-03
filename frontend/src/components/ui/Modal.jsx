import React, { useEffect, useCallback, useRef } from 'react';
import { FiX } from 'react-icons/fi';

/**
 * Reusable modal shell: backdrop, panel, close button, optional title.
 */
const Modal = ({ isOpen, onClose, title, titleId, children, maxWidth = 'max-w-lg', closeOnBackdrop = true }) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
      if (previousActiveElement.current?.focus) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      ref={modalRef}
    >
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between shrink-0 px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 id={titleId} className="m-0 text-lg font-bold text-gray-800">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-tmcc/30 transition-colors"
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

import React from 'react';
import Modal from '../ui/Modal';
import { FiUser, FiMail, FiShield, FiCalendar } from 'react-icons/fi';

const ViewUserModal = ({ isOpen, onClose, user, onEdit }) => {
  if (!user) return null;

  const roleBadgeClass = {
    admin: 'bg-green-100 text-tmcc',
    staff: 'bg-amber-100 text-amber-800',
    student: 'bg-blue-100 text-blue-800',
  }[user.role] || 'bg-gray-100 text-gray-800';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" titleId="view-user-title" maxWidth="max-w-md">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <FiUser className="w-7 h-7 text-tmcc" />
          </div>
          <div>
            <h3 className="m-0 text-lg font-semibold text-gray-800">{user.name}</h3>
            <span className={`inline-block mt-1 py-1 px-2.5 rounded-full text-xs font-medium ${roleBadgeClass}`}>
              {user.role}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <FiUser className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <p className="m-0 text-xs text-gray-500">Username</p>
              <p className="m-0 text-sm font-medium text-gray-800">{user.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiMail className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <p className="m-0 text-xs text-gray-500">Email</p>
              <p className="m-0 text-sm font-medium text-gray-800">{user.email}</p>
            </div>
          </div>
          {user.department && (
            <div className="flex items-center gap-3">
              <FiShield className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="m-0 text-xs text-gray-500">Department</p>
                <p className="m-0 text-sm font-medium text-gray-800">{user.department}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <FiCalendar className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <p className="m-0 text-xs text-gray-500">Last login</p>
              <p className="m-0 text-sm font-medium text-gray-800">{user.lastLogin || '—'}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => { onClose(); onEdit?.(user); }}
            className="py-2.5 px-5 rounded-lg text-sm font-medium bg-tmcc text-white hover:bg-tmcc-dark"
          >
            Edit User
          </button>
          <button type="button" onClick={onClose} className="py-2.5 px-5 rounded-lg text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewUserModal;

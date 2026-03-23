import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { adminToast } from '../../lib/notifications';
import { parseApiError } from '../../lib/api/errors';
import { adminApi } from '../../lib/api/adminApi';

const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'staff', label: 'Staff' },
  { value: 'admin', label: 'Admin' },
];

const EditUserModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'staff',
    department: '',
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'staff',
        department: user.department || '',
        status: user.status || 'active',
      });
    }
  }, [user]);

  const validate = () => {
    const err = {};
    if (!form.name?.trim()) err.name = 'Name is required.';
    if (!form.email?.trim()) err.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Invalid email format.';
    if (['staff', 'admin'].includes(form.role) && !form.department?.trim()) {
      err.department = 'Department is required for staff/admin.';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    setLoading(true);
    try {
      await adminApi.updateUser(user.id, {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        department: ['staff', 'admin'].includes(form.role) ? form.department?.trim() || null : null,
        status: form.status,
      });
      onClose();
      adminToast.success('User updated', `${form.name} has been updated successfully.`);
      onSuccess?.();
    } catch (err) {
      const parsed = parseApiError(err);
      if (parsed.errors) {
        const next = {};
        Object.entries(parsed.errors).forEach(([k, msgs]) => {
          next[k] = Array.isArray(msgs) ? msgs[0] : String(msgs);
        });
        setErrors(next);
      } else {
        adminToast.error('Could not update user', parsed.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'w-full py-2.5 px-4 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc';
  const inputError = 'border-red-500 bg-red-50';
  const inputNormal = 'border-gray-300';

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User" titleId="edit-user-title" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="edit-user-name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              id="edit-user-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={errors.name ? `${inputBase} ${inputError}` : `${inputBase} ${inputNormal}`}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <p className="py-2 text-gray-600 text-sm">{user.username}</p>
          </div>
          <div>
            <label htmlFor="edit-user-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="edit-user-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={errors.email ? `${inputBase} ${inputError}` : `${inputBase} ${inputNormal}`}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="edit-user-role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              id="edit-user-role"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className={`${inputBase} ${inputNormal}`}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          {['staff', 'admin'].includes(form.role) && (
            <div>
              <label htmlFor="edit-user-department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                id="edit-user-department"
                type="text"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                className={errors.department ? `${inputBase} ${inputError}` : `${inputBase} ${inputNormal}`}
                placeholder="Registrar's Office"
                aria-invalid={!!errors.department}
              />
              {errors.department && <p className="mt-1 text-xs text-red-600">{errors.department}</p>}
            </div>
          )}
          <div>
            <label htmlFor="edit-user-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="edit-user-status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className={`${inputBase} ${inputNormal}`}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button type="button" onClick={onClose} className="py-2.5 px-5 rounded-lg text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="py-2.5 px-5 rounded-lg text-sm font-medium bg-tmcc text-white hover:bg-tmcc-dark focus:ring-2 focus:ring-tmcc/30 disabled:opacity-70">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;

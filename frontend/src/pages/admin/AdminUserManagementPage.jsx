import React, { useState, useEffect, useMemo } from 'react';
import { FiUserPlus, FiSearch, FiEye, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import CreateUserModal from '../../components/admin/CreateUserModal';
import EditUserModal from '../../components/admin/EditUserModal';
import ViewUserModal from '../../components/admin/ViewUserModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { adminToast } from '../../lib/notifications';

const ENTRIES_OPTIONS = [5, 10, 25, 50];

const MOCK_USERS = [
  { id: 1, name: 'Admin User', username: 'admin', email: 'admin@tmcc.edu.ph', role: 'admin', department: 'Registrar', status: 'active', lastLogin: '2026-03-02 09:15' },
  { id: 2, name: 'Jane Registrar', username: 'jane.registrar', email: 'jane@tmcc.edu.ph', role: 'staff', department: 'Registrar', status: 'active', lastLogin: '2026-03-02 08:45' },
];

const sortData = (data, key, dir) => {
  if (!data.length) return data;
  const mult = dir === 'asc' ? 1 : -1;
  return [...data].sort((a, b) => {
    let va = a[key];
    let vb = b[key];
    if (typeof va === 'string') va = (va || '').toLowerCase();
    if (typeof vb === 'string') vb = (vb || '').toLowerCase();
    if (va < vb) return -1 * mult;
    if (va > vb) return 1 * mult;
    return 0;
  });
};

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setUsers(MOCK_USERS);
  }, []);

  const toggleSort = (key) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortableTh = ({ label, sortKey: sk }) => (
    <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">
      <button type="button" className="flex items-center gap-1 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-tmcc/30 rounded" onClick={() => toggleSort(sk)}>
        {label}
        {sortKey === sk ? (sortDir === 'asc' ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />) : <span className="w-4 h-4 inline-block opacity-40"><FiChevronUp className="w-3 h-3" /></span>}
      </button>
    </th>
  );

  const filtered = useMemo(() => {
    let list = users
      .filter((u) => u.role === 'admin' || u.role === 'staff')
      .filter((u) => {
        const matchSearch = !search || [u.name, u.username, u.email].some((v) => String(v || '').toLowerCase().includes(search.toLowerCase()));
        const matchRole = !filterRole || u.role === filterRole;
        return matchSearch && matchRole;
      });
    return sortData(list, sortKey, sortDir);
  }, [users, search, filterRole, sortKey, sortDir]);

  const paginated = useMemo(() => {
    const start = (page - 1) * entries;
    return filtered.slice(start, start + entries);
  }, [filtered, page, entries]);

  const handleDeleteConfirm = async () => {
    if (!deleteUser) return;
    setDeleteLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
    setDeleteUser(null);
    setDeleteLoading(false);
    adminToast.warning('User deleted', `${deleteUser.name} has been removed from the system.`);
  };

  const roleBadge = (role) => {
    const c = { admin: 'bg-green-100 text-tmcc', staff: 'bg-amber-100 text-amber-800', student: 'bg-blue-100 text-blue-800' }[role] || 'bg-gray-100 text-gray-800';
    return <span className={`inline-block py-1 px-2.5 rounded-full text-xs font-medium ${c}`}>{role}</span>;
  };

  return (
    <>
      <section className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="m-0 text-2xl font-bold text-gray-800">User Management</h2>
          <p className="mt-1 m-0 text-gray-600 text-sm">Create, edit, and manage staff and admin accounts.</p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium bg-tmcc text-white hover:bg-tmcc-dark shadow-sm"
        >
          <FiUserPlus /> Add User
        </button>
      </section>

      <section className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search by name, username, or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc"
                aria-label="Search users"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
              className="py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tmcc/20 focus:border-tmcc"
              aria-label="Filter by role"
            >
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select value={entries} onChange={(e) => { setEntries(Number(e.target.value)); setPage(1); }} className="py-1.5 px-2 border border-gray-300 rounded text-sm">
                {ENTRIES_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <span>entries</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <SortableTh label="Name" sortKey="name" />
                <SortableTh label="Username" sortKey="username" />
                <SortableTh label="Role" sortKey="role" />
                <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Status</th>
                <th className="py-3 px-4 text-left border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? (
                paginated.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                    <td className="py-3 px-4 text-gray-800">{u.name}</td>
                    <td className="py-3 px-4 text-gray-700">{u.username}</td>
                    <td className="py-3 px-4">{roleBadge(u.role)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block py-1 px-2.5 rounded-full text-xs font-medium ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setViewUser(u)} className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-sm bg-tmcc text-white hover:bg-tmcc-dark" aria-label={`View ${u.name}`}><FiEye /> View</button>
                        <button type="button" onClick={() => setEditUser(u)} className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-sm bg-amber-600 text-white hover:bg-amber-700" aria-label={`Edit ${u.name}`}><FiEdit2 /> Edit</button>
                        <button type="button" onClick={() => setDeleteUser(u)} className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-sm bg-staff-red text-white hover:opacity-90" aria-label={`Delete ${u.name}`}><FiTrash2 /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-8 px-4 text-center text-gray-500 italic">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500">
            Showing {((page - 1) * entries) + 1} to {Math.min(page * entries, filtered.length)} of {filtered.length} entries
          </div>
        )}
      </section>

      <CreateUserModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onSuccess={() => setUsers((prev) => [...prev, { id: Date.now(), name: 'New User', username: 'newuser', email: 'new@tmcc.edu.ph', role: 'staff', department: 'Registrar', status: 'active', lastLogin: '—' }])} />
      <EditUserModal isOpen={!!editUser} onClose={() => setEditUser(null)} user={editUser} onSuccess={() => setEditUser(null)} />
      <ViewUserModal isOpen={!!viewUser} onClose={() => setViewUser(null)} user={viewUser} onEdit={(u) => { setViewUser(null); setEditUser(u); }} />
      <ConfirmDialog
        isOpen={!!deleteUser}
        onClose={() => !deleteLoading && setDeleteUser(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete user"
        message={deleteUser ? `Permanently delete ${deleteUser.name}? This action cannot be undone.` : ''}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleteLoading}
      />
    </>
  );
};

export default AdminUserManagementPage;

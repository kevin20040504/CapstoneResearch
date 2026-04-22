import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiSettings, FiHome, FiMapPin, FiCalendar, FiMail } from 'react-icons/fi';
import SystemSettingsModal from '../../components/admin/SystemSettingsModal';
import { adminApi } from '../../lib/api/adminApi';
import { queryKeys } from '../../lib/react-query/queryKeys';
import { adminToast } from '../../lib/notifications';
import { mapFormToApiPayload, mapSettingsToForm } from '../../features/admin/systemSettings';

const AdminSystemSettingsPage = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const settingsQuery = useQuery({
    queryKey: queryKeys.admin.settings(),
    queryFn: async () => {
      const res = await adminApi.getSettings();
      return mapSettingsToForm(res.settings);
    },
  });

  const settings = settingsQuery.data;

  const updateMutation = useMutation({
    mutationFn: (form) => adminApi.updateSettings(mapFormToApiPayload(form)),
    onSuccess: (res) => {
      queryClient.setQueryData(queryKeys.admin.settings(), mapSettingsToForm(res.settings));
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.currentTerm() });
      window.dispatchEvent(new CustomEvent('system-settings-updated'));
      adminToast.success('Settings saved', 'System settings have been updated successfully.');
      setModalOpen(false);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.apiMessage || 'Could not save settings.';
      adminToast.error('Save failed', msg);
    },
  });

  const handleModalSave = (form) => updateMutation.mutateAsync(form);

  return (
    <>
      <section className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="m-0 text-2xl font-bold text-gray-800">System Settings</h2>
          <p className="mt-1 m-0 text-gray-600 text-sm">Manage institution configuration and system preferences.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          disabled={settingsQuery.isLoading || settingsQuery.isError}
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium bg-tmcc text-white hover:bg-tmcc-dark shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FiSettings /> Edit Settings
        </button>
      </section>

      {settingsQuery.isError && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm" role="alert">
          {settingsQuery.error?.apiMessage || settingsQuery.error?.message || 'Failed to load system settings.'}
        </div>
      )}

      <section className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="mt-0 mb-2 text-lg font-semibold text-gray-800">Current Configuration</h3>
          <p className="m-0 text-sm text-gray-500">Read-only view. Click Edit Settings to modify.</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsQuery.isLoading && (
            <p className="m-0 text-gray-600 col-span-full">Loading settings…</p>
          )}
          {!settingsQuery.isLoading && settings && (
            <>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-tmcc shrink-0">
                  <FiHome className="w-5 h-5" />
                </span>
                <div>
                  <p className="m-0 text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</p>
                  <p className="m-0 mt-1 font-semibold text-gray-800">{settings.institutionName || '—'}</p>
                  <p className="m-0 text-sm text-gray-600">{settings.institutionShortName || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-tmcc shrink-0">
                  <FiMapPin className="w-5 h-5" />
                </span>
                <div>
                  <p className="m-0 text-xs font-medium text-gray-500 uppercase tracking-wider">Address</p>
                  <p className="m-0 mt-1 text-gray-800">{settings.address || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-tmcc shrink-0">
                  <FiCalendar className="w-5 h-5" />
                </span>
                <div>
                  <p className="m-0 text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</p>
                  <p className="m-0 mt-1 text-gray-800">{settings.academicYear || '—'}</p>
                  <p className="m-0 text-sm text-gray-600">{settings.semester || '—'}</p>
                </div>
              </div>
              {/* <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-tmcc shrink-0">
                  <FiMail className="w-5 h-5" />
                </span>
                <div>
                  <p className="m-0 text-xs font-medium text-gray-500 uppercase tracking-wider">Email Notifications</p>
                  <p className="m-0 mt-1 text-gray-800">{settings.emailNotifications ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div> */}
            </>
          )}
        </div>
      </section>

      <SystemSettingsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialSettings={settings}
        onSave={handleModalSave}
        saveLoading={updateMutation.isPending}
      />
    </>
  );
};

export default AdminSystemSettingsPage;

import React from 'react';
import { studentApi } from '../lib/api/studentApi';

const normalize = (v) => (v ?? '').toString().trim();

const StudentSISPage = () => {
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const [sisInput, setSisInput] = React.useState('');
  const [sisVerified, setSisVerified] = React.useState(false);

  const [saving, setSaving] = React.useState(false);
  const [saveMsg, setSaveMsg] = React.useState('');

  const student = profile?.student;
  const studentNumber = student?.student_number || '';

  const [form, setForm] = React.useState({
    contact_number: '',
    address: '',
    place_of_birth: '',
    sex: '',
    guardian_name: '',
    citizenship: '',
    elementary_school: '',
    elementary_year: '',
    high_school: '',
    high_school_year: '',
    previous_school: '',
    previous_course: '',
  });

  React.useEffect(() => {
    setLoading(true);
    studentApi.getProfile()
      .then((data) => {
        setProfile(data);
        const s = data?.student || {};
        setForm((prev) => ({
          ...prev,
          contact_number: s.contact_number || '',
          address: s.address || '',
          place_of_birth: s.place_of_birth || '',
          sex: s.sex || '',
          guardian_name: s.guardian_name || '',
          citizenship: s.citizenship || '',
          elementary_school: s.elementary_school || '',
          elementary_year: s.elementary_year ?? '',
          high_school: s.high_school || '',
          high_school_year: s.high_school_year ?? '',
          previous_school: s.previous_school || '',
          previous_course: s.previous_course || '',
        }));
      })
      .catch(() => {
        setError('Failed to load student profile.');
        setProfile(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setSaveMsg('');
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');
    setSaveMsg('');

    if (!studentNumber) {
      setError('Student number not found in your profile.');
      return;
    }

    if (normalize(sisInput).toLowerCase() !== normalize(studentNumber).toLowerCase()) {
      setError('SIS does not match your student number.');
      setSisVerified(false);
      return;
    }

    setSisVerified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaveMsg('');

    if (!sisVerified) {
      setError('Please verify your SIS first.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        elementary_year: form.elementary_year === '' ? null : Number(form.elementary_year),
        high_school_year: form.high_school_year === '' ? null : Number(form.high_school_year),
      };
      const res = await studentApi.updateSIS(payload);
      setSaveMsg(res?.message || 'Saved.');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to save SIS.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="sd-content">
        <div className="sd-enrollment-section">
          <h2 className="sd-section-title sd-title-red">Student Information Sheet (SIS)</h2>
          <p className="text-gray-600">Loading…</p>
        </div>
      </section>
    );
  }

  const fullName = student
    ? `${(student.last_name || '').toUpperCase()}, ${(student.first_name || '').toUpperCase()} ${student.middle_name ? student.middle_name.toUpperCase() : ''}`.trim()
    : '—';

  return (
    <section className="sd-content">
      <div className="sd-enrollment-section">
        <h2 className="sd-section-title sd-title-red">Student Information Sheet (SIS) / SIUF</h2>
        <p className="sd-filter-hint">
          Enter your <strong>SIS (Student Number)</strong> to unlock and update the fields required by the Registrar.
        </p>

        {(error || saveMsg) && (
          <div
            className={`mx-0 mt-3 p-3 rounded-lg border text-sm ${error ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}
            role="alert"
          >
            {error || saveMsg}
          </div>
        )}

        <form onSubmit={handleVerify} className="mt-4">
          <div className="sd-cards-row" style={{ gap: 12, alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label className="block text-sm font-semibold mb-1">SIS (Student Number)</label>
              <input
                type="text"
                value={sisInput}
                onChange={(e) => setSisInput(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Enter your SIS / student number"
                autoComplete="off"
              />
              <p className="text-xs text-gray-500 mt-1">Your student number: <strong>{studentNumber || '—'}</strong></p>
            </div>
            <button
              type="submit"
              className="sd-quick-link"
              style={{ width: 200, justifyContent: 'center' }}
              disabled={!sisInput}
            >
              {sisVerified ? 'Verified' : 'Verify SIS'}
            </button>
          </div>
        </form>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="sd-enrollment-section">
          <h3 className="sd-section-title sd-title-red" style={{ fontSize: 18 }}>Personal Information</h3>

          <div className="sd-cards-row" style={{ gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="block text-sm font-semibold mb-1">Student Name</label>
              <input
                type="text"
                value={fullName}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
                readOnly
              />
            </div>
            <div style={{ width: 260 }}>
              <label className="block text-sm font-semibold mb-1">Date of Birth</label>
              <input
                type="text"
                value={student?.date_of_birth || ''}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
                readOnly
              />
            </div>
          </div>

          <div className="sd-cards-row" style={{ gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="block text-sm font-semibold mb-1">Address</label>
              <input
                name="address"
                type="text"
                value={form.address}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={!sisVerified}
              />
            </div>
            <div style={{ width: 280 }}>
              <label className="block text-sm font-semibold mb-1">Place of Birth</label>
              <input
                name="place_of_birth"
                type="text"
                value={form.place_of_birth}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={!sisVerified}
              />
            </div>
          </div>

          <div className="sd-cards-row" style={{ gap: 12 }}>
            <div style={{ width: 220 }}>
              <label className="block text-sm font-semibold mb-1">Sex</label>
              <select
                name="sex"
                value={form.sex}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={!sisVerified}
              >
                <option value="">Select…</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="block text-sm font-semibold mb-1">Name of Guardian</label>
              <input
                name="guardian_name"
                type="text"
                value={form.guardian_name}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={!sisVerified}
              />
            </div>
            <div style={{ width: 260 }}>
              <label className="block text-sm font-semibold mb-1">Citizenship</label>
              <input
                name="citizenship"
                type="text"
                value={form.citizenship}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={!sisVerified}
              />
            </div>
          </div>

          <div className="sd-cards-row" style={{ gap: 12 }}>
            <div style={{ width: 260 }}>
              <label className="block text-sm font-semibold mb-1">Contact Number</label>
              <input
                name="contact_number"
                type="text"
                value={form.contact_number}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={!sisVerified}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="text"
                value={student?.email || ''}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="sd-enrollment-section mt-6">
          <h3 className="sd-section-title sd-title-red" style={{ fontSize: 18 }}>Entrance Data</h3>

          <div className="sd-cards-row" style={{ gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="block text-sm font-semibold mb-1">Elementary School</label>
              <input
                name="elementary_school"
                type="text"
                value={form.elementary_school}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={!sisVerified}
              />
            </div>
            <div style={{ width: 160 }}>
              <label className="block text-sm font-semibold mb-1">Year</label>
              <input
                name="elementary_year"
                type="number"
                value={form.elementary_year}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={!sisVerified}
                min={1900}
                max={2100}
              />
            </div>
          </div>

          <div className="sd-cards-row" style={{ gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="block text-sm font-semibold mb-1">High School</label>
              <input
                name="high_school"
                type="text"
                value={form.high_school}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={!sisVerified}
              />
            </div>
            <div style={{ width: 160 }}>
              <label className="block text-sm font-semibold mb-1">Year</label>
              <input
                name="high_school_year"
                type="number"
                value={form.high_school_year}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={!sisVerified}
                min={1900}
                max={2100}
              />
            </div>
          </div>

          <div className="sd-cards-row" style={{ gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="block text-sm font-semibold mb-1">Previous School</label>
              <input
                name="previous_school"
                type="text"
                value={form.previous_school}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={!sisVerified}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="block text-sm font-semibold mb-1">Previous Course</label>
              <input
                name="previous_course"
                type="text"
                value={form.previous_course}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={!sisVerified}
              />
            </div>
          </div>

          <div className="sd-cards-row" style={{ justifyContent: 'flex-end', marginTop: 14 }}>
            <button
              type="submit"
              className="sd-quick-link"
              style={{ width: 220, justifyContent: 'center', opacity: sisVerified ? 1 : 0.6, pointerEvents: sisVerified ? 'auto' : 'none' }}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save SIS'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default StudentSISPage;


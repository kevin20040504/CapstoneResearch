import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StudentSignup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(''); // 'student' or 'admin'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    studentId: '',
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: '',
    course: '',
    yearLevel: '',
    department: '',
    position: '',
    contactNumber: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const courses = [
    'BS Information Technology',
    'BS Computer Science',
    'BS Business Administration',
    'BS Criminology',
    'BS Education',
    'BS Customs Administration',
    'BS Public Administration',
    'BS Accountancy',
  ];

  const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const departments = [
    'Registrar',
    'College of Information Technology',
    'College of Business Administration',
    'College of Criminal Justice Education',
    'College of Education',
    'College of Governance',
    'Administration',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError('Please select whether you are signing up as a Student or Admin.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    console.log(`Signing up as ${role}:`, { role, ...formData });

    // TODO: call backend API
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1200);
  };

  const isStudent = role === 'student';
  const isAdmin = role === 'admin';

  return (
    <div
      className="signup-page"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/campus-bg.jpg)`,
      }}
    >
      <div className="signup-overlay"></div>

      <div className="signup-container">
        {/* Header */}
        <div className="signup-header">
          <img
            src="/tmcc-logo.png"
            alt="TMCC Logo"
            className="signup-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="signup-header-text">
            <h2>TRECE MARTIRES CITY COLLEGE</h2>
            <p>Student Records Management System</p>
            <h3>{isAdmin ? 'Admin Registration' : isStudent ? 'Student Registration' : 'Create Account'}</h3>
          </div>
        </div>

        {/* Role Selector */}
        <div className="signup-role-selector">
          <p className="signup-role-label">I am signing up as:</p>
          <div className="signup-role-options">
            <button
              type="button"
              className={`signup-role-btn ${isStudent ? 'active' : ''}`}
              onClick={() => { setRole('student'); setError(''); }}
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span className="signup-role-title">Student</span>
              <span className="signup-role-desc">Access your records, request documents</span>
            </button>
            <button
              type="button"
              className={`signup-role-btn ${isAdmin ? 'active admin' : ''}`}
              onClick={() => { setRole('admin'); setError(''); }}
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span className="signup-role-title">Admin / Registrar</span>
              <span className="signup-role-desc">Manage students, approve requests</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && <div className="signup-error">{error}</div>}

        {/* Form - only show after role is selected */}
        {role && (
          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="signup-section">
              <h4>Personal Information</h4>
              <div className="signup-row">
                <div className="signup-field">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Juan"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="signup-field">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Dela Cruz"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="signup-row">
                <div className="signup-field">
                  <label htmlFor="middleName">Middle Name</label>
                  <input
                    id="middleName"
                    name="middleName"
                    type="text"
                    placeholder="Santos"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </div>
                <div className="signup-field">
                  <label htmlFor="contactNumber">Contact Number *</label>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    placeholder="09XX XXX XXXX"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="signup-field full-width">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Trece Martires City, Cavite"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Student-specific: Academic Information */}
            {isStudent && (
              <div className="signup-section">
                <h4>Academic Information</h4>
                <div className="signup-row">
                  <div className="signup-field">
                    <label htmlFor="studentId">Student ID *</label>
                    <input
                      id="studentId"
                      name="studentId"
                      type="text"
                      placeholder="2024-00001"
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="signup-field">
                    <label htmlFor="course">Course / Program *</label>
                    <select
                      id="course"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Course</option>
                      {courses.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="signup-row">
                  <div className="signup-field">
                    <label htmlFor="yearLevel">Year Level *</label>
                    <select
                      id="yearLevel"
                      name="yearLevel"
                      value={formData.yearLevel}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Year Level</option>
                      {yearLevels.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div className="signup-field"></div>
                </div>
              </div>
            )}

            {/* Admin-specific: Department Information */}
            {isAdmin && (
              <div className="signup-section">
                <h4>Department Information</h4>
                <div className="signup-row">
                  <div className="signup-field">
                    <label htmlFor="employeeId">Employee ID *</label>
                    <input
                      id="employeeId"
                      name="employeeId"
                      type="text"
                      placeholder="EMP-2024-001"
                      value={formData.employeeId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="signup-field">
                    <label htmlFor="department">Department *</label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="signup-row">
                  <div className="signup-field">
                    <label htmlFor="position">Position / Role *</label>
                    <input
                      id="position"
                      name="position"
                      type="text"
                      placeholder="Registrar Staff"
                      value={formData.position}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="signup-field"></div>
                </div>
              </div>
            )}

            {/* Account Credentials */}
            <div className="signup-section">
              <h4>Account Credentials</h4>
              <div className="signup-field full-width">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={isAdmin ? 'admin@tmcc.edu.ph' : 'juan.delacruz@tmcc.edu.ph'}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="signup-row">
                <div className="signup-field">
                  <label htmlFor="password">Password *</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="signup-field">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="signup-submit" disabled={loading}>
              {loading
                ? 'Creating Account...'
                : isAdmin
                  ? 'Create Admin Account'
                  : 'Create Student Account'}
            </button>

            <p className="signup-login-link">
              Already have an account? <Link to="/">Log in here</Link>
            </p>
          </form>
        )}

        {/* Show login link even before role is selected */}
        {!role && (
          <p className="signup-login-link" style={{ marginTop: '1.5rem' }}>
            Already have an account? <Link to="/">Log in here</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentSignup;

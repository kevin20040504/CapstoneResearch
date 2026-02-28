import React, { useState } from 'react';

const RecordRequest = () => {
  const [formData, setFormData] = useState({
    recordType: 'transcript',
    purpose: '',
    copies: 1,
    urgent: false
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call API to submit request
    console.log('Submitting:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="request-page">
      <div className="container">
        <h2>Request Student Record</h2>
        <p>Fill out the form below to request academic records, transcripts, or certificates.</p>

        {submitted && (
          <div className="alert alert-success">
            Your request has been submitted successfully! You will receive an email confirmation.
          </div>
        )}

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Record Type</label>
              <select
                name="recordType"
                value={formData.recordType}
                onChange={handleChange}
              >
                <option value="transcript">Official Transcript</option>
                <option value="certificate">Certificate of Enrollment</option>
                <option value="diploma">Diploma Copy</option>
                <option value="clearance">Clearance</option>
              </select>
            </div>

            <div className="form-group">
              <label>Purpose of Request</label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Purpose --</option>
                <option value="job-application">Job Application</option>
                <option value="scholarship">Scholarship</option>
                <option value="further-education">Further Education</option>
                <option value="professional-license">Professional License</option>
                <option value="loan-application">Loan Application</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Number of Copies</label>
                <input
                  type="number"
                  name="copies"
                  value={formData.copies}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                />
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="urgent"
                  name="urgent"
                  checked={formData.urgent}
                  onChange={handleChange}
                />
                <label htmlFor="urgent">Rush Processing (Additional ₱200)</label>
              </div>
            </div>

            <div className="form-section">
              <h4>Estimated Processing Time</h4>
              <p>
                {formData.urgent 
                  ? '24-48 hours (Rush processing)' 
                  : '3-5 business days (Standard)'}
              </p>
            </div>

            <div className="form-section">
              <h4>Fees</h4>
              <div className="fee-breakdown">
                <div className="fee-item">
                  <span>Per Copy: ₱50</span>
                  <span>₱{50 * formData.copies}</span>
                </div>
                {formData.urgent && (
                  <div className="fee-item">
                    <span>Rush Processing</span>
                    <span>₱200</span>
                  </div>
                )}
                <div className="fee-item total">
                  <strong>Total</strong>
                  <strong>₱{(50 * formData.copies) + (formData.urgent ? 200 : 0)}</strong>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary">Submit Request</button>
            </div>
          </form>
        </div>

        <div className="info-section">
          <h3>Important Information</h3>
          <ul>
            <li>All requests must be submitted at least 3 days before the deadline.</li>
            <li>Payment must be made at the Cashier's Office.</li>
            <li>Records will only be released to the requesting student or authorized representative.</li>
            <li>For more information, contact the Registrar's Office at registrar@tmcc.edu.ph</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecordRequest;

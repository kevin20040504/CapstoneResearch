import { apiClient } from './client';

/**
 * Staff dashboard API — for record requests, student lookup, document release, reports.
 * All endpoints require auth:sanctum and staff/admin role on backend.
 */
export const staffApi = {
  getPendingRequests: async (params = {}) => {
    const { data } = await apiClient.get('/staff/pending-requests', { params });
    return data;
  },

  getApprovedRequests: async (params = {}) => {
    const { data } = await apiClient.get('/staff/approved-release', { params });
    return data;
  },

  getRejectedRequests: async (params = {}) => {
    const { data } = await apiClient.get('/staff/rejected-requests', { params });
    return data;
  },

  approveRequest: async (id) => {
    const { data } = await apiClient.patch(`/staff/requests/${id}/approve`);
    return data;
  },

  rejectRequest: async (id, payload = {}) => {
    const { data } = await apiClient.patch(`/staff/requests/${id}/reject`, payload);
    return data;
  },

  getApprovedForRelease: async () => {
    const { data } = await apiClient.get('/staff/approved-release');
    return data;
  },

  releaseDocument: async (requestId) => {
    const { data } = await apiClient.post('/staff/transactions', {
      request_id: requestId,
      transaction_type: 'release',
    });
    return data;
  },

  getStudents: async (params = {}) => {
    const { data } = await apiClient.get('/staff/students', { params });
    return data;
  },

  getStudentById: async (id) => {
    const { data } = await apiClient.get(`/staff/students/${id}`);
    return data;
  },

  getReportsSummary: async () => {
    const { data } = await apiClient.get('/staff/reports/summary');
    return data;
  },

  getTransactionHistory: async (params = {}) => {
    const { data } = await apiClient.get('/staff/reports/transaction-history', { params });
    return data;
  },

  /**
   * Create a new student (staff/admin only).
   * Payload: student_number, first_name, last_name, date_of_birth, email,
   * contact_number?, address?, enrollment_date, graduation_date?, GPA?
   */
  createStudent: async (payload) => {
    const { data } = await apiClient.post('/staff/students', payload);
    return data;
  },

  /**
   * Update an existing student (staff/admin only).
   */
  updateStudent: async (id, payload) => {
    const { data } = await apiClient.put(`/staff/students/${id}`, payload);
    return data;
  },
};

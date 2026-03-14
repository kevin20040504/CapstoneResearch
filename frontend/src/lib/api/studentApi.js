import { apiClient } from './client';

/**
 * Student API — profile, COR, subjects, grades, curriculum, record requests.
 * All endpoints require auth:sanctum and role:student.
 */
export const studentApi = {
  /** Get authenticated student's profile (student + program + academic year/semester). */
  getProfile: async () => {
    const { data } = await apiClient.get('/student/profile');
    return data;
  },

  /** Certificate of Registration — enrolled subjects for term. Params: academic_year?, semester? */
  getCOR: async (params = {}) => {
    const { data } = await apiClient.get('/student/cor', { params });
    return data;
  },

  /** Enrolled subjects. Params: academic_year?, semester? */
  getSubjects: async (params = {}) => {
    const { data } = await apiClient.get('/student/subjects', { params });
    return data;
  },

  /** Grades. Params: academic_year?, semester? */
  getGrades: async (params = {}) => {
    const { data } = await apiClient.get('/student/grades', { params });
    return data;
  },

  /** Curriculum for student's program (subjects by year level and semester). */
  getCurriculum: async () => {
    const { data } = await apiClient.get('/student/curriculum');
    return data;
  },

  /** List authenticated student's record requests (paginated). */
  getRecordRequests: async (params = {}) => {
    const { data } = await apiClient.get('/student/record-requests', { params });
    return data;
  },

  /** Submit a new record request. Payload: { record_type, purpose?, copies? } */
  createRecordRequest: async (payload) => {
    const { data } = await apiClient.post('/student/record-requests', payload);
    return data;
  },

  /** Get a single record request by id (own only). */
  getRecordRequest: async (id) => {
    const { data } = await apiClient.get(`/student/record-requests/${id}`);
    return data;
  },
};

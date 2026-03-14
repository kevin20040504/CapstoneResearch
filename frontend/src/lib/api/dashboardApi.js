import { apiClient } from './client';

/**
 * Dashboard API — role-based KPIs and recent activity (thesis: dashboard data by role).
 */
export const dashboardApi = {
  getDashboard: async () => {
    const { data } = await apiClient.get('/dashboard');
    return data;
  },
};

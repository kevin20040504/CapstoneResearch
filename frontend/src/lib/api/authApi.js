import { apiClient } from './client';

export const authApi = {
  /**
   * Login with username and password
   */
  login: async ({ username, password }) => {
    const { data } = await apiClient.post('/auth/login', {
      username,
      password,
    });
    return data;
  },

  /**
   * Logout (revoke current token)
   */
  logout: async () => {
    const { data } = await apiClient.post('/auth/logout');
    return data;
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async () => {
    const { data } = await apiClient.get('/user');
    return data;
  },
};

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

  /**
   * Change password (requires auth). Sends current_password, new password and confirmation.
   */
  changePassword: async ({ current_password, password, password_confirmation }) => {
    const { data } = await apiClient.post('/auth/change-password', {
      current_password,
      password,
      password_confirmation,
    });
    return data;
  },
};

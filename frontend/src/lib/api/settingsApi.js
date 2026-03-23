import { apiClient } from './client';


export const settingsApi = {
  getCurrentTerm: async () => {
    const { data } = await apiClient.get('/settings/current');
    return data;
  },
};

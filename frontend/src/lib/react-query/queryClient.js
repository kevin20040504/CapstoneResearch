import { QueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { clearStoredAuth } from '../authStorage';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const clearAuthOnUnauthorized = () => {
  clearStoredAuth();
  queryClient.setQueryData(queryKeys.auth.user(), null);
};

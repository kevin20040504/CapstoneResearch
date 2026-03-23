import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../lib/api/settingsApi';
import { queryKeys } from '../lib/react-query/queryKeys';

const STALE_MS = 60 * 1000;

export function useCurrentTermQuery() {
  return useQuery({
    queryKey: queryKeys.settings.currentTerm(),
    queryFn: () => settingsApi.getCurrentTerm(),
    staleTime: STALE_MS,
  });
}

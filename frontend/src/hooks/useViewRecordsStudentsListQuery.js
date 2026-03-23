import { useMemo } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { staffApi } from '../lib/api/staffApi';
import { queryKeys } from '../lib/react-query/queryKeys';
import {
  VIEW_RECORDS_LIST_GC_MS,
  VIEW_RECORDS_LIST_STALE_MS,
} from '../features/viewRecords/constants';

/**
 * Uses keepPreviousData so changing page keeps prior rows visible while fetching 
 */
export function useViewRecordsStudentsListQuery({ page, perPage, search, sort, dir }) {
  const filters = useMemo(
    () => ({
      page,
      perPage,
      search: search || undefined,
      sort,
      dir,
    }),
    [page, perPage, search, sort, dir],
  );

  const query = useQuery({
    queryKey: queryKeys.staff.studentsList(filters),
    queryFn: () =>
      staffApi.getStudents({
        page: filters.page,
        per_page: filters.perPage,
        search: filters.search,
        sort: filters.sort,
        dir: filters.dir,
      }),
    staleTime: VIEW_RECORDS_LIST_STALE_MS,
    gcTime: VIEW_RECORDS_LIST_GC_MS,
    placeholderData: keepPreviousData,
  });

  const payload = query.data;
  const total = typeof payload?.total === 'number' ? payload.total : 0;
  const lastPage = typeof payload?.last_page === 'number' ? Math.max(1, payload.last_page) : 1;
  const from = typeof payload?.from === 'number' ? payload.from : 0;
  const to = typeof payload?.to === 'number' ? payload.to : 0;
  const currentPage = typeof payload?.current_page === 'number' ? payload.current_page : page;

  return {
    ...query,
    filters,
    total,
    lastPage,
    from,
    to,
    currentPage,
  };
}

import { useMemo } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { adminApi } from '../lib/api/adminApi';
import { queryKeys } from '../lib/react-query/queryKeys';
import {
  ADMIN_USERS_LIST_GC_MS,
  ADMIN_USERS_LIST_STALE_MS,
} from '../features/admin/constants';


export function useAdminUsersListQuery({ page, perPage, search, role, sort, dir }) {
  const filters = useMemo(
    () => ({
      page,
      perPage,
      search: search || undefined,
      role: role || undefined,
      sort,
      dir,
    }),
    [page, perPage, search, role, sort, dir],
  );

  const query = useQuery({
    queryKey: queryKeys.admin.usersList(filters),
    queryFn: () =>
      adminApi.getUsers({
        page: filters.page,
        per_page: filters.perPage,
        search: filters.search,
        role: filters.role,
        sort: filters.sort,
        dir: filters.dir,
      }),
    staleTime: ADMIN_USERS_LIST_STALE_MS,
    gcTime: ADMIN_USERS_LIST_GC_MS,
    placeholderData: keepPreviousData,
  });

  const payload = query.data;
  const total = typeof payload?.total === 'number' ? payload.total : 0;
  const lastPage = typeof payload?.last_page === 'number' ? Math.max(1, payload.last_page) : 1;
  const from = typeof payload?.from === 'number' ? payload.from : 0;
  const to = typeof payload?.to === 'number' ? payload.to : 0;
  const currentPage =
    typeof payload?.current_page === 'number' ? payload.current_page : page;
  const rows = Array.isArray(payload?.data) ? payload.data : [];

  return {
    ...query,
    filters,
    total,
    lastPage,
    from,
    to,
    currentPage,
    rows,
  };
}

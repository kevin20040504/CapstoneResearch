import { useQuery } from '@tanstack/react-query';
import { staffApi } from '../lib/api/staffApi';
import { queryKeys } from '../lib/react-query/queryKeys';
import {
  VIEW_RECORDS_DETAIL_GC_MS,
  VIEW_RECORDS_DETAIL_STALE_MS,
} from '../features/viewRecords/constants';

/**
 * Cached per student id so revisiting the same row does not hit the API while stale.
 */
export function useViewRecordsStudentDetailQuery(studentId) {
  return useQuery({
    queryKey: queryKeys.staff.studentDetail(studentId),
    queryFn: () => staffApi.getStudentById(studentId),
    enabled: studentId != null,
    staleTime: VIEW_RECORDS_DETAIL_STALE_MS,
    gcTime: VIEW_RECORDS_DETAIL_GC_MS,
  });
}

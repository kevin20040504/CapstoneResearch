export const VIEW_RECORDS_SEARCH_DEBOUNCE_MS = 400;

export const VIEW_RECORDS_DEFAULT_PER_PAGE = 10;

export const VIEW_RECORDS_PER_PAGE_OPTIONS = [5, 10, 15, 25];

export const VIEW_RECORDS_LIST_STALE_MS = 60_000;
export const VIEW_RECORDS_LIST_GC_MS = 10 * 60_000;

export const VIEW_RECORDS_DETAIL_STALE_MS = 5 * 60_000;
export const VIEW_RECORDS_DETAIL_GC_MS = 30 * 60_000;

export const VIEW_RECORDS_SORT_OPTIONS = [
  { value: 'name|asc', label: 'Name (A–Z)' },
  { value: 'name|desc', label: 'Name (Z–A)' },
  { value: 'student_id|asc', label: 'Student ID (asc)' },
  { value: 'student_id|desc', label: 'Student ID (desc)' },
  { value: 'course|asc', label: 'Course (A–Z)' },
  { value: 'course|desc', label: 'Course (Z–A)' },
];

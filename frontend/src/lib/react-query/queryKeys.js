export const queryKeys = {
  auth: {
    all: ['auth'],
    user: () => [...queryKeys.auth.all, 'user'],
  },
  staff: {
    all: ['staff'],
    pendingRequests: () => [...queryKeys.staff.all, 'pending-requests'],
    approvedForRelease: () => [...queryKeys.staff.all, 'approved-release'],
    students: (search) => [...queryKeys.staff.all, 'students', search ?? ''],
    reports: () => [...queryKeys.staff.all, 'reports'],
  },
};

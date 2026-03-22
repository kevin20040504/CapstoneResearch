export const queryKeys = {
  auth: {
    all: ['auth'],
    user: () => [...queryKeys.auth.all, 'user'],
  },
  staff: {
    all: ['staff'],
    pendingRequests: () => [...queryKeys.staff.all, 'pending-requests'],
    approvedForRelease: () => [...queryKeys.staff.all, 'approved-release'],
    studentsList: (filters) => [...queryKeys.staff.all, 'students', filters],
    programs: () => [...queryKeys.staff.all, 'programs'],
    reports: () => [...queryKeys.staff.all, 'reports'],
  },
};

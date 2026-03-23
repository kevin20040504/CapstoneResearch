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
    studentDetail: (id) => [...queryKeys.staff.all, 'student', id],
    programs: () => [...queryKeys.staff.all, 'programs'],
    reports: () => [...queryKeys.staff.all, 'reports'],
  },
};

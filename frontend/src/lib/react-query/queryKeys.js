export const queryKeys = {
  auth: {
    all: ['auth'],
    user: () => [...queryKeys.auth.all, 'user'],
  },
};

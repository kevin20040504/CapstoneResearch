const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
};

export const getStoredAuth = () => {
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user };
};

export const setStoredAuth = (token, user) => {
  if (token) localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
  if (user) localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
};

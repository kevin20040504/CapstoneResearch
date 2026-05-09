const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
};

export const getStoredAuth = () => {
  const token = sessionStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  const userStr = sessionStorage.getItem(AUTH_STORAGE_KEYS.USER);
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user };
};

export const setStoredAuth = (token, user) => {
  if (token) sessionStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
  if (user) sessionStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
};

export const clearStoredAuth = () => {
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER);
};

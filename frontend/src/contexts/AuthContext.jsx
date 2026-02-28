import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  useLoginMutation,
  useLogoutMutation,
  useCurrentUserQuery,
} from '../lib/react-query/authQueries';
import { getStoredAuth, clearStoredAuth } from '../lib/authStorage';
import { queryKeys } from '../lib/react-query/queryKeys';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

/**
 * Get the primary role from user (Spatie roles or user.role)
 */
export const getUserRole = (user) => {
  if (!user) return null;
  if (user.roles?.length) return user.roles[0].name;
  return user.role || null;
};

/**
 * Role-based route paths
 */
export const ROLE_ROUTES = {
  admin: '/admin',
  staff: '/admin',
  student: '/dashboard',
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const { data: user, isLoading: isUserLoading } = useCurrentUserQuery();

  // Clear auth query cache when 401 is received (api client dispatches auth:logout)
  useEffect(() => {
    const handler = () => {
      queryClient.setQueryData(queryKeys.auth.user(), null);
    };
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [queryClient]);

  const { token } = getStoredAuth();
  const isAuthenticated = !!token && !!user;
  const role = getUserRole(user);

  const login = useCallback(
    async (credentials) => {
      const result = await loginMutation.mutateAsync(credentials);
      const userRole = getUserRole(result.user);
      const redirectPath = ROLE_ROUTES[userRole] || '/dashboard';
      navigate(redirectPath, { replace: true });
      return result;
    },
    [loginMutation, navigate]
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      clearStoredAuth();
    }
    navigate('/', { replace: true });
  }, [logoutMutation, navigate]);

  const value = {
    user,
    role,
    isAuthenticated,
    isLoading: isUserLoading,
    login,
    logout,
    loginMutation,
    logoutMutation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

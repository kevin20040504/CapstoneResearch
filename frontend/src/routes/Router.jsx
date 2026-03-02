import React from 'react';
import { createBrowserRouter, Outlet, useLocation, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import Login from '../pages/Login';
import StudentDashboard from '../pages/StudentDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import StaffLayout from '../layouts/StaffLayout';
import StaffDashboardPage from '../pages/StaffDashboardPage';
import StaffPendingRequestsPage from '../pages/StaffPendingRequestsPage';
import StaffStudentRecordsPage from '../pages/StaffStudentRecordsPage';
import StaffDocumentReleasePage from '../pages/StaffDocumentReleasePage';
import StaffReportsPage from '../pages/StaffReportsPage';
import StaffNewStudentPage from '../pages/StaffNewStudentPage';
import StaffEditStudentPage from '../pages/StaffEditStudentPage';
import RecordRequest from '../pages/RecordRequest';
import StudentSignup from '../pages/StudentSignup';
import { AuthProvider, useAuth, ROLE_ROUTES } from '../contexts/AuthContext';
import { queryClient } from '../lib/react-query/queryClient';

function RootLayout() {
  const location = useLocation();
  const isFullPage = location.pathname === '/' || location.pathname === '/signup';
  const isStudentDashboard = location.pathname === '/dashboard';
  const isStaffArea = location.pathname.startsWith('/staff');

  return (
    <>
      {!isFullPage && !isStudentDashboard && !isStaffArea && <Navbar />}
      {isFullPage || isStudentDashboard || isStaffArea ? (
        <Outlet />
      ) : (
        <div className="container">
          <Outlet />
        </div>
      )}
    </>
  );
}

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to={ROLE_ROUTES[role] || '/dashboard'} replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootLayout />
        </AuthProvider>
      </QueryClientProvider>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'signup', element: <StudentSignup /> },
      { path: 'login', element: <Login /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute allowedRoles={['student', 'admin', 'staff']}>
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'staff',
        element: (
          <ProtectedRoute allowedRoles={['staff', 'admin']}>
            <StaffLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <StaffDashboardPage /> },
          { path: 'requests', element: <StaffPendingRequestsPage /> },
          { path: 'students', element: <StaffStudentRecordsPage /> },
          { path: 'students/new', element: <StaffNewStudentPage /> },
          { path: 'students/:id/edit', element: <StaffEditStudentPage /> },
          { path: 'document-release', element: <StaffDocumentReleasePage /> },
          { path: 'reports', element: <StaffReportsPage /> },
        ],
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'request',
        element: (
          <ProtectedRoute allowedRoles={['student', 'admin', 'staff']}>
            <RecordRequest />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;

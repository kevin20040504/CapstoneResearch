import React from 'react';
import { createBrowserRouter, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import Login from '../pages/Login';
import StudentDashboard from '../pages/StudentDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import RecordRequest from '../pages/RecordRequest';
import StudentSignup from '../pages/StudentSignup';

function RootLayout() {
  const location = useLocation();
  const isFullPage = location.pathname === '/' || location.pathname === '/signup';
  const isStudentDashboard = location.pathname === '/dashboard';

  return (
    <>
      {!isFullPage && !isStudentDashboard && <Navbar />}
      {isFullPage || isStudentDashboard ? (
        <Outlet />
      ) : (
        <div className="container">
          <Outlet />
        </div>
      )}
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'signup', element: <StudentSignup /> },
      { path: 'login', element: <Login /> },
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'admin', element: <AdminDashboard /> },
      { path: 'request', element: <RecordRequest /> },
    ],
  },
]);

export default router;

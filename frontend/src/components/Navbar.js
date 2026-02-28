import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, role, logout, logoutMutation } = useAuth();

  return (
    <nav className="navbar">
      <div className="brand">
        <Link to="/">ASRMS</Link>
      </div>
      <div className="links">
        <Link to="/">Home</Link>
        {isAuthenticated && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/request">Request Record</Link>
            {(role === 'admin' || role === 'staff') && <Link to="/admin">Admin</Link>}
            <span className="navbar-user">{user?.name || user?.username}</span>
            <button
              type="button"
              className="navbar-logout"
              onClick={() => logout()}
              disabled={logoutMutation.isPending}
            >
              Logout
            </button>
          </>
        )}
        {!isAuthenticated && <Link to="/">Login</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar">
    <div className="brand">
      <Link to="/">ASRMS</Link>
    </div>
    <div className="links">
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/request">Request Record</Link>
      <Link to="/admin">Admin</Link>
      <Link to="/login">Login</Link>
    </div>
  </nav>
);

export default Navbar;
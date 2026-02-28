import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const user = username.trim();
    const pass = password;
    if (!user) {
      setError('Please enter your username.');
      return;
    }
    if (!pass) {
      setError('Please enter your password.');
      return;
    }
    console.log('logging in', { username: user, password: pass });
    // call backend API
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} noValidate aria-label="Sign in form">
        <div className="form-group">
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={e => { setUsername(e.target.value); setError(''); }}
            placeholder="Enter your username"
            autoComplete="username"
            aria-label="Username"
            aria-invalid={!!error && !username.trim()}
          />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <div className="form-password-wrap">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-label="Password"
              aria-invalid={!!error && !password}
            />
            <button
              type="button"
              className="form-password-toggle"
              onClick={() => setShowPassword(p => !p)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="primary">Sign In</button>
      </form>
    </div>
  );
};

export default Login;
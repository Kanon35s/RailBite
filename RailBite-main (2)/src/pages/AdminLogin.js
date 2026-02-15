import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin, isAdminAuthenticated } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    const result = adminLogin(credentials);
    setLoading(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Invalid credentials');
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-container">
        <div className="admin-auth-header">
          <div className="admin-auth-logo">
            <img
              src="/images/logo.png"
              alt="RailBite"
              className="admin-login-logo"
              style={{ width: '135px', height: '45px', objectFit: 'contain', cursor: 'pointer' }}
            />
            <h1>RailBite Admin</h1>
          </div>
          <p className="admin-auth-subtitle">
            Secure access to the RailBite dashboard.
          </p>
          <span className="admin-auth-badge">Administrator</span>
        </div>

        <form onSubmit={handleSubmit} className="admin-auth-form">
          {error && <div className="admin-login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter admin username"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="admin-auth-footer">
            {/* Optionally add a <Link> back to normal login here */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

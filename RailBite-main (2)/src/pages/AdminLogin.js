import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    setLoading(false);

    if (!result.success) {
      setError(result.message || 'Login failed');
      return;
    }

    const loggedUser = result.user;

    if (loggedUser.role !== 'admin') {
      setError('Admin access only');
      return;
    }

    // Optionally store a separate admin token if you want:
    localStorage.setItem('railbiteAdminToken', localStorage.getItem('railbiteToken') || '');
    localStorage.setItem('railbiteAdminUser', JSON.stringify(loggedUser));

    navigate('/admin/dashboard');
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-container">
        <h2>Admin Login</h2>

        <form onSubmit={handleAdminLogin} className="admin-auth-form">
          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Mock password reset
    alert('Password reset successful!');
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <span>🔑</span>
          </div>
          <h2 className="auth-subtitle">Reset Password</h2>
          <p style={{ color: 'var(--text-gray)' }}>Create a new strong password</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(212, 24, 61, 0.2)', 
            padding: '1rem', 
            borderRadius: '10px', 
            marginBottom: '1rem',
            color: 'var(--danger)',
            border: '1px solid var(--danger)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="Re-enter new password"
            />
          </div>

          <div className="password-requirements">
            <p><strong>Password must contain:</strong></p>
            <ul>
              <li>At least 6 characters</li>
              <li>Mix of letters and numbers</li>
              <li>At least one special character</li>
            </ul>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

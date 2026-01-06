import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    if (newPassword.length < 8) {
      setToast({ message: 'Password must be at least 8 characters', type: 'error' });
      return;
    }

    // Password validation
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    if (!hasUpper || !hasLower || !hasNumber) {
      setToast({ message: 'Password must contain uppercase, lowercase, and number', type: 'error' });
      return;
    }

    setToast({ message: 'Password reset successful!', type: 'success' });
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="hero-content">
            <img 
              src="images/logo.png" 
              alt="RailBite Logo" 
              style={{ width: '135px', height: '45px', display: 'block', margin: '0 auto' }} 
            />
          </div>
          <p style={{ color: 'var(--text-gray)' }}>Bangladesh Railway Food Service</p>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Reset Password</h2>
        <p style={{ color: 'var(--text-gray)', marginBottom: '2rem' }}>
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
            />
          </div>

                    <div className="password-requirements">
            <p><strong>Password must contain:</strong></p>
            <ul>
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
            </ul>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Reset Password
          </button>
        </form>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ResetPassword;
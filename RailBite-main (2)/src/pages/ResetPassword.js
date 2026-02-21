import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import Toast from '../components/Toast';

// ✅ Same helpers as Register.js
const getPasswordChecks = (password) => ({
  length:    password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number:    /[0-9]/.test(password),
  special:   /[!@#$%^&*(),.?":{}|<>]/.test(password),
});

const getStrengthLabel = (checks) => {
  const passed = Object.values(checks).filter(Boolean).length;
  if (passed <= 2) return { label: 'Weak',   color: '#e74c3c' };
  if (passed <= 4) return { label: 'Fair',   color: '#f39c12' };
  return             { label: 'Strong', color: '#27ae60' };
};

const checkItems = [
  { key: 'length',    label: 'At least 8 characters' },
  { key: 'uppercase', label: 'One uppercase letter (A–Z)' },
  { key: 'lowercase', label: 'One lowercase letter (a–z)' },
  { key: 'number',    label: 'One number (0–9)' },
  { key: 'special',   label: 'One special character (!@#$%^&* …)' },
];

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill token if coming from ForgotPassword page
  const [token, setToken]                   = useState(location.state?.token || '');
  const [newPassword, setNewPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]               = useState(false);
  const [toast, setToast]                   = useState(null);
  const [showChecks, setShowChecks]         = useState(false);

  const checks         = getPasswordChecks(newPassword);
  const strength       = getStrengthLabel(checks);
  const allChecksPassed = Object.values(checks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allChecksPassed) {
      setToast({ message: 'Password does not meet strength requirements', type: 'error' });
      setShowChecks(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    if (!token.trim()) {
      setToast({ message: 'Please enter your reset token', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword(token.trim(), newPassword);
      if (res.data.success) {
        setToast({ message: 'Password reset successful! Redirecting to login...', type: 'success' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setToast({ message: res.data.message || 'Reset failed', type: 'error' });
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || err.message || 'Reset failed',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="hero-content">
            <img
              src="/images/logo.png"
              alt="RailBite Logo"
              style={{ width: '135px', height: '45px', display: 'block', margin: '0 auto' }}
            />
          </div>
          <p style={{ color: 'var(--text-gray)' }}>Bangladesh Railway Food Service</p>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Reset Password</h2>
        <p style={{ color: 'var(--text-gray)', marginBottom: '2rem' }}>
          Enter your reset token and new password below.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Token field - pre-filled if coming from ForgotPassword */}
          <div className="form-group">
            <label>Reset Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your reset token here"
              required
            />
          </div>

          {/* ✅ New Password with live strength checker */}
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setShowChecks(true);
              }}
              onFocus={() => setShowChecks(true)}
              placeholder="Create a strong password"
              required
            />

            {/* Strength bar */}
            {showChecks && newPassword.length > 0 && (
              <div style={{ marginTop: '6px' }}>
                <div style={{
                  height: '4px',
                  borderRadius: '2px',
                  background: '#e0e0e0',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(Object.values(checks).filter(Boolean).length / 5) * 100}%`,
                    background: strength.color,
                    transition: 'width 0.3s ease, background 0.3s ease',
                  }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: strength.color, fontWeight: 600 }}>
                  {strength.label}
                </span>
              </div>
            )}

            {/* Requirements checklist */}
            {showChecks && (
              <ul style={{ listStyle: 'none', padding: '8px 0 0 0', margin: 0, fontSize: '0.8rem' }}>
                {checkItems.map(({ key, label }) => (
                  <li key={key} style={{
                    color: checks[key] ? '#27ae60' : '#888',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '3px',
                  }}>
                    <span style={{ fontSize: '0.9rem' }}>{checks[key] ? '✓' : '○'}</span>
                    {label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
            />
            {/* Inline match indicator */}
            {confirmPassword.length > 0 && (
              <p style={{
                fontSize: '0.78rem',
                marginTop: '4px',
                color: newPassword === confirmPassword ? '#27ae60' : '#e74c3c',
              }}>
                {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <div
            style={{ cursor: 'pointer', marginTop: '1rem', textAlign: 'center' }}
            onClick={() => navigate('/forgot-password')}
          >
            <span style={{ color: 'var(--text-gray)' }}>← Back to Forgot Password</span>
          </div>
        </form>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ResetPassword;

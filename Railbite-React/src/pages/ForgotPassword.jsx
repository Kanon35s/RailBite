import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock sending reset email
    setSent(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/login" className="back-link">
          <span>←</span> Back to Login
        </Link>

        <div className="auth-header">
          <div className="auth-logo">
            <span>🔒</span>
          </div>
          <h2 className="auth-subtitle">Forgot Password?</h2>
          <p style={{ color: 'var(--text-gray)' }}>
            {sent ? 'Check your email for reset instructions' : 'Enter your email to reset your password'}
          </p>
        </div>

        {sent ? (
          <div style={{ 
            background: 'rgba(76, 175, 80, 0.2)', 
            padding: '1.5rem', 
            borderRadius: '10px', 
            marginBottom: '1rem',
            color: 'var(--success)',
            border: '1px solid var(--success)',
            textAlign: 'center'
          }}>
            <p>✓ Password reset link has been sent to <strong>{email}</strong></p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              For demo purposes: <Link to="/reset-password" style={{ color: 'var(--primary-orange)' }}>Go to Reset Password</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;

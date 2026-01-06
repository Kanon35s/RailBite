import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="status-page">
        <div className="status-container">
          <div className="status-icon warning">📧</div>
          <h2 className="status-title">Check Your Email</h2>
          <p className="status-message">
            We've sent a password reset link to<br />
            <span className="status-email">{email}</span><br />
            Please check your inbox and follow the instructions.
          </p>
          <Link to="/login" className="btn btn-primary btn-block">
            Back to Login
          </Link>
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>
            <small style={{ color: 'var(--text-gray)' }}>
              For demo purposes: <Link to="/reset-password" style={{ color: 'var(--primary-orange)' }}>Go to Reset Password</Link>
            </small>
          </p>
        </div>
      </div>
    );
  }

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

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Forgot Password?</h2>
        <p style={{ color: 'var(--text-gray)', marginBottom: '2rem' }}>
          No worries! Enter your email address and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Send Reset Link
          </button>

          <div className="back-link" onClick={() => window.history.back()}>
            <span>←</span>
            <span>Back to Login</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
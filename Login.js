import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }

    const result = login(email, password);
    if (result.success) {
      setToast({ message: 'Login successful!', type: 'success' });
      
      // Check for intended URL
      const intendedUrl = localStorage.getItem('railbiteIntendedUrl');
      setTimeout(() => {
        if (intendedUrl) {
          localStorage.removeItem('railbiteIntendedUrl');
          navigate(intendedUrl);
        } else {
          navigate('/order-selection');
        }
      }, 1000);
    }
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

        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Welcome Back
        </h2>

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

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="forgot-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Login
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-gray)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary-orange)' }}>Register</Link>
          </p>
        </form>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Login;

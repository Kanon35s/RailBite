import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <span>🍽️</span>
            <h1>RailBite BD</h1>
          </div>
          <h2 className="auth-subtitle">Welcome Back!</h2>
          <p style={{ color: 'var(--text-gray)' }}>Login to continue ordering</p>
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
            <label>Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Enter your password"
            />
          </div>

          <div className="forgot-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Login
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-gray)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-orange)', fontWeight: '600' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

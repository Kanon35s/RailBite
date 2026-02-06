import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const result = await login(email, password);

      if (result.success) {
        setToast({ message: 'Login successful!', type: 'success' });
        
        setTimeout(() => {
          const intendedUrl = localStorage.getItem('railbiteIntendedUrl');
          if (intendedUrl) {
            localStorage.removeItem('railbiteIntendedUrl');
            navigate(intendedUrl);
          } else {
            navigate('/order-selection');
          }
        }, 1000);
      } else {
        setToast({ message: result.message || 'Login failed', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'An error occurred. Please try again.', type: 'error' });
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
            <div>
              <p style={{ color: 'var(--text-gray)' }}>Bangladesh Railway Food Service</p>
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            Welcome Back
          </h2>
        </div>

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

          <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
            <Link 
              to="/forgot-password" 
              style={{ color: 'var(--primary-orange)', fontSize: '0.9rem' }}
            >
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-gray)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-orange)' }}>
              Register
            </Link>
          </p>

          
        {/* Simple Admin Link */}
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-gray)', fontSize: '0.95rem' }}>
          Are you an{' '}
          <Link 
            to="/admin/login" 
            style={{ 
              color: 'var(--primary-orange)', 
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            Administrator
          </Link>
          ?
        </p>
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

export default Login;


      


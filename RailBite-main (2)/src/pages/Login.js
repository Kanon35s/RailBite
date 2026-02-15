import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
<<<<<<< HEAD
=======
import api from '../services/api';
>>>>>>> parent of 4e40cd62 (latest update on backend completion)

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< HEAD
=======
  const [mode, setMode] = useState('user'); // 'user' | 'delivery'
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setToast({ message: 'Please fill in all fields', type: 'error' });
=======
  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
      return;
    }

    try {
      setLoading(true);
      const result = await login(email, password);
<<<<<<< HEAD

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

=======
      setLoading(false);

      if (!result.success) {
        showToast(result.message || 'Login failed', 'error');
        return;
      }

      const loggedUser = result.user;

      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        const intendedUrl = localStorage.getItem('railbiteIntendedUrl');
        if (intendedUrl) {
          localStorage.removeItem('railbiteIntendedUrl');
          navigate(intendedUrl);
        } else {
          navigate('/order-selection');
        }
      }
    } catch (error) {
      setLoading(false);
      showToast('An error occurred. Please try again.', 'error');
    }
  };

  const handleDeliveryLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/delivery/login', { email, password });
      setLoading(false);

      if (!res.data.success) {
        showToast(res.data.message || 'Delivery staff login failed', 'error');
        return;
      }

      const { token, staff } = res.data;
      localStorage.setItem('railbiteStaffToken', token);
      localStorage.setItem('railbiteStaff', JSON.stringify(staff));

      const redirect =
        staff.type === 'train'
          ? '/delivery/train/dashboard'
          : staff.type === 'station'
          ? '/delivery/station/dashboard'
          : '/delivery/dashboard';

      navigate(redirect);
    } catch (error) {
      setLoading(false);
      const message =
        error.response?.data?.message || 'Delivery staff login failed';
      showToast(message, 'error');
    }
  };

  const handleSubmit = mode === 'user' ? handleUserLogin : handleDeliveryLogin;

>>>>>>> parent of 4e40cd62 (latest update on backend completion)
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="hero-content">
<<<<<<< HEAD
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
=======
            <img
              src="/images/logo.png"
              alt="RailBite Logo"
              style={{ width: '135px', height: '45px', display: 'block', margin: '0 auto' }}
            />
            <div>
              <p style={{ color: 'var(--text-gray)' }}>
                Bangladesh Railway Food Service
              </p>
            </div>
          </div>
          <h2
            style={{
              fontSize: '1.8rem',
              marginBottom: '0.75rem',
              textAlign: 'center',
            }}
          >
            Login
          </h2>

          {/* Small, clean toggle under title */}
          <div
            className="auth-toggle"
            style={{
              display: 'inline-flex',
              justifyContent: 'center',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '2px',
              margin: '0 auto 1.2rem',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <button
              type="button"
              className={`auth-toggle-btn ${mode === 'user' ? 'active' : ''}`}
              onClick={() => setMode('user')}
            >
              User
            </button>
            <button
              type="button"
              className={`auth-toggle-btn ${mode === 'delivery' ? 'active' : ''}`}
              onClick={() => setMode('delivery')}
            >
              Delivery Staff
            </button>
          </div>
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
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

<<<<<<< HEAD
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
=======
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading
              ? 'Logging in...'
              : mode === 'user'
              ? 'Login'
              : 'Login as Delivery Staff'}
          </button>

          <p
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              color: 'var(--text-gray)',
            }}
          >
            Forgot your password?{' '}
            <button
              type="button"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--primary-orange)',
                cursor: 'pointer',
                padding: 0,
              }}
              onClick={() => navigate('/forgot-password')}
            >
              Reset here
            </button>
          </p>

          <p
            style={{
              textAlign: 'center',
              marginTop: '0.5rem',
              color: 'var(--text-gray)',
            }}
          >
            Admin user?{' '}
            <button
              type="button"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--primary-orange)',
                cursor: 'pointer',
                padding: 0,
              }}
              onClick={() => navigate('/admin/login')}
            >
              Admin Login
            </button>
          </p>

          <p
            style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              color: 'var(--text-gray)',
            }}
          >
            Don&apos;t have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-orange)' }}>
              Create Account
            </Link>
          </p>
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
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
<<<<<<< HEAD


      

=======
>>>>>>> parent of 4e40cd62 (latest update on backend completion)

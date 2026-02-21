import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePhone = (phone) => {
    const re = /^(\+?880|0)?1[3-9]\d{8}$/;
    return re.test(phone.replace(/[-\s]/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !password) {
      setToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }

    if (!validatePhone(phone)) {
      setToast({ message: 'Please enter a valid Bangladeshi phone number', type: 'error' });
      return;
    }

    if (password.length < 8) {
      setToast({ message: 'Password must be at least 8 characters', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const result = await register(fullName, email, phone, password, role);

      if (result.success) {
        setToast({ message: 'Registration successful!', type: 'success' });
        setTimeout(() => {
          if (role === 'delivery') {
            navigate('/delivery/login');
          } else {
            const intendedUrl = localStorage.getItem('railbiteIntendedUrl');
            if (intendedUrl) {
              localStorage.removeItem('railbiteIntendedUrl');
              navigate(intendedUrl);
            } else {
              navigate('/order-selection');
            }
          }
        }, 1000);
      } else {
        setToast({ message: result.message || 'Registration failed', type: 'error' });
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
            Create Account
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Rashid Mostafa"
              required
            />
          </div>

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
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01898942731"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
            />
          </div>

          <div className="form-group">
            <label>Register as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="delivery">Delivery Staff</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-gray)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-orange)' }}>
              Login
            </Link>
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

export default Register;

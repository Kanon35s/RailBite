import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

// Password strength checker
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

const Register = () => {
  const [fullName, setFullName]   = useState('');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [password, setPassword]   = useState('');
  const [role, setRole]           = useState('customer');
  const [toast, setToast]         = useState(null);
  const [loading, setLoading]     = useState(false);
  const [showChecks, setShowChecks] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePhone = (phone) => {
    const re = /^(\+?880|0)?1[3-9]\d{8}$/;
    return re.test(phone.replace(/[-\s]/g, ''));
  };

  const checks  = getPasswordChecks(password);
  const strength = getStrengthLabel(checks);
  const allChecksPassed = Object.values(checks).every(Boolean);

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
    if (!allChecksPassed) {
      setToast({ message: 'Password does not meet strength requirements', type: 'error' });
      setShowChecks(true);
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

  const checkItems = [
    { key: 'length',    label: 'At least 8 characters' },
    { key: 'uppercase', label: 'One uppercase letter (A–Z)' },
    { key: 'lowercase', label: 'One lowercase letter (a–z)' },
    { key: 'number',    label: 'One number (0–9)' },
    { key: 'special',   label: 'One special character (!@#$%^&* …)' },
  ];

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

          {/* ✅ Password field with live strength checker */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setShowChecks(true);
              }}
              onFocus={() => setShowChecks(true)}
              placeholder="Create a strong password"
              required
            />

            {/* Strength bar — shows only after user starts typing */}
            {showChecks && password.length > 0 && (
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
              <ul style={{
                listStyle: 'none',
                padding: '8px 0 0 0',
                margin: 0,
                fontSize: '0.8rem',
              }}>
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

          <div className="form-group">
            <label>Register as</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
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

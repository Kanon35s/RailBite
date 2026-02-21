import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeliveryStaff } from '../context/DeliveryStaffContext';
import { authAPI } from '../services/api';

const DeliveryStaffLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { isStaffAuthenticated, staffLoginSuccess } = useDeliveryStaff();
    const navigate = useNavigate();

    useEffect(() => {
        if (isStaffAuthenticated) {
            navigate('/delivery/dashboard');
        }
    }, [isStaffAuthenticated, navigate]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!credentials.email || !credentials.password) {
            setError('Please enter both email and password');
            setLoading(false);
            return;
        }

        try {
            const res = await authAPI.login({
                email: credentials.email,
                password: credentials.password
            });

            if (res.data.success) {
                const { token, user } = res.data;

                if (user.role !== 'delivery') {
                    setError('Access denied. This portal is for delivery staff only.');
                    setLoading(false);
                    return;
                }

                staffLoginSuccess(user, token);
                navigate('/delivery/dashboard');
            } else {
                setError(res.data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-auth-page ds-auth-page">
            <div className="admin-auth-container ds-auth-container">
                <div className="admin-auth-header">
                    <div className="admin-auth-logo">
                        <img
                            src="/images/logo.png"
                            alt="RailBite"
                            className="admin-login-logo"
                            style={{ width: '135px', height: '45px', objectFit: 'contain', cursor: 'pointer' }}
                        />
                        <h1>Delivery Portal</h1>
                    </div>
                    <p className="admin-auth-subtitle">
                        Sign in to manage your deliveries
                    </p>
                    <span className="admin-auth-badge ds-badge">Delivery Staff</span>
                </div>

                <form onSubmit={handleSubmit} className="admin-auth-form">
                    {error && <div className="admin-login-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div className="admin-auth-footer">
                        <span>RailBite Delivery Portal</span>
                        <a href="/">Back to Home</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeliveryStaffLogin;

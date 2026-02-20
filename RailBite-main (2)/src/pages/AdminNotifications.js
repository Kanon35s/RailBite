import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { notificationAPI } from '../services/api';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    type: 'promotion',
    title: '',
    message: '',
    targetUser: 'all'
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('railbite_token');
      const res = await notificationAPI.getAll(token);
      if (res.data.success) {
        setNotifications(res.data.data || []);
      } else {
        setError(res.data.message || 'Failed to load notifications');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error loading notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      setToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('railbite_token');
      const res = await notificationAPI.send(formData, token);
      if (res.data.success) {
        setNotifications(prev => [res.data.data, ...prev]);
        setToast({ message: 'Notification sent successfully!', type: 'success' });
        setFormData({
          type: 'promotion',
          title: '',
          message: '',
          targetUser: 'all'
        });
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || err.message || 'Failed to send',
        type: 'error'
      });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      const token = localStorage.getItem('railbite_token');
      const res = await notificationAPI.delete(id, token);
      if (res.data.success) {
        setNotifications(prev => prev.filter(n => n._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete');
    }
  };

  const getTargetLabel = (target) => {
    const labels = {
      all: '👥 All Users',
      users: '🧑‍💻 Customers',
      delivery: '🚚 Delivery Staff',
      admin: '👑 Admins'
    };
    return labels[target] || target;
  };


  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>🔔 Send Notifications</h1>
          <p>Send notifications to users</p>
        </div>

        {/* Send Form */}
        <div className="admin-form-container">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Notification Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="promotion">🎉 Promotion</option>
                <option value="alert">⚠️ Alert</option>
                <option value="order">📦 Order Update</option>
                <option value="info">ℹ️ Information</option>
              </select>
            </div>

            <div className="form-group">
              <label>Target Users</label>
              <select
                name="targetUser"
                value={formData.targetUser}
                onChange={handleChange}
                required
              >
                <option value="all">👥 All Users</option>
                <option value="users">🧑‍💻 Customers Only</option>
                <option value="delivery">🚚 Delivery Staff Only</option>
                <option value="admin">👑 Admins Only</option>
              </select>
            </div>

            <div className="form-group">
              <label>Notification Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Special Offer!"
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your notification message..."
                rows="5"
                required
              />
            </div>

            {toast && (
              <div
                style={{
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '6px',
                  backgroundColor: toast.type === 'success' ? '#d4edda' : '#f8d7da',
                  color: toast.type === 'success' ? '#155724' : '#721c24'
                }}
              >
                {toast.message}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={sending}
            >
              {sending ? 'Sending...' : '📤 Send Notification'}
            </button>
          </form>
        </div>

        {/* Recent Notifications */}
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>
            Recent Notifications Sent ({notifications.length})
          </h2>

          {loading ? (
            <p>Loading notifications...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>Error: {error}</p>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Message</th>
                    <th>Target</th>
                    <th>Sent At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <tr key={notif._id}>
                        <td>
                          <span className="badge status-preparing">
                            {notif.type}
                          </span>
                        </td>
                        <td><strong>{notif.title}</strong></td>
                        <td>{notif.message.substring(0, 50)}...</td>
                        <td>{getTargetLabel(notif.targetUser)}</td>
                        <td>
                          {new Date(notif.createdAt).toLocaleDateString('en-BD', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td>
                          <button
                            className="admin-btn-delete"
                            onClick={() => handleDelete(notif._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                        No notifications sent yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;


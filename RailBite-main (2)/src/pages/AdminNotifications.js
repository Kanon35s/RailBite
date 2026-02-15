<<<<<<< HEAD
import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import AdminSidebar from '../components/AdminSidebar';
import Toast from '../components/Toast';

const AdminNotifications = () => {
  const { addNotification, notifications } = useOrder();
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    type: 'promotion',
    title: '',
    message: '',
    targetUser: 'all', // 'all' or specific userId
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      setToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }

    // Add notification for all users or specific user
    addNotification({
      userId: formData.targetUser,
      type: formData.type,
      title: formData.title,
      message: formData.message,
    });

    setToast({ message: 'Notification sent successfully!', type: 'success' });
    
    // Reset form
    setFormData({
      type: 'promotion',
      title: '',
      message: '',
      targetUser: 'all',
    });
=======
// src/pages/AdminNotifications.js
import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Toast from '../components/Toast';
import api from '../services/api';

const AdminNotifications = () => {
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetGroup: 'all', // all | users | staff
    link: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      setToast({
        message: 'Please fill in all fields',
        type: 'error',
      });
      return;
    }

    try {
      await api.post('/admin/notifications', {
        title: formData.title,
        message: formData.message,
        targetGroup: formData.targetGroup,
        link: formData.link || null,
      });

      setToast({
        message: 'Notification sent successfully!',
        type: 'success',
      });

      setFormData({
        title: '',
        message: '',
        targetGroup: 'all',
        link: '',
      });
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message || 'Failed to send notification',
        type: 'error',
      });
    }
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
<<<<<<< HEAD
          <h1>🔔 Send Notifications</h1>
          <p>Send notifications to users</p>
=======
          <h1>Send Notifications</h1>
          <p>Create notifications for users and delivery staff</p>
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
        </div>

        <div className="admin-form-container">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
<<<<<<< HEAD
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
                <option value="all">All Users</option>
=======
              <label>Target Group</label>
              <select
                name="targetGroup"
                value={formData.targetGroup}
                onChange={handleChange}
                required
              >
                <option value="all">All</option>
                <option value="users">Users</option>
                <option value="staff">Delivery Staff</option>
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
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
<<<<<<< HEAD
                rows="5"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              📤 Send Notification
=======
                rows={5}
                required
              />
            </div>

            <div className="form-group">
              <label>Optional Link (e.g., /offers)</label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="/offers"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Send Notification
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
            </button>
          </form>
        </div>

<<<<<<< HEAD
        {/* Recent Notifications */}
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Recent Notifications Sent</h2>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Sent At</th>
                </tr>
              </thead>
              <tbody>
                {safeNotifications.slice(0, 10).map((notif) => (
                  <tr key={notif.id}>
                    <td>
                      <span className="badge status-preparing">{notif.type}</span>
                    </td>
                    <td>{notif.title}</td>
                    <td>{notif.message.substring(0, 50)}...</td>
                    <td>
                      {new Date(notif.createdAt).toLocaleDateString('en-BD', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
=======
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
    </div>
  );
};

export default AdminNotifications;

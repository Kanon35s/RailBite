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
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Send Notifications</h1>
          <p>Create notifications for users and delivery staff</p>
        </div>

        <div className="admin-form-container">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
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
            </button>
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
    </div>
  );
};

export default AdminNotifications;

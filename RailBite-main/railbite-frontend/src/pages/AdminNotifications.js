// src/pages/AdminNotifications.js
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Toast from '../components/Toast';
import { notificationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminNotifications = () => {
  const { user } = useAuth(); // ensure route is admin-protected on the router level
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    type: 'promotion',
    title: '',
    message: '',
    targetUser: 'all', // 'all' or a specific user id (future)
    link: '', // optional deep link
  });

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationsAPI.adminListAll();
      if (res.data.success) {
        setNotifications(res.data.data || []);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error('Admin loadNotifications error:', err);
      setToast({
        message: err.response?.data?.message || 'Failed to load notifications',
        type: 'error',
      });
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      const payload = {
        type: formData.type,
        title: formData.title,
        message: formData.message,
        target: formData.targetUser === 'all' ? 'all' : 'user',
        userId: formData.targetUser === 'all' ? undefined : formData.targetUser,
        link: formData.link || undefined,
      };

      const res = await notificationsAPI.adminCreate(payload);

      if (res.data.success) {
        setToast({
          message: 'Notification sent successfully!',
          type: 'success',
        });
        await loadNotifications();
        setFormData({
          type: 'promotion',
          title: '',
          message: '',
          targetUser: 'all',
          link: '',
        });
      } else {
        setToast({
          message: res.data.message || 'Failed to send notification',
          type: 'error',
        });
      }
    } catch (err) {
      console.error('Admin createNotification error:', err);
      setToast({
        message:
          err.response?.data?.message || 'Failed to send notification',
        type: 'error',
      });
    }
  };

  const handleMarkRead = async (id) => {
    try {
      const res = await notificationsAPI.adminMarkRead(id);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
      }
    } catch (err) {
      console.error('Admin mark read error:', err);
      setToast({
        message:
          err.response?.data?.message || 'Failed to mark notification as read',
        type: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await notificationsAPI.adminDelete(id);
      if (res.data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        setToast({
          message: 'Notification deleted successfully',
          type: 'success',
        });
      } else {
        setToast({
          message: res.data.message || 'Failed to delete notification',
          type: 'error',
        });
      }
    } catch (err) {
      console.error('Admin delete notification error:', err);
      setToast({
        message:
          err.response?.data?.message || 'Failed to delete notification',
        type: 'error',
      });
    }
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return `${mins}m ago`;
    }
    if (diffInSeconds < 86400) {
      const hrs = Math.floor(diffInSeconds / 3600);
      return `${hrs}h ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks}w ago`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Admin Notifications
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Send and manage notifications sent to RailBite users.
            </p>
          </header>

          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}

          {/* Send notification form */}
          <section className="bg-white rounded-xl shadow-sm p-5 md:p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Send Notification
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="promotion">Promotion</option>
                    <option value="order">Order</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target
                  </label>
                  <select
                    name="targetUser"
                    value={formData.targetUser}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Users</option>
                    {/* later you can add specific users here */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Optional Link
                  </label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="/menu or /order-history"
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter notification title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write the notification message..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                >
                  Send Notification
                </button>
              </div>
            </form>
          </section>

          {/* Notifications list */}
          <section className="bg-white rounded-xl shadow-sm p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Sent Notifications
              </h2>
              <button
                onClick={loadNotifications}
                className="text-xs text-blue-600 hover:underline"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-gray-500">
                No notifications found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Message</th>
                      <th className="px-4 py-2 text-left">User</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Sent At</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((notif) => (
                      <tr
                        key={notif._id}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                            {notif.type || 'system'}
                          </span>
                        </td>
                        <td className="px-4 py-2 font-medium text-gray-800">
                          {notif.title}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {notif.message?.length > 80
                            ? `${notif.message.substring(0, 80)}…`
                            : notif.message}
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-600">
                          {notif.user?.name || 'Multiple / All'}
                        </td>
                        <td className="px-4 py-2">
                          {notif.read ? (
                            <span className="text-xs text-green-600">
                              Read
                            </span>
                          ) : (
                            <span className="text-xs text-orange-500">
                              Unread
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-gray-500 text-xs">
                          {notif.createdAt
                            ? new Date(
                                notif.createdAt
                              ).toLocaleString('en-BD', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                          <span className="ml-1 text-gray-400">
                            ({getRelativeTime(notif.createdAt)})
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right space-x-2">
                          {!notif.read && (
                            <button
                              onClick={() => handleMarkRead(notif._id)}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notif._id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminNotifications;

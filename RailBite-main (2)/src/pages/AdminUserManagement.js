// src/pages/AdminUserManagement.js
import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Toast from '../components/Toast';
import api from '../services/api';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data.data || []);
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message || 'Failed to load users',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await api.put(`/admin/users/${id}/status`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, status: newStatus } : u
        )
      );
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message || 'Failed to update status',
        type: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setToast({ message: 'User deleted', type: 'success' });
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message || 'Failed to delete user',
        type: 'error',
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.phone?.includes(searchQuery);
    const matchesRole =
      filterRole === 'all' ? true : user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const customerCount = users.filter((u) => u.role === 'customer').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const activeUsers = users.filter((u) => u.status === 'active').length;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>User Management</h1>
          <p>Manage registered users and their status</p>
        </div>

        <div className="admin-stats-grid admin-stats-grid-small">
          <div className="admin-stat-card admin-stat-users">
            <div className="admin-stat-content">
              <p className="admin-stat-label">Total Users</p>
              <h3 className="admin-stat-value">{totalUsers}</h3>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-customers">
            <div className="admin-stat-content">
              <p className="admin-stat-label">Customers</p>
              <h3 className="admin-stat-value">{customerCount}</h3>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-admins">
            <div className="admin-stat-content">
              <p className="admin-stat-label">Admins</p>
              <h3 className="admin-stat-value">{adminCount}</h3>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-active">
            <div className="admin-stat-content">
              <p className="admin-stat-label">Active</p>
              <h3 className="admin-stat-value">{activeUsers}</h3>
            </div>
          </div>
        </div>

        <div className="admin-filters">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="admin-filter-select"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>

        <div className="admin-card">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center' }}>
                      Loading...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center' }}>
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>
                        <strong>{user.name}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone || '-'}</td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          className={`admin-toggle-btn ${
                            user.status === 'active' ? 'active' : 'blocked'
                          }`}
                          onClick={() =>
                            toggleStatus(user._id, user.status)
                          }
                        >
                          {user.status === 'active'
                            ? 'Active'
                            : 'Blocked'}
                        </button>
                      </td>
                      <td>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td>
                        <button
                          className="admin-btn-delete"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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

export default AdminUserManagement;

import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    status: 'active',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const saved = localStorage.getItem('railbiteUsers');
    if (saved) {
      setUsers(JSON.parse(saved));
    } else {
      const defaultUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '01712345678',
          role: 'customer',
          status: 'active',
          joinDate: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '01812345678',
          role: 'customer',
          status: 'active',
          joinDate: new Date().toISOString(),
        },
        {
          id: 3,
          name: 'Admin User',
          email: 'admin@railbite.com',
          phone: '01912345678',
          role: 'admin',
          status: 'active',
          joinDate: new Date().toISOString(),
        },
      ];
      setUsers(defaultUsers);
      localStorage.setItem('railbiteUsers', JSON.stringify(defaultUsers));
    }
  };

  const saveUsers = (updatedUsers) => {
    localStorage.setItem('railbiteUsers', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.phone.includes(searchQuery);
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, filterRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      const updated = users.map((user) =>
        user.id === editingUser.id
          ? { ...formData, id: user.id, joinDate: user.joinDate }
          : user
      );
      saveUsers(updated);
    } else {
      const newUser = {
        ...formData,
        id: Date.now(),
        joinDate: new Date().toISOString(),
      };
      saveUsers([...users, newUser]);
    }

    resetForm();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updated = users.filter((user) => user.id !== id);
      saveUsers(updated);
    }
  };

  const toggleStatus = (id) => {
    const updated = users.map((user) =>
      user.id === id
        ? {
            ...user,
            status: user.status === 'active' ? 'blocked' : 'active',
          }
        : user
    );
    saveUsers(updated);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'customer',
      status: 'active',
    });
    setEditingUser(null);
    setShowAddModal(false);
  };

  // Stats for header cards
  const totalUsers = users.length;
  const customerCount = users.filter((u) => u.role === 'customer').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const activeUsers = users.filter((u) => u.status === 'active').length;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>User Management</h1>
            <p>Manage registered users and their roles</p>
          </div>
          <button
            className="admin-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add New User
          </button>
        </div>

        {/* Stats cards row */}
        <div className="admin-stats-grid admin-stats-grid-small">
          <div className="admin-stat-card admin-stat-users">
            <div className="admin-stat-icon">👥</div>
            <div className="admin-stat-content">
              <p className="admin-stat-label">Total Users</p>
              <h3 className="admin-stat-value">{totalUsers}</h3>
              <span className="admin-stat-sub">All registered accounts</span>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-customers">
            <div className="admin-stat-icon">🧑‍💻</div>
            <div className="admin-stat-content">
              <p className="admin-stat-label">Customers</p>
              <h3 className="admin-stat-value">{customerCount}</h3>
              <span className="admin-stat-sub">Customer profiles</span>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-active">
            <div className="admin-stat-icon">✅</div>
            <div className="admin-stat-content">
              <p className="admin-stat-label">Active</p>
              <h3 className="admin-stat-value">{activeUsers}</h3>
              <span className="admin-stat-sub">Currently active</span>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-admins">
            <div className="admin-stat-icon">👑</div>
            <div className="admin-stat-content">
              <p className="admin-stat-label">Admins</p>
              <h3 className="admin-stat-value">{adminCount}</h3>
              <span className="admin-stat-sub">Admin accounts</span>
            </div>
          </div>
        </div>

        {/* Filters */}
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

        {/* Users table */}
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
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td>
                        <strong>{user.name}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span className={`admin-role-badge role-${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`admin-toggle-btn ${
                            user.status === 'active' ? 'active' : ''
                          }`}
                          onClick={() => toggleStatus(user.id)}
                        >
                          {user.status}
                        </button>
                      </td>
                      <td>
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="admin-action-buttons">
                          <button
                            className="admin-btn-edit"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-btn-delete"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showAddModal && (
          <div className="admin-modal-overlay" onClick={resetForm}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
                <button className="admin-modal-close" onClick={resetForm}>
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter full name"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="user@example.com"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="01712345678"
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Role *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;
